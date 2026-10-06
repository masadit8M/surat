import React, { useState, useEffect } from 'react';
import { SchoolDocument, PaperSize } from './types';
import { initialSKPembagianTugas } from './data/defaultDocument';
import { exportToDocx } from './utils/docxExport';
import { exportToPdf } from './utils/pdfExport';
import { Navbar } from './components/Navbar';
import { AdminEditor } from './components/AdminEditor';
import { A4Preview } from './components/A4Preview';
import { PrintDocument } from './components/PrintDocument';

export const App: React.FC = () => {
  // Load initial document from localStorage or fallback to analyzed default with migration to optimal A4/Folio fit
  const [doc, setDoc] = useState<SchoolDocument>(() => {
    try {
      const savedV3 = localStorage.getItem('tk_arjuna_current_doc_v3');
      if (savedV3) {
        const parsed: SchoolDocument = JSON.parse(savedV3);
        if (!parsed.docType) parsed.docType = 'sk';
        if (!parsed.formatSettings.paperSize) parsed.formatSettings.paperSize = 'A4';
        if (!parsed.formatSettings.fontSize) parsed.formatSettings.fontSize = '12pt';
        if (!parsed.institution.logoUrl || !parsed.institution.logoUrl.endsWith('/logo.png')) {
          parsed.institution.logoUrl = '/logo.png';
        }
        return parsed;
      }

      const savedV2 = localStorage.getItem('tk_arjuna_current_doc_v2');
      if (savedV2) {
        const parsed: SchoolDocument = JSON.parse(savedV2);
        parsed.docType = 'sk';
        parsed.institution.logoUrl = '/logo.png';
        parsed.formatSettings = {
          ...parsed.formatSettings,
          paperSize: 'A4',
          fontSize: '12pt',
        };
        return parsed;
      }
    } catch (e) {
      console.error('Failed to load saved doc', e);
    }
    return initialSKPembagianTugas;
  });

  const [zoomLevel, setZoomLevel] = useState<number>(85);
  const [activePageIndex, setActivePageIndex] = useState<number | 'all'>('all');
  const [isExportingDocx, setIsExportingDocx] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [pdfStatusMsg, setPdfStatusMsg] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Saved drafts list in localStorage
  const [savedDrafts, setSavedDrafts] = useState<
    { id: string; name: string; updatedAt: string }[]
  >(() => {
    try {
      const drafts = localStorage.getItem('tk_arjuna_drafts_index');
      if (drafts) return JSON.parse(drafts);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Auto-save current document to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem('tk_arjuna_current_doc_v3', JSON.stringify(doc));
    } catch (e) {
      console.error('LocalStorage error', e);
    }
  }, [doc]);

  // Handler for manual draft save
  const handleSaveDraft = () => {
    try {
      const draftKey = `tk_arjuna_draft_${doc.id || Date.now()}`;
      localStorage.setItem(draftKey, JSON.stringify(doc));

      const updatedIndex = [
        ...savedDrafts.filter((d) => d.id !== doc.id),
        {
          id: doc.id,
          name:
            doc.docType === 'official_letter'
              ? doc.officialLetter?.regarding || doc.name
              : doc.name || doc.documentInfo.subject || 'Surat Resmi',
          updatedAt: new Date().toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ];
      setSavedDrafts(updatedIndex);
      localStorage.setItem('tk_arjuna_drafts_index', JSON.stringify(updatedIndex));

      setSaveStatus('Tersimpan!');
      setTimeout(() => setSaveStatus(null), 2500);
    } catch (e) {
      alert('Gagal menyimpan draf ke memori browser.');
    }
  };

  const handleLoadDraft = (draftId: string) => {
    try {
      const data = localStorage.getItem(`tk_arjuna_draft_${draftId}`);
      if (data) {
        setDoc(JSON.parse(data));
      }
    } catch (e) {
      alert('Gagal memuat draf.');
    }
  };

  const handleSelectPreset = (presetDoc: SchoolDocument) => {
    if (
      window.confirm(
        `Ganti ke template "${presetDoc.name}"? Data yang sedang diedit akan digantikan.`
      )
    ) {
      setDoc(presetDoc);
    }
  };

  const handleReset = () => {
    if (
      window.confirm(
        'Kembalikan ke format baku SK Pembagian Tugas Mengajar 2026/2027 asli?'
      )
    ) {
      setDoc(initialSKPembagianTugas);
    }
  };

  const handleChangePaperSize = (paperSize: PaperSize) => {
    setDoc((prev) => ({
      ...prev,
      formatSettings: {
        ...prev.formatSettings,
        paperSize,
      },
    }));
  };

  const handleExportDocx = async () => {
    try {
      setIsExportingDocx(true);
      await exportToDocx(doc);
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat mengekspor file Word.');
    } finally {
      setIsExportingDocx(false);
    }
  };

  // Direct multi-page PDF generation via jspdf & html2canvas
  const handleExportPdf = async () => {
    try {
      setIsExportingPdf(true);
      setPdfStatusMsg('Memproses PDF...');
      await exportToPdf(doc, (msg) => setPdfStatusMsg(msg));
      setPdfStatusMsg('Selesai!');
      setTimeout(() => setPdfStatusMsg(null), 2000);
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat membuat file PDF.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Native browser print dialog (Ctrl+P)
  const handlePrint = () => {
    window.print();
  };

  const currentPaper = doc.formatSettings.paperSize || 'A4';

  return (
    <>
      {/* =========================================================================
          1. SCREEN WORKSPACE (TAMPILAN INTERAKTIF ADMIN LAYAR)
         ========================================================================= */}
      <div className="no-print h-screen flex flex-col bg-slate-950 font-sans text-slate-800 antialiased overflow-hidden">
        {/* Top Navigation Bar */}
        <Navbar
          doc={doc}
          onSelectPreset={handleSelectPreset}
          onExportDocx={handleExportDocx}
          onExportPdf={handleExportPdf}
          onPrint={handlePrint}
          onSaveDraft={handleSaveDraft}
          savedDrafts={savedDrafts}
          onLoadDraft={handleLoadDraft}
          zoomLevel={zoomLevel}
          onZoomChange={setZoomLevel}
          activePageIndex={activePageIndex}
          onPageChange={setActivePageIndex}
          onChangePaperSize={handleChangePaperSize}
          isExportingDocx={isExportingDocx}
          isExportingPdf={isExportingPdf}
          saveStatus={saveStatus}
          pdfStatusMsg={pdfStatusMsg}
        />

        {/* Main Split Layout: Editor on Left, Realistic Canvas on Right */}
        <main className="flex-1 flex overflow-hidden">
          {/* Left Panel: Admin Form Input (Universal, No-Hassle Formatter) */}
          <section className="w-full sm:w-[480px] lg:w-[500px] xl:w-[520px] flex-shrink-0 h-full border-r border-slate-800 z-10">
            <AdminEditor
              doc={doc}
              onChange={setDoc}
              onReset={handleReset}
            />
          </section>

          {/* Right Panel: Live Preview Paper Canvas */}
          <section className="flex-1 h-full bg-slate-800 overflow-y-auto overflow-x-auto p-8 relative flex flex-col items-center">
            {/* Informative Guidance Banner on Top of Canvas */}
            <div className="mb-4 max-w-2xl text-center bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2 text-xs text-slate-300 shadow-sm flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Kertas: {currentPaper === 'F4' ? 'FOLIO / F4 (215×330 mm)' : 'A4 (210×297 mm)'} &bull; Font 12pt Terstandar
              </span>
              <span className="text-[11px] text-slate-400">
                Pilih <b>Word</b> atau <b>PDF</b> untuk ekspor otomatis tanpa ribet margin
              </span>
            </div>

            {/* Render Screen Preview Container */}
            <div className="doc-page-container">
              <A4Preview
                doc={doc}
                zoomLevel={zoomLevel}
                activePageIndex={activePageIndex}
              />
            </div>
          </section>
        </main>
      </div>

      {/* =========================================================================
          2. DEDICATED PRINT / EXPORT WORKSPACE (HANYA AKTIF SAAT CETAK / DI-CAPTURE)
          Bebas dari CSS transform, dinamis A4 / Folio F4
         ========================================================================= */}
      <div id="print-root" className="hidden print:block">
        <PrintDocument doc={doc} />
      </div>
    </>
  );
};

export default App;
