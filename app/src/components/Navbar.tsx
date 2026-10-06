import React, { useState } from 'react';
import {
  Printer,
  Download,
  Save,
  FolderOpen,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileCheck,
  ChevronDown,
  Sparkles,
  Check,
  FileText,
  Loader2,
  FileSpreadsheet,
} from 'lucide-react';
import { SchoolDocument, PaperSize } from '../types';
import { documentPresetsList } from '../data/defaultDocument';

interface NavbarProps {
  doc: SchoolDocument;
  onSelectPreset: (presetDoc: SchoolDocument) => void;
  onExportDocx: () => void;
  onExportPdf: () => void;
  onPrint: () => void;
  onSaveDraft: () => void;
  savedDrafts: { id: string; name: string; updatedAt: string }[];
  onLoadDraft: (id: string) => void;
  zoomLevel: number;
  onZoomChange: (val: number) => void;
  activePageIndex: number | 'all';
  onPageChange: (val: number | 'all') => void;
  onChangePaperSize: (size: PaperSize) => void;
  isExportingDocx: boolean;
  isExportingPdf: boolean;
  saveStatus: string | null;
  pdfStatusMsg: string | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  doc,
  onSelectPreset,
  onExportDocx,
  onExportPdf,
  onPrint,
  onSaveDraft,
  savedDrafts,
  onLoadDraft,
  zoomLevel,
  onZoomChange,
  activePageIndex,
  onPageChange,
  onChangePaperSize,
  isExportingDocx,
  isExportingPdf,
  saveStatus,
  pdfStatusMsg,
}) => {
  const [showPresetsMenu, setShowPresetsMenu] = useState(false);
  const [showDraftsMenu, setShowDraftsMenu] = useState(false);

  const currentPaper = doc.formatSettings.paperSize || 'A4';
  const isSK = doc.docType === 'sk';

  return (
    <header className="no-print h-16 bg-slate-900 text-white flex items-center justify-between px-4 sm:px-5 border-b border-slate-800 shadow-md flex-shrink-0 z-30">
      {/* Brand & Document Name */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-900/30 overflow-hidden flex-shrink-0">
          <img
            src="/logo.png"
            alt="Logo Yayasan Arjuna Cendekia"
            className="w-8 h-8 object-contain"
          />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>{doc.institution.yayasan || 'YAYASAN ARJUNA CENDEKIA'}</span>
            </h1>

            {/* Paper Size Indicator Badge */}
            <span className="text-[10px] uppercase tracking-wider font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded">
              {currentPaper === 'F4' ? 'FOLIO (215×330)' : 'A4 (210×297)'}
            </span>

            {/* Standard Font Size Badge */}
            <span className="hidden sm:inline-block text-[10px] tracking-wider font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 px-1.5 py-0.5 rounded">
              Font 12pt
            </span>
          </div>

          <p className="text-[11px] text-slate-400 truncate max-w-xs sm:max-w-md">
            {doc.docType === 'official_letter'
              ? doc.officialLetter?.regarding || doc.name
              : doc.docType === 'free_text'
              ? doc.freeText?.title || 'Surat Bebas Terformat'
              : doc.documentInfo.subject || doc.name}
          </p>
        </div>
      </div>

      {/* Middle Controls: Paper Switcher, Page Selector, Zoom */}
      <div className="hidden md:flex items-center gap-3 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60 text-xs">
        {/* One-Click Paper Toggle */}
        <div className="flex items-center bg-slate-900/80 p-0.5 rounded-lg border border-slate-700/50">
          <button
            onClick={() => onChangePaperSize('A4')}
            className={`px-2.5 py-1 rounded text-xs font-bold transition ${
              currentPaper === 'A4'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Ukuran A4: 210 x 297 mm"
          >
            A4
          </button>
          <button
            onClick={() => onChangePaperSize('F4')}
            className={`px-2.5 py-1 rounded text-xs font-bold transition ${
              currentPaper === 'F4'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Ukuran Folio / F4: 215 x 330 mm (Standar Sekolah & Yayasan)"
          >
            Folio (F4)
          </button>
        </div>

        {/* Page Switcher (Khusus mode SK multi-halaman) */}
        {isSK && (
          <>
            <div className="h-4 w-[1px] bg-slate-700" />
            <div className="flex items-center gap-1 bg-slate-900/60 p-0.5 rounded-lg border border-slate-700/40">
              <button
                onClick={() => onPageChange('all')}
                className={`px-2 py-0.5 rounded text-xs font-medium transition ${
                  activePageIndex === 'all'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => onPageChange(1)}
                className={`px-2 py-0.5 rounded text-xs font-medium transition ${
                  activePageIndex === 1
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Hal 1
              </button>
              {doc.lampiran1?.enabled && (
                <button
                  onClick={() => onPageChange(2)}
                  className={`px-2 py-0.5 rounded text-xs font-medium transition ${
                    activePageIndex === 2
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Hal 2
                </button>
              )}
              {doc.lampiran2?.enabled && (
                <button
                  onClick={() => onPageChange(doc.lampiran1?.enabled ? 3 : 2)}
                  className={`px-2 py-0.5 rounded text-xs font-medium transition ${
                    activePageIndex === (doc.lampiran1?.enabled ? 3 : 2)
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Hal 3
                </button>
              )}
            </div>
          </>
        )}

        <div className="h-4 w-[1px] bg-slate-700" />

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 text-slate-300">
          <button
            onClick={() => onZoomChange(Math.max(40, zoomLevel - 10))}
            className="p-1 hover:text-white transition"
            title="Perkecil (-)"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="w-10 text-center font-mono text-[11px] text-slate-200">
            {zoomLevel}%
          </span>
          <button
            onClick={() => onZoomChange(Math.min(150, zoomLevel + 10))}
            className="p-1 hover:text-white transition"
            title="Perbesar (+)"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onZoomChange(85)}
            className="p-1 text-slate-400 hover:text-white transition ml-0.5"
            title="Reset Zoom ke 85%"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Action Buttons: Presets, Save, Print, Export */}
      <div className="flex items-center gap-2">
        {/* Templates Dropdown Button */}
        <div className="relative">
          <button
            onClick={() => {
              setShowPresetsMenu(!showPresetsMenu);
              setShowDraftsMenu(false);
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Template</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showPresetsMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 z-50">
              <div className="px-3 py-2 border-b border-slate-800 text-[11px] text-slate-400 font-semibold uppercase">
                Pilih Contoh Template Surat
              </div>
              {documentPresetsList.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    onSelectPreset(preset.data);
                    setShowPresetsMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-slate-800 flex items-center justify-between text-slate-200 group"
                >
                  <span className="font-medium group-hover:text-emerald-300">
                    {preset.title}
                  </span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded group-hover:bg-slate-700">
                    {preset.badge}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Drafts Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowDraftsMenu(!showDraftsMenu);
              setShowPresetsMenu(false);
            }}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition"
            title="Draf Tersimpan"
          >
            <FolderOpen className="w-4 h-4" />
          </button>

          {showDraftsMenu && (
            <div className="absolute right-0 mt-2 w-60 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 z-50">
              <div className="px-3 py-2 border-b border-slate-800 text-[11px] text-slate-400 font-semibold flex justify-between items-center">
                <span>DRAF DI MEMORI</span>
                <span className="text-[10px] text-emerald-400">{savedDrafts.length} draf</span>
              </div>
              {savedDrafts.length === 0 ? (
                <div className="p-3 text-xs text-slate-500 text-center">Belum ada draf.</div>
              ) : (
                savedDrafts.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      onLoadDraft(d.id);
                      setShowDraftsMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-slate-800 text-slate-200 flex flex-col"
                  >
                    <span className="font-medium truncate text-white">{d.name}</span>
                    <span className="text-[10px] text-slate-500">{d.updatedAt}</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Save Draft Button */}
        <button
          onClick={onSaveDraft}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          title="Simpan draf sekarang"
        >
          <Save className="w-3.5 h-3.5" />
          <span className="hidden md:inline">{saveStatus || 'Simpan'}</span>
        </button>

        {/* Browser Print (Ctrl+P) */}
        <button
          onClick={onPrint}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          title="Buka dialog cetak browser (Ctrl + P)"
        >
          <Printer className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Cetak</span>
        </button>

        {/* Download Word (.docx) */}
        <button
          onClick={onExportDocx}
          disabled={isExportingDocx}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-900/30 transition disabled:opacity-50"
          title="Download dokumen Microsoft Word (.docx) dengan tabel tanpa border"
        >
          {isExportingDocx ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <FileSpreadsheet className="w-3.5 h-3.5" />
          )}
          <span>Word</span>
        </button>

        {/* Download PDF (.pdf) */}
        <button
          onClick={onExportPdf}
          disabled={isExportingPdf}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-900/30 transition disabled:opacity-50"
          title="Download dokumen PDF beresolusi tinggi"
        >
          {isExportingPdf ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Download className="w-3.5 h-3.5" />
          )}
          <span>{pdfStatusMsg || 'PDF'}</span>
        </button>
      </div>
    </header>
  );
};
