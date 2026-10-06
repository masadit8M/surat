import React from 'react';
import { SchoolDocument } from '../types';
import { KopSurat } from './KopSurat';
import { SignatureBlock } from './SignatureBlock';

interface PrintDocumentProps {
  doc: SchoolDocument;
}

export const PrintDocument: React.FC<PrintDocumentProps> = ({ doc }) => {
  const fontClass = doc.formatSettings.fontFamily || 'font-tnr';
  const paperSize = doc.formatSettings.paperSize || 'A4';
  const printPaperClass = paperSize === 'F4' ? 'print-f4' : 'print-a4';
  const docType = doc.docType || 'sk';
  const baseFontSize = doc.formatSettings.fontSize || '12pt';

  const pageStyle: React.CSSProperties = {
    paddingTop: `${doc.formatSettings.marginTopMm || 20}mm`,
    paddingBottom: `${doc.formatSettings.marginBottomMm || 20}mm`,
    paddingLeft: `${doc.formatSettings.marginLeftMm || 25}mm`,
    paddingRight: `${doc.formatSettings.marginRightMm || 20}mm`,
    lineHeight: doc.formatSettings.lineHeight || '1.3',
    fontSize: baseFontSize,
  };

  const toLetter = (idx: number) => String.fromCharCode(97 + idx);

  let totalPages = 1;
  if (docType === 'sk') {
    if (doc.lampiran1?.enabled) totalPages++;
    if (doc.lampiran2?.enabled) totalPages++;
  }

  return (
    <div id="print-root-container" className="text-black bg-white">
      {/* Dynamic Style for Print Dialog matching A4 or Folio */}
      <style>{`
        @media print {
          @page {
            size: ${paperSize === 'F4' ? '215mm 330mm' : 'A4'} portrait;
            margin: 0;
          }
        }
      `}</style>

      {/* =========================================================================
          MODE 1: SURAT RESMI / SURAT DINAS (Undangan, Edaran, Tugas, Keterangan)
         ========================================================================= */}
      {docType === 'official_letter' && (
        <div
          id="print-page-1"
          className={`print-page ${printPaperClass} ${fontClass} flex flex-col justify-between`}
          style={pageStyle}
        >
          <div className="flex-1 flex flex-col justify-between">
            <div>
              {/* Kop Surat Resmi Terstandar */}
              <KopSurat institution={doc.institution} pageNumber={1} />

              {/* Tanggal Surat di Pojok Kanan Atas */}
              <div className="flex justify-end text-[12pt] mt-2 mb-1">
                <p>
                  {doc.closing.city}, {doc.closing.date}
                </p>
              </div>

              {/* Metadata Surat: Nomor, Lampiran, Hal, dan Tujuan Surat */}
              <div className="flex justify-between items-start text-[12pt] mb-4">
                {/* Kolom Kiri: Nomor, Lampiran, Perihal */}
                <table className="border-collapse text-[12pt]">
                  <tbody>
                    <tr>
                      <td className="pr-3 font-normal py-0.5 align-top">Nomor</td>
                      <td className="px-1 py-0.5 align-top">:</td>
                      <td className="font-medium py-0.5 align-top">
                        {doc.officialLetter?.letterNumber || '025/TK-IPA/X/2026'}
                      </td>
                    </tr>
                    <tr>
                      <td className="pr-3 font-normal py-0.5 align-top">Lampiran</td>
                      <td className="px-1 py-0.5 align-top">:</td>
                      <td className="py-0.5 align-top">
                        {doc.officialLetter?.attachment || '-'}
                      </td>
                    </tr>
                    <tr>
                      <td className="pr-3 font-normal py-0.5 align-top">Perihal</td>
                      <td className="px-1 py-0.5 align-top">:</td>
                      <td className="font-bold py-0.5 align-top underline underline-offset-2">
                        {doc.officialLetter?.regarding || 'Surat Pemberitahuan'}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Kolom Kanan: Kepada Yth. Tujuan Surat */}
                <div className="text-left max-w-xs text-[12pt]">
                  <p className="font-normal">Kepada Yth.</p>
                  <p className="font-bold">
                    {doc.officialLetter?.recipient || 'Bapak/Ibu Orang Tua / Wali Murid'}
                  </p>
                  <p className="font-normal">
                    {doc.officialLetter?.recipientAddress || 'di Tempat'}
                  </p>
                </div>
              </div>

              {/* Salam Pembuka */}
              {doc.officialLetter?.openingGreeting && (
                <div className="mb-2 text-[12pt] font-normal">
                  <p>{doc.officialLetter.openingGreeting}</p>
                </div>
              )}

              {/* Paragraf Pembuka & Isi */}
              {doc.officialLetter?.openingParagraph && (
                <div className="text-[12pt] leading-relaxed text-justify mb-3 space-y-2">
                  {doc.officialLetter.openingParagraph.split('\n\n').map((paragraph, pIdx) => (
                    <p key={pIdx} className="indent-8 text-justify">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}

              {/* Rincian Poin / Acara (Jika Ada) */}
              {doc.officialLetter?.details && doc.officialLetter.details.length > 0 && (
                <div className="my-3 pl-8 text-[12pt]">
                  <table className="border-collapse text-[12pt]">
                    <tbody>
                      {doc.officialLetter.details.map((item) => (
                        <tr key={item.id}>
                          <td className="pr-4 py-1 font-medium w-36 align-top">
                            {item.label}
                          </td>
                          <td className="px-2 py-1 align-top">:</td>
                          <td className="py-1 font-semibold align-top">{item.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Paragraf Penutup */}
              {doc.officialLetter?.closingParagraph && (
                <div className="text-[12pt] leading-relaxed text-justify mb-2 space-y-2">
                  {doc.officialLetter.closingParagraph.split('\n\n').map((paragraph, pIdx) => (
                    <p key={pIdx} className="indent-8 text-justify">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}

              {/* Salam Penutup */}
              {doc.officialLetter?.closingGreeting && (
                <div className="mb-2 text-[12pt] font-normal">
                  <p>{doc.officialLetter.closingGreeting}</p>
                </div>
              )}
            </div>

            {/* Blok Tanda Tangan & Tembusan */}
            <div className="mt-4">
              <SignatureBlock
                closing={doc.closing}
                showDate={false}
                showStampPlaceholder={doc.formatSettings.showStampPlaceholder}
                isOfficialLetter={true}
                fontSizeClass="text-[12pt]"
              />

              {/* Tembusan (Kiri Bawah) */}
              {doc.officialLetter?.tembusan && doc.officialLetter.tembusan.length > 0 && (
                <div className="text-[10pt] mt-4 pt-2 border-t border-slate-200">
                  <p className="font-bold underline">Tembusan Yth :</p>
                  <ol className="list-decimal list-inside space-y-0.5 mt-0.5">
                    {doc.officialLetter.tembusan.map((item, tIdx) => (
                      <li key={tIdx}>{item}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODE 2: SURAT BEBAS / CUSTOM
         ========================================================================= */}
      {docType === 'free_text' && (
        <div
          id="print-page-1"
          className={`print-page ${printPaperClass} ${fontClass} flex flex-col justify-between`}
          style={pageStyle}
        >
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <KopSurat institution={doc.institution} pageNumber={1} />

              {doc.freeText?.title && (
                <div className="text-center my-3">
                  <h2 className="text-[13pt] font-bold uppercase tracking-wider underline underline-offset-4 leading-tight">
                    {doc.freeText.title}
                  </h2>
                  {doc.freeText.letterNumber && (
                    <p className="text-[11pt] tracking-wide leading-tight mt-1">
                      {doc.freeText.letterNumber}
                    </p>
                  )}
                </div>
              )}

              <div className="text-[12pt] leading-relaxed text-justify space-y-3 mt-4">
                {(doc.freeText?.rawText || '')
                  .split('\n\n')
                  .filter((p) => p.trim().length > 0)
                  .map((paragraph, pIdx) => (
                    <p key={pIdx} className="indent-8 text-justify">
                      {paragraph}
                    </p>
                  ))}
              </div>
            </div>

            <div className="mt-6">
              <SignatureBlock
                closing={doc.closing}
                showDate={true}
                showStampPlaceholder={doc.formatSettings.showStampPlaceholder}
                isOfficialLetter={true}
                fontSizeClass="text-[12pt]"
              />
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODE 3: SURAT KEPUTUSAN (SK) UTAMA (Halaman 1)
         ========================================================================= */}
      {docType === 'sk' && (
        <div
          id="print-page-1"
          className={`print-page ${printPaperClass} ${fontClass} flex flex-col justify-between`}
          style={pageStyle}
        >
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <KopSurat institution={doc.institution} pageNumber={1} />

              {/* Judul & Nomor Surat */}
              <div className="text-center my-2">
                <h2 className="text-[13pt] font-bold uppercase tracking-wider underline underline-offset-2 leading-tight">
                  {doc.documentInfo.title}
                </h2>
                <p className="text-[11pt] tracking-wide leading-tight mt-0.5">
                  {doc.documentInfo.number}
                </p>

                <p className="text-[11pt] font-bold uppercase mt-1.5 tracking-wide leading-tight">
                  {doc.documentInfo.subjectTitle}
                </p>
                <p className="text-[11.5pt] font-bold uppercase max-w-xl mx-auto leading-tight mt-0.5">
                  {doc.documentInfo.subject}
                </p>

                <p className="text-[11pt] font-bold uppercase mt-1.5 tracking-wide leading-tight">
                  {doc.documentInfo.signeeTitle}
                </p>
              </div>

              {/* Konsideran Section */}
              <div className="w-full text-[11pt] my-1 border-collapse leading-snug">
                {/* MENIMBANG */}
                {doc.konsideran.menimbang.length > 0 && (
                  <div className="flex items-start mb-1.5">
                    <div className="w-36 font-bold flex-shrink-0 text-left">
                      MENIMBANG :
                    </div>
                    <div className="flex-1 space-y-0.5 text-justify">
                      {doc.konsideran.menimbang.map((item, idx) => (
                        <div key={item.id} className="flex items-start">
                          <span className="w-5 flex-shrink-0">{toLetter(idx)}.</span>
                          <span className="flex-1 leading-snug">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* MENGINGAT */}
                {doc.konsideran.mengingat.length > 0 && (
                  <div className="flex items-start mb-1.5">
                    <div className="w-36 font-bold flex-shrink-0 text-left">
                      MENGINGAT :
                    </div>
                    <div className="flex-1 space-y-0.5 text-justify">
                      {doc.konsideran.mengingat.map((item, idx) => (
                        <div key={item.id} className="flex items-start">
                          <span className="w-5 flex-shrink-0">{idx + 1}.</span>
                          <span className="flex-1 leading-snug">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* MEMPERHATIKAN */}
                {doc.konsideran.memperhatikan.length > 0 && (
                  <div className="flex items-start mb-1">
                    <div className="w-36 font-bold flex-shrink-0 text-left">
                      MEMPERHATIKAN :
                    </div>
                    <div className="flex-1 space-y-0.5 text-justify">
                      {doc.konsideran.memperhatikan.map((item, idx) => (
                        <div key={item.id} className="flex items-start">
                          <span className="w-5 flex-shrink-0">{idx + 1}.</span>
                          <span className="flex-1 leading-snug">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Diktum Memutuskan */}
              <div className="w-full text-center my-1">
                <h3 className="text-[11.5pt] font-black uppercase tracking-wider">
                  MEMUTUSKAN
                </h3>
              </div>

              <div className="w-full text-[11pt] border-collapse leading-snug">
                <div className="flex items-start mb-1">
                  <div className="w-36 font-bold flex-shrink-0 text-left">
                    MENETAPKAN :
                  </div>
                  <div className="flex-1" />
                </div>

                {doc.diktum.map((item) => (
                  <div key={item.id} className="flex items-start mb-1">
                    <div className="w-36 font-bold flex-shrink-0 text-left">
                      {item.label} :
                    </div>
                    <div className="flex-1 text-justify leading-snug">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tanda Tangan */}
            <div className="mt-1">
              <SignatureBlock
                closing={doc.closing}
                showDate={true}
                showStampPlaceholder={doc.formatSettings.showStampPlaceholder}
                isOfficialLetter={false}
                fontSizeClass="text-[11pt]"
              />
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODE 3: LAMPIRAN 1 (Halaman 2 - Jika SK)
         ========================================================================= */}
      {docType === 'sk' && doc.lampiran1?.enabled && (
        <div
          id="print-page-2"
          className={`print-page ${printPaperClass} ${fontClass} flex flex-col justify-between`}
          style={pageStyle}
        >
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <KopSurat institution={doc.institution} pageNumber={2} compact={true} />

              <div className="w-full text-right text-[9pt] leading-tight mt-1 mb-2">
                <p className="font-bold">{doc.lampiran1.title}</p>
                <p>{doc.lampiran1.subtitle}</p>
                <p>{doc.lampiran1.documentNumber}</p>
              </div>

              <div className="text-center my-1.5">
                {doc.lampiran1.heading.map((h, i) => (
                  <p
                    key={i}
                    className="text-[10pt] font-bold uppercase tracking-wide leading-tight"
                  >
                    {h}
                  </p>
                ))}
              </div>

              <div className="w-full mt-2">
                <table className="w-full border-collapse border border-black text-[8pt] leading-tight">
                  <thead>
                    <tr className="bg-slate-50">
                      {doc.lampiran1.headers.map((hdr, idx) => (
                        <th
                          key={idx}
                          className="border border-black px-1.5 py-1 text-center font-bold"
                        >
                          {hdr}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {doc.lampiran1.rows.map((row, rIdx) => (
                      <tr key={rIdx}>
                        {row.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            className={`border border-black px-1.5 py-1 align-top whitespace-pre-line ${
                              cIdx === 0
                                ? 'text-center w-8'
                                : cIdx === 1
                                ? 'font-bold uppercase w-16 text-center'
                                : cIdx === 4
                                ? 'text-center w-10'
                                : cIdx === 5
                                ? 'text-center w-14'
                                : ''
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-2">
              <SignatureBlock
                closing={doc.closing}
                showDate={false}
                showStampPlaceholder={doc.formatSettings.showStampPlaceholder}
                fontSizeClass="text-[9.5pt]"
              />
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODE 3: LAMPIRAN 2 (Halaman 3 - Jika SK)
         ========================================================================= */}
      {docType === 'sk' && doc.lampiran2?.enabled && (
        <div
          id="print-page-3"
          className={`print-page ${printPaperClass} ${fontClass} flex flex-col justify-between`}
          style={pageStyle}
        >
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <KopSurat institution={doc.institution} pageNumber={3} compact={true} />

              <div className="w-full text-right text-[9pt] leading-tight mt-1 mb-2">
                <p className="font-bold">{doc.lampiran2.title}</p>
                <p>{doc.lampiran2.subtitle}</p>
                <p>{doc.lampiran2.documentNumber}</p>
              </div>

              <div className="text-center my-1.5">
                {doc.lampiran2.heading.map((h, i) => (
                  <p
                    key={i}
                    className="text-[10pt] font-bold uppercase tracking-wide leading-tight"
                  >
                    {h}
                  </p>
                ))}
              </div>

              <div className="w-full mt-2">
                <table className="w-full border-collapse border border-black text-[8.5pt] leading-tight">
                  <thead>
                    <tr className="bg-slate-50">
                      {doc.lampiran2.headers.map((hdr, idx) => (
                        <th
                          key={idx}
                          className="border border-black px-1.5 py-1 text-center font-bold"
                        >
                          {hdr}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {doc.lampiran2.rows.map((row, rIdx) => (
                      <tr key={rIdx}>
                        {row.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            className={`border border-black px-1.5 py-1 align-top whitespace-pre-line ${
                              cIdx === 0
                                ? 'text-center w-8'
                                : cIdx === 1
                                ? 'font-medium uppercase'
                                : cIdx >= 2 && cIdx <= 5
                                ? 'text-center'
                                : ''
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {doc.lampiran2.notes.length > 0 && (
                <div className="mt-2 text-[8pt] leading-snug">
                  <p className="font-bold">Keterangan :</p>
                  <ul className="list-disc list-inside mt-0.5 space-y-0.5 pl-1">
                    {doc.lampiran2.notes.map((note, nIdx) => (
                      <li key={nIdx}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-2">
              <SignatureBlock
                closing={doc.closing}
                showDate={false}
                showStampPlaceholder={doc.formatSettings.showStampPlaceholder}
                fontSizeClass="text-[9.5pt]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
