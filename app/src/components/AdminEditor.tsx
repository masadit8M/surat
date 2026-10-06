import React, { useState } from 'react';
import {
  FileText,
  Mail,
  Edit3,
  Scale,
  Settings,
  Building,
  UserCheck,
  Plus,
  Trash2,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  ListPlus,
  Layers,
  HelpCircle,
} from 'lucide-react';
import {
  SchoolDocument,
  DocumentType,
  PaperSize,
  KonsideranItem,
  DiktumItem,
  KeyValueItem,
} from '../types';
import {
  officialSignatoryPresets,
  documentPresetsList,
} from '../data/defaultDocument';

interface AdminEditorProps {
  doc: SchoolDocument;
  onChange: (updated: SchoolDocument) => void;
  onReset: () => void;
}

export const AdminEditor: React.FC<AdminEditorProps> = ({ doc, onChange, onReset }) => {
  const [activeTab, setActiveTab] = useState<
    'content' | 'signatory' | 'paper_format' | 'kop' | 'sk_details'
  >('content');

  const [selectedPresetId, setSelectedPresetId] = useState<string>('kepala-tk');

  const updateDoc = (partial: Partial<SchoolDocument>) => {
    onChange({ ...doc, ...partial, updatedAt: new Date().toISOString() });
  };

  const handleDocTypeChange = (newType: DocumentType) => {
    updateDoc({ docType: newType });
  };

  const handleLoadTemplate = (templateData: SchoolDocument) => {
    onChange({
      ...templateData,
      id: doc.id || templateData.id,
      updatedAt: new Date().toISOString(),
    });
  };

  const applySignatoryPreset = (presetId: string) => {
    const preset = officialSignatoryPresets.find((p) => p.id === presetId);
    if (!preset) return;
    updateDoc({
      closing: {
        ...doc.closing,
        signeeRole: preset.role,
        signeeName: preset.name,
        signeeNip: preset.nip || '',
      },
    });
  };

  // --- KONSIDERAN HANDLERS (Untuk SK) ---
  const addKonsideran = (type: 'menimbang' | 'mengingat' | 'memperhatikan') => {
    const list = [...(doc.konsideran[type] || [])];
    const newItem: KonsideranItem = {
      id: `${type}-${Date.now()}`,
      text: `Butir baru ${type}...`,
    };
    updateDoc({
      konsideran: {
        ...doc.konsideran,
        [type]: [...list, newItem],
      },
    });
  };

  const updateKonsideranText = (
    type: 'menimbang' | 'mengingat' | 'memperhatikan',
    id: string,
    text: string
  ) => {
    const list = doc.konsideran[type].map((item) =>
      item.id === id ? { ...item, text } : item
    );
    updateDoc({
      konsideran: {
        ...doc.konsideran,
        [type]: list,
      },
    });
  };

  const deleteKonsideran = (
    type: 'menimbang' | 'mengingat' | 'memperhatikan',
    id: string
  ) => {
    const list = doc.konsideran[type].filter((item) => item.id !== id);
    updateDoc({
      konsideran: {
        ...doc.konsideran,
        [type]: list,
      },
    });
  };

  // --- DIKTUM HANDLERS (Untuk SK) ---
  const romanLabels = ['PERTAMA', 'KEDUA', 'KETIGA', 'KEEMPAT', 'KELIMA', 'KEENAM', 'KETUJUH'];
  const addDiktum = () => {
    const nextIdx = doc.diktum.length;
    const label = romanLabels[nextIdx] || `KE-${nextIdx + 1}`;
    const newItem: DiktumItem = {
      id: `diktum-${Date.now()}`,
      label,
      content: 'Keputusan ini berlaku...',
    };
    updateDoc({ diktum: [...doc.diktum, newItem] });
  };

  const updateDiktum = (id: string, key: 'label' | 'content', value: string) => {
    const list = doc.diktum.map((item) =>
      item.id === id ? { ...item, [key]: value } : item
    );
    updateDoc({ diktum: list });
  };

  const deleteDiktum = (id: string) => {
    updateDoc({ diktum: doc.diktum.filter((item) => item.id !== id) });
  };

  // --- OFFICIAL LETTER DETAILS HANDLERS ---
  const addDetailItem = () => {
    const current = doc.officialLetter?.details || [];
    const newItem: KeyValueItem = {
      id: `detail-${Date.now()}`,
      label: 'Hari / Tanggal',
      value: 'Senin, 01 Juli 2026',
    };
    updateDoc({
      officialLetter: {
        ...doc.officialLetter,
        details: [...current, newItem],
      },
    });
  };

  const updateDetailItem = (id: string, key: 'label' | 'value', val: string) => {
    const current = doc.officialLetter?.details || [];
    const updated = current.map((item) =>
      item.id === id ? { ...item, [key]: val } : item
    );
    updateDoc({
      officialLetter: {
        ...doc.officialLetter,
        details: updated,
      },
    });
  };

  const deleteDetailItem = (id: string) => {
    const current = doc.officialLetter?.details || [];
    updateDoc({
      officialLetter: {
        ...doc.officialLetter,
        details: current.filter((i) => i.id !== id),
      },
    });
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 text-slate-100 select-none">
      {/* 1. Quick Header: Mode Switcher & Quick Template Loader */}
      <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Format Dokumen :
            </span>
          </div>

          {/* Template Dropdown */}
          <div className="relative">
            <select
              aria-label="Pilih Template Cepat"
              onChange={(e) => {
                const found = documentPresetsList.find((p) => p.id === e.target.value);
                if (found) handleLoadTemplate(found.data);
              }}
              value=""
              className="bg-slate-800 text-xs text-emerald-300 font-medium px-2.5 py-1 rounded-lg border border-slate-700 hover:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="" disabled>
                ⚡ Muat Contoh Template...
              </option>
              {documentPresetsList.map((tpl) => (
                <option key={tpl.id} value={tpl.id}>
                  {tpl.title} ({tpl.badge})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 3 Main Modes Toggle */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => handleDocTypeChange('official_letter')}
            className={`py-2 px-2 rounded-lg font-bold flex flex-col items-center gap-1 transition ${
              doc.docType === 'official_letter'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Surat Resmi / Dinas</span>
          </button>

          <button
            onClick={() => handleDocTypeChange('sk')}
            className={`py-2 px-2 rounded-lg font-bold flex flex-col items-center gap-1 transition ${
              doc.docType === 'sk'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Surat Keputusan (SK)</span>
          </button>

          <button
            onClick={() => handleDocTypeChange('free_text')}
            className={`py-2 px-2 rounded-lg font-bold flex flex-col items-center gap-1 transition ${
              doc.docType === 'free_text'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>Surat Bebas / Paste</span>
          </button>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-950 px-3 gap-1 overflow-x-auto text-xs font-semibold flex-shrink-0">
        <button
          onClick={() => setActiveTab('content')}
          className={`py-3 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${
            activeTab === 'content'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Isi Surat</span>
        </button>

        <button
          onClick={() => setActiveTab('signatory')}
          className={`py-3 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${
            activeTab === 'signatory'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Penandatangan</span>
        </button>

        <button
          onClick={() => setActiveTab('paper_format')}
          className={`py-3 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${
            activeTab === 'paper_format'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Kertas & Format</span>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1 rounded">
            {doc.formatSettings.paperSize} • 12pt
          </span>
        </button>

        <button
          onClick={() => setActiveTab('kop')}
          className={`py-3 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${
            activeTab === 'kop'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Kop & Logo</span>
        </button>

        {doc.docType === 'sk' && (
          <button
            onClick={() => setActiveTab('sk_details')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${
              activeTab === 'sk_details'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Lampiran SK</span>
          </button>
        )}
      </div>

      {/* 3. Tab Contents */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-sm custom-scrollbar">
        {/* =========================================================================
            TAB 1: ISI SURAT
           ========================================================================= */}
        {activeTab === 'content' && (
          <div className="space-y-4">
            {/* Mode A: Surat Resmi / Dinas */}
            {doc.docType === 'official_letter' && (
              <div className="space-y-4">
                <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    Header Surat Keluar
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Nomor Surat</label>
                      <input
                        type="text"
                        value={doc.officialLetter?.letterNumber || ''}
                        onChange={(e) =>
                          updateDoc({
                            officialLetter: {
                              ...doc.officialLetter,
                              letterNumber: e.target.value,
                            },
                          })
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                        placeholder="Contoh: 025/TK-IPA/X/2026"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Lampiran</label>
                      <input
                        type="text"
                        value={doc.officialLetter?.attachment || '-'}
                        onChange={(e) =>
                          updateDoc({
                            officialLetter: {
                              ...doc.officialLetter,
                              attachment: e.target.value,
                            },
                          })
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                        placeholder="Contoh: - atau 1 Berkas"
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="text-xs text-slate-400 block mb-1">Perihal / Hal</label>
                    <input
                      type="text"
                      value={doc.officialLetter?.regarding || ''}
                      onChange={(e) =>
                        updateDoc({
                          officialLetter: {
                            ...doc.officialLetter,
                            regarding: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-semibold focus:outline-none focus:border-emerald-500"
                      placeholder="Contoh: Undangan Pertemuan Wali Murid"
                    />
                  </div>
                </div>

                {/* Tujuan Surat */}
                <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
                    Tujuan Surat (Kepada Yth.)
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Penerima Surat</label>
                      <input
                        type="text"
                        value={doc.officialLetter?.recipient || ''}
                        onChange={(e) =>
                          updateDoc({
                            officialLetter: {
                              ...doc.officialLetter,
                              recipient: e.target.value,
                            },
                          })
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                        placeholder="Contoh: Bapak/Ibu Wali Murid"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Alamat / Lokasi</label>
                      <input
                        type="text"
                        value={doc.officialLetter?.recipientAddress || 'di Tempat'}
                        onChange={(e) =>
                          updateDoc({
                            officialLetter: {
                              ...doc.officialLetter,
                              recipientAddress: e.target.value,
                            },
                          })
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                        placeholder="Contoh: di Tempat"
                      />
                    </div>
                  </div>
                </div>

                {/* Salam & Paragraf Isi */}
                <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Salam Pembuka</label>
                    <input
                      type="text"
                      value={doc.officialLetter?.openingGreeting || ''}
                      onChange={(e) =>
                        updateDoc({
                          officialLetter: {
                            ...doc.officialLetter,
                            openingGreeting: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                      placeholder="Contoh: Assalamu'alaikum Warahmatullahi Wabarakatuh,"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs text-slate-400">Paragraf Pembuka & Isi</label>
                      <span className="text-[11px] text-emerald-400">
                        Otomatis dirapikan (12pt & justify)
                      </span>
                    </div>
                    <textarea
                      rows={5}
                      value={doc.officialLetter?.openingParagraph || ''}
                      onChange={(e) =>
                        updateDoc({
                          officialLetter: {
                            ...doc.officialLetter,
                            openingParagraph: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white leading-relaxed focus:outline-none focus:border-emerald-500 font-sans"
                      placeholder="Pisahkan paragraf dengan enter 2 kali..."
                    />
                  </div>

                  {/* Rincian Poin / Acara */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs text-slate-400">
                        Rincian Kegiatan / Poin Acara (Titik Dua Sejajar)
                      </label>
                      <button
                        onClick={addDetailItem}
                        className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Tambah Poin
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(doc.officialLetter?.details || []).map((item) => (
                        <div key={item.id} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={item.label}
                            onChange={(e) => updateDetailItem(item.id, 'label', e.target.value)}
                            className="w-32 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                            placeholder="Label (Hari/Waktu)"
                          />
                          <span className="text-slate-500">:</span>
                          <input
                            type="text"
                            value={item.value}
                            onChange={(e) => updateDetailItem(item.id, 'value', e.target.value)}
                            className="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                            placeholder="Nilai (Sabtu, 17 Okt / 08.00 WIB)"
                          />
                          <button
                            onClick={() => deleteDetailItem(item.id)}
                            className="text-slate-500 hover:text-red-400 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Paragraf Penutup</label>
                    <textarea
                      rows={3}
                      value={doc.officialLetter?.closingParagraph || ''}
                      onChange={(e) =>
                        updateDoc({
                          officialLetter: {
                            ...doc.officialLetter,
                            closingParagraph: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white leading-relaxed focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Salam Penutup</label>
                    <input
                      type="text"
                      value={doc.officialLetter?.closingGreeting || ''}
                      onChange={(e) =>
                        updateDoc({
                          officialLetter: {
                            ...doc.officialLetter,
                            closingGreeting: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                      placeholder="Contoh: Wassalamu'alaikum Warahmatullahi Wabarakatuh,"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Mode B: Surat Bebas / Paste Teks */}
            {doc.docType === 'free_text' && (
              <div className="space-y-4">
                <div className="p-3 bg-emerald-950/40 border border-emerald-800/40 rounded-xl text-xs text-emerald-200 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <p>
                    <strong>Mode Otomatisasi Perapian:</strong> Anda cukup ketik atau paste teks apa saja di bawah ini. Aplikasi akan secara otomatis merapikan ukuran font menjadi <strong>12pt</strong>, menyamakan margin standar, mengatur perataan rata kiri-kanan (justify), serta menambahkan Kop Surat resmi dan Tanda Tangan.
                  </p>
                </div>

                <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Judul Surat (Opsional)</label>
                    <input
                      type="text"
                      value={doc.freeText?.title || ''}
                      onChange={(e) =>
                        updateDoc({
                          freeText: { ...doc.freeText, title: e.target.value },
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-emerald-500 uppercase"
                      placeholder="Contoh: SURAT PEMBERITAHUAN KEGIATAN"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Nomor Surat (Opsional)</label>
                    <input
                      type="text"
                      value={doc.freeText?.letterNumber || ''}
                      onChange={(e) =>
                        updateDoc({
                          freeText: { ...doc.freeText, letterNumber: e.target.value },
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                      placeholder="Contoh: Nomor : 012/TK-IPA/X/2026"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">
                      Isi Dokumen / Paragraf (Ketik atau Paste di Sini)
                    </label>
                    <textarea
                      rows={12}
                      value={doc.freeText?.rawText || ''}
                      onChange={(e) =>
                        updateDoc({
                          freeText: { ...doc.freeText, rawText: e.target.value },
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-white leading-relaxed focus:outline-none focus:border-emerald-500 font-sans"
                      placeholder="Tempelkan atau ketik isi surat Anda di sini... Pisahkan setiap paragraf dengan menekan Enter dua kali."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Mode C: Surat Keputusan (SK) */}
            {doc.docType === 'sk' && (
              <div className="space-y-4">
                <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Judul & Nomor SK
                  </h3>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Judul Keputusan</label>
                    <input
                      type="text"
                      value={doc.documentInfo.title}
                      onChange={(e) =>
                        updateDoc({
                          documentInfo: { ...doc.documentInfo, title: e.target.value },
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-bold uppercase focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Nomor SK</label>
                    <input
                      type="text"
                      value={doc.documentInfo.number}
                      onChange={(e) =>
                        updateDoc({
                          documentInfo: { ...doc.documentInfo, number: e.target.value },
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Subjek / Tentang</label>
                    <textarea
                      rows={2}
                      value={doc.documentInfo.subject}
                      onChange={(e) =>
                        updateDoc({
                          documentInfo: { ...doc.documentInfo, subject: e.target.value },
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white font-bold uppercase focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Konsideran Menimbang */}
                <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Menimbang ({doc.konsideran.menimbang.length} butir)
                    </h3>
                    <button
                      onClick={() => addKonsideran('menimbang')}
                      className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
                    >
                      <Plus className="w-3.5 h-3.5" /> Tambah
                    </button>
                  </div>
                  <div className="space-y-2">
                    {doc.konsideran.menimbang.map((item, idx) => (
                      <div key={item.id} className="flex items-start gap-2">
                        <span className="text-xs text-slate-400 font-bold mt-1.5">
                          {String.fromCharCode(97 + idx)}.
                        </span>
                        <textarea
                          rows={2}
                          value={item.text}
                          onChange={(e) =>
                            updateKonsideranText('menimbang', item.id, e.target.value)
                          }
                          className="flex-1 bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white leading-snug"
                        />
                        <button
                          onClick={() => deleteKonsideran('menimbang', item.id)}
                          className="text-slate-500 hover:text-red-400 p-1 mt-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Diktum Memutuskan */}
                <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Diktum Memutuskan ({doc.diktum.length} ketetapan)
                    </h3>
                    <button
                      onClick={addDiktum}
                      className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
                    >
                      <Plus className="w-3.5 h-3.5" /> Tambah Diktum
                    </button>
                  </div>
                  <div className="space-y-2">
                    {doc.diktum.map((item) => (
                      <div key={item.id} className="flex items-start gap-2">
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) => updateDiktum(item.id, 'label', e.target.value)}
                          className="w-24 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white font-bold"
                        />
                        <textarea
                          rows={2}
                          value={item.content}
                          onChange={(e) => updateDiktum(item.id, 'content', e.target.value)}
                          className="flex-1 bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white leading-snug"
                        />
                        <button
                          onClick={() => deleteDiktum(item.id)}
                          className="text-slate-500 hover:text-red-400 p-1 mt-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 2: PENANDATANGAN SURAT (Pilihan Cepat & Otomatis)
           ========================================================================= */}
        {activeTab === 'signatory' && (
          <div className="space-y-4">
            {/* Quick Presets Selection */}
            <div className="p-3.5 bg-emerald-950/40 border border-emerald-800/40 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4" />
                  Pilihan Cepat Penandatangan
                </span>
                <span className="text-[10px] text-slate-400">1-Klik Terapkan</span>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {officialSignatoryPresets.map((preset) => {
                  const isCurrent = doc.closing.signeeName === preset.name;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => applySignatoryPreset(preset.id)}
                      className={`text-left p-2.5 rounded-lg border transition flex items-center justify-between ${
                        isCurrent
                          ? 'bg-emerald-600/30 border-emerald-500 text-white'
                          : 'bg-slate-900 border-slate-700/80 text-slate-300 hover:border-slate-500 hover:bg-slate-800/80'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold text-white flex items-center gap-1.5">
                          {preset.name}
                          {isCurrent && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline" />
                          )}
                        </p>
                        <p className="text-[11px] text-slate-400">{preset.role}</p>
                      </div>
                      <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-300 font-medium">
                        Pilih
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form Detail Penandatangan */}
            <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Data Penandatangan Terpilih
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Kota Penetapan</label>
                  <input
                    type="text"
                    value={doc.closing.city}
                    onChange={(e) =>
                      updateDoc({ closing: { ...doc.closing, city: e.target.value } })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="Contoh: Malang"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Tanggal Surat</label>
                  <input
                    type="text"
                    value={doc.closing.date}
                    onChange={(e) =>
                      updateDoc({ closing: { ...doc.closing, date: e.target.value } })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="Contoh: 01 Juli 2026"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Jabatan Resmi</label>
                <input
                  type="text"
                  value={doc.closing.signeeRole}
                  onChange={(e) =>
                    updateDoc({ closing: { ...doc.closing, signeeRole: e.target.value } })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Contoh: Kepala TK ISLAM PLUS ARJUNA / Ketua Yayasan"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  value={doc.closing.signeeName}
                  onChange={(e) =>
                    updateDoc({ closing: { ...doc.closing, signeeName: e.target.value } })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
                  placeholder="Contoh: TITIN HAMIDAH, S.Pd"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">NIP / NUPTK / NIY (Opsional)</label>
                <input
                  type="text"
                  value={doc.closing.signeeNip || ''}
                  onChange={(e) =>
                    updateDoc({ closing: { ...doc.closing, signeeNip: e.target.value } })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Kosongkan jika tidak ada"
                />
              </div>

              {/* Toggle Cap Stempel */}
              <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-300">Placeholder Cap / TTD</p>
                  <p className="text-[11px] text-slate-400">
                    Tampilkan lingkaran panduan stempel di layar
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={doc.formatSettings.showStampPlaceholder}
                  onChange={(e) =>
                    updateDoc({
                      formatSettings: {
                        ...doc.formatSettings,
                        showStampPlaceholder: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: KERTAS & FORMAT (A4/Folio, 12pt Standard, Margins)
           ========================================================================= */}
        {activeTab === 'paper_format' && (
          <div className="space-y-4">
            {/* Visual Paper Selector: A4 vs Folio */}
            <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
              <label className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-2">
                Pilihan Ukuran Kertas Resmi
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() =>
                    updateDoc({
                      formatSettings: { ...doc.formatSettings, paperSize: 'A4' },
                    })
                  }
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                    doc.formatSettings.paperSize === 'A4'
                      ? 'bg-emerald-600/30 border-emerald-500 text-white shadow-lg'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="font-bold text-sm text-white">Kertas A4</span>
                    {doc.formatSettings.paperSize === 'A4' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1">210 &times; 297 mm</p>
                  <p className="text-[10px] text-slate-400 mt-1">Standar Internasional</p>
                </button>

                <button
                  onClick={() =>
                    updateDoc({
                      formatSettings: { ...doc.formatSettings, paperSize: 'F4' },
                    })
                  }
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                    doc.formatSettings.paperSize === 'F4'
                      ? 'bg-emerald-600/30 border-emerald-500 text-white shadow-lg'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="font-bold text-sm text-white">Kertas FOLIO (F4)</span>
                    {doc.formatSettings.paperSize === 'F4' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1">215 &times; 330 mm</p>
                  <p className="text-[10px] text-emerald-400 mt-1">Standar Sekolah & Yayasan</p>
                </button>
              </div>
            </div>

            {/* Font Size & Typography */}
            <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Tipografi & Ukuran Huruf (Font)
              </h3>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs text-slate-300 font-semibold">Ukuran Huruf (Font Size)</label>
                  <span className="text-[11px] text-emerald-400 font-bold">Wajib 12pt (Pakem Baku)</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {['12pt', '11pt', '10pt'].map((sz) => (
                    <button
                      key={sz}
                      onClick={() =>
                        updateDoc({
                          formatSettings: { ...doc.formatSettings, fontSize: sz },
                        })
                      }
                      className={`py-2 rounded-lg border text-xs font-bold transition ${
                        doc.formatSettings.fontSize === sz
                          ? 'bg-emerald-600 text-white border-emerald-500'
                          : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                    >
                      {sz} {sz === '12pt' && '★ Rekomendasi'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Jenis Huruf (Font Family)</label>
                <select
                  value={doc.formatSettings.fontFamily}
                  onChange={(e) =>
                    updateDoc({
                      formatSettings: {
                        ...doc.formatSettings,
                        fontFamily: e.target.value as any,
                      },
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="font-tnr">Times New Roman (Standar Surat Dinas)</option>
                  <option value="font-bookman">Bookman Old Style (Klasik Elegan)</option>
                  <option value="font-arial">Arial (Modern Bersih)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Jarak Antar Baris (Line Spacing)</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: '1.15 (Rapat)', val: '1.15' },
                    { label: '1.30 (Standar)', val: '1.3' },
                    { label: '1.50 (Lapang)', val: '1.5' },
                  ].map((sp) => (
                    <button
                      key={sp.val}
                      onClick={() =>
                        updateDoc({
                          formatSettings: { ...doc.formatSettings, lineHeight: sp.val },
                        })
                      }
                      className={`py-1.5 rounded-lg border text-xs transition ${
                        doc.formatSettings.lineHeight === sp.val
                          ? 'bg-emerald-600 text-white border-emerald-500 font-bold'
                          : 'bg-slate-900 text-slate-400 border-slate-700'
                      }`}
                    >
                      {sp.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Standard Margins */}
            <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Margin Halaman (Milimeter)
                </h3>
                <button
                  onClick={() =>
                    updateDoc({
                      formatSettings: {
                        ...doc.formatSettings,
                        marginTopMm: 20,
                        marginBottomMm: 20,
                        marginLeftMm: 25,
                        marginRightMm: 20,
                      },
                    })
                  }
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  Reset Standar Resmi
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 block mb-0.5">Atas</span>
                  <input
                    type="number"
                    value={doc.formatSettings.marginTopMm}
                    onChange={(e) =>
                      updateDoc({
                        formatSettings: {
                          ...doc.formatSettings,
                          marginTopMm: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white text-center"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block mb-0.5">Bawah</span>
                  <input
                    type="number"
                    value={doc.formatSettings.marginBottomMm}
                    onChange={(e) =>
                      updateDoc({
                        formatSettings: {
                          ...doc.formatSettings,
                          marginBottomMm: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white text-center"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block mb-0.5">Kiri</span>
                  <input
                    type="number"
                    value={doc.formatSettings.marginLeftMm}
                    onChange={(e) =>
                      updateDoc({
                        formatSettings: {
                          ...doc.formatSettings,
                          marginLeftMm: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white text-center"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block mb-0.5">Kanan</span>
                  <input
                    type="number"
                    value={doc.formatSettings.marginRightMm}
                    onChange={(e) =>
                      updateDoc({
                        formatSettings: {
                          ...doc.formatSettings,
                          marginRightMm: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white text-center"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: KOP SURAT & LOGO YAYASAN
           ========================================================================= */}
        {activeTab === 'kop' && (
          <div className="space-y-4">
            <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Logo & Ornamen Resmi Kop
              </h3>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-white">Tampilkan Logo Yayasan</p>
                  <p className="text-[11px] text-slate-400">Dimensi resmi proporsional 120px</p>
                </div>
                <input
                  type="checkbox"
                  checked={doc.institution.showLogo}
                  onChange={(e) =>
                    updateDoc({
                      institution: { ...doc.institution, showLogo: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-white">Ornamen Garis Miring Geometri</p>
                  <p className="text-[11px] text-slate-400">Sesuai foto referensi di sudut kiri atas</p>
                </div>
                <input
                  type="checkbox"
                  checked={doc.institution.showCornerGeometry !== false}
                  onChange={(e) =>
                    updateDoc({
                      institution: {
                        ...doc.institution,
                        showCornerGeometry: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Hierarki Teks Instansi (Kop Surat)
              </h3>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Nama Yayasan</label>
                <input
                  type="text"
                  value={doc.institution.yayasan}
                  onChange={(e) =>
                    updateDoc({
                      institution: { ...doc.institution, yayasan: e.target.value },
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-bold uppercase focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Nama Satuan Sekolah / Unit</label>
                <input
                  type="text"
                  value={doc.institution.schoolName}
                  onChange={(e) =>
                    updateDoc({
                      institution: { ...doc.institution, schoolName: e.target.value },
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-black uppercase focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Kecamatan / Kelurahan / Wilayah</label>
                <input
                  type="text"
                  value={doc.institution.subDistrict}
                  onChange={(e) =>
                    updateDoc({
                      institution: { ...doc.institution, subDistrict: e.target.value },
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Alamat & Nomor Telepon</label>
                <input
                  type="text"
                  value={doc.institution.address}
                  onChange={(e) =>
                    updateDoc({
                      institution: { ...doc.institution, address: e.target.value },
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: LAMPIRAN SK (Jika mode SK)
           ========================================================================= */}
        {activeTab === 'sk_details' && doc.docType === 'sk' && (
          <div className="space-y-4">
            <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">Aktifkan Lampiran 1 (Jadwal Mengajar)</p>
                  <p className="text-[11px] text-slate-400">Halaman 2 Dokumen SK</p>
                </div>
                <input
                  type="checkbox"
                  checked={doc.lampiran1?.enabled}
                  onChange={(e) =>
                    updateDoc({
                      lampiran1: { ...doc.lampiran1, enabled: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">Aktifkan Lampiran 2 (Beban & Keterangan)</p>
                  <p className="text-[11px] text-slate-400">Halaman 3 Dokumen SK</p>
                </div>
                <input
                  type="checkbox"
                  checked={doc.lampiran2?.enabled}
                  onChange={(e) =>
                    updateDoc({
                      lampiran2: { ...doc.lampiran2, enabled: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Footer Reset Button */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-between items-center text-xs flex-shrink-0">
        <span className="text-slate-400 text-[11px]">
          {doc.docType === 'official_letter'
            ? 'Format: Surat Resmi Dinas'
            : doc.docType === 'free_text'
            ? 'Format: Surat Bebas / Rapi'
            : 'Format: Surat Keputusan (SK)'}
        </span>
        <button
          onClick={onReset}
          className="text-slate-400 hover:text-red-400 flex items-center gap-1 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset ke Awal</span>
        </button>
      </div>
    </div>
  );
};
