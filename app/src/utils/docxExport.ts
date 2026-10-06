import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ImageRun,
  HeightRule,
  VerticalAlign,
} from 'docx';
import { saveAs } from 'file-saver';
import { SchoolDocument } from '../types';

export async function exportToDocx(doc: SchoolDocument) {
  const paperSize = doc.formatSettings.paperSize || 'A4';
  const isF4 = paperSize === 'F4';

  // 1 mm = 56.6929 twips (dxa)
  // Standar margin proporsional (pas 3 halaman dengan spasi 1.0 single)
  const defaultTop = isF4 ? 15 : 10.5;
  const defaultBottom = isF4 ? 15 : 10.5;
  const defaultLeft = 20;
  const defaultRight = 15;

  const topTwips = Math.round((doc.formatSettings.marginTopMm ?? defaultTop) * 56.7);
  const bottomTwips = Math.round((doc.formatSettings.marginBottomMm ?? defaultBottom) * 56.7);
  const leftTwips = Math.round((doc.formatSettings.marginLeftMm ?? defaultLeft) * 56.7);
  const rightTwips = Math.round((doc.formatSettings.marginRightMm ?? defaultRight) * 56.7);

  // Fetch logo bytes
  let logoBytes: Uint8Array | null = null;
  if (doc.institution.showLogo) {
    try {
      const resp = await fetch(doc.institution.logoUrl || '/logo.png');
      if (resp.ok) {
        const arrBuf = await resp.arrayBuffer();
        logoBytes = new Uint8Array(arrBuf);
      }
    } catch (e) {
      console.warn('Could not load logo for docx export', e);
    }
  }

  // Fetch corner geometry bytes
  let geometryBytes: Uint8Array | null = null;
  if (doc.institution.showCornerGeometry !== false) {
    try {
      const geomResp = await fetch('/header_corner_geometry.png');
      if (geomResp.ok) {
        const arrBuf = await geomResp.arrayBuffer();
        geometryBytes = new Uint8Array(arrBuf);
      }
    } catch (e) {
      console.warn('Could not load geometry image for docx export', e);
    }
  }

  // Choose font family string
  let targetFont = 'Times New Roman';
  if (doc.formatSettings.fontFamily === 'font-arial') targetFont = 'Arial';
  if (doc.formatSettings.fontFamily === 'font-bookman') targetFont = 'Bookman Old Style';

  // Standar font size 12pt (dalam docx half-points: 12 * 2 = 24)
  const font12pt = 24;
  const font11pt = 22;
  const font10pt = 20;

  // Standar Spasi Dokumen Kedinasan Resmi
  const LINE_PROPER = 240; // 1.0 Single Line Spacing
  const LINE_TABLE = 220;  // Spasi tabel proporsional dan nyaman dibaca

  // DEFINISI BORDER TRANSPARAN / INVISIBLE
  const invisibleTableBorders = {
    top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    insideHorizontal: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    insideVertical: { style: BorderStyle.NONE, size: 0, color: 'auto' },
  };

  const invisibleCellBorders = {
    top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
  };

  // Helper untuk membuat Kop Surat Resmi (Wajib Muncul di Setiap Halaman)
  const createKopTable = (_pageNum: number = 1, isCompact: boolean = false) => {
    const sideWidth = isCompact ? 1300 : 1500;
    const centerWidth = isCompact ? 7000 : 6600;

    const kopBottomBorder = {
      top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
      left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
      right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
      bottom: { style: BorderStyle.DOUBLE, size: isCompact ? 10 : 12, color: '000000' },
    };

    // Baris 1: Ornamen Geometri sudut kiri atas (tanpa mendorong logo atau teks)
    const row1 = new TableRow({
      children: [
        new TableCell({
          width: { size: sideWidth, type: WidthType.DXA },
          borders: invisibleCellBorders,
          children: [
            geometryBytes
              ? new Paragraph({
                  alignment: AlignmentType.LEFT,
                  spacing: { line: 100, before: 0, after: 0 },
                  children: [
                    new ImageRun({
                      data: geometryBytes,
                      transformation: {
                        width: isCompact ? 55 : 68,
                        height: isCompact ? 17 : 21,
                      },
                      type: 'png',
                    }),
                  ],
                })
              : new Paragraph({ children: [] }),
          ],
        }),
        new TableCell({
          width: { size: centerWidth, type: WidthType.DXA },
          borders: invisibleCellBorders,
          children: [new Paragraph({ spacing: { line: 100, before: 0, after: 0 } })],
        }),
        new TableCell({
          width: { size: sideWidth, type: WidthType.DXA },
          borders: invisibleCellBorders,
          children: [new Paragraph({ spacing: { line: 100, before: 0, after: 0 } })],
        }),
      ],
    });

    // Baris 2: Logo Resmi di kiri, Teks Kop di tengah, Garis Ganda di border bawah
    const row2 = new TableRow({
      children: [
        new TableCell({
          width: { size: sideWidth, type: WidthType.DXA },
          borders: kopBottomBorder,
          verticalAlign: VerticalAlign.BOTTOM,
          children: [
            logoBytes
              ? new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { line: 100, before: 0, after: isCompact ? 30 : 40 },
                  children: [
                    new ImageRun({
                      data: logoBytes,
                      transformation: {
                        width: isCompact ? 55 : 62,
                        height: isCompact ? 77 : 87,
                      },
                      type: 'png',
                    }),
                  ],
                })
              : new Paragraph({ children: [] }),
          ],
        }),
        new TableCell({
          width: { size: centerWidth, type: WidthType.DXA },
          borders: kopBottomBorder,
          verticalAlign: VerticalAlign.BOTTOM,
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { line: isCompact ? 190 : 200, after: 10 },
              children: [
                new TextRun({
                  text: doc.institution.yayasan,
                  font: targetFont,
                  bold: true,
                  size: isCompact ? 21 : 24,
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { line: isCompact ? 200 : 210, after: 10 },
              children: [
                new TextRun({
                  text: doc.institution.schoolName,
                  font: targetFont,
                  bold: true,
                  size: isCompact ? 26 : 28,
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { line: isCompact ? 170 : 180, after: 10 },
              children: [
                new TextRun({
                  text: doc.institution.subDistrict,
                  font: targetFont,
                  bold: true,
                  size: isCompact ? 17 : 20,
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { line: isCompact ? 160 : 170, after: isCompact ? 30 : 40 },
              children: [
                new TextRun({
                  text: doc.institution.address,
                  font: targetFont,
                  size: isCompact ? 15 : 18,
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          width: { size: sideWidth, type: WidthType.DXA },
          borders: kopBottomBorder,
          verticalAlign: VerticalAlign.BOTTOM,
          children: [new Paragraph({ children: [] })],
        }),
      ],
    });

    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: invisibleTableBorders,
      rows: [row1, row2],
    });
  };

  // Helper untuk membuat Signature Table
  const makeSignatureTable = (
    signeeRole: string,
    signeeName: string,
    signeeNip?: string,
    city?: string,
    date?: string,
    isOfficial: boolean = false
  ) => {
    let roleLines: string[] = [];
    if (signeeRole.toLowerCase().startsWith('kepala ')) {
      roleLines = ['Kepala', signeeRole.slice(7).trim()];
    } else if (signeeRole.includes('\n')) {
      roleLines = signeeRole.split('\n').filter(Boolean);
    } else {
      roleLines = [signeeRole];
    }

    const pList: Paragraph[] = [];
    if (city && date) {
      if (isOfficial) {
        pList.push(
          new Paragraph({
            spacing: { line: LINE_PROPER, after: 40 },
            children: [
              new TextRun({ text: `${city}, ${date}`, font: targetFont, size: font12pt }),
            ],
          })
        );
      } else {
        pList.push(
          new Paragraph({
            spacing: { line: LINE_PROPER },
            children: [
              new TextRun({ text: `Ditetapkan di : ${city}`, font: targetFont, size: font12pt }),
            ],
          }),
          new Paragraph({
            spacing: { line: LINE_PROPER, after: 10 },
            children: [
              new TextRun({ text: `Pada Tanggal  : ${date}`, font: targetFont, size: font12pt }),
            ],
          })
        );
      }
    }

    roleLines.forEach((r, idx) => {
      pList.push(
        new Paragraph({
          spacing: { line: LINE_PROPER },
          children: [
            new TextRun({
              text: idx > 0 && !isOfficial ? r.toUpperCase() : r,
              font: targetFont,
              bold: true,
              size: font12pt,
            }),
          ],
        })
      );
    });

    // Ruang Tanda Tangan
    pList.push(
      new Paragraph({
        spacing: { before: isF4 ? 750 : 620, after: 20 },
        children: [
          new TextRun({
            text: `(${signeeName})`,
            font: targetFont,
            bold: true,
            size: font12pt,
            underline: {},
          }),
        ],
      })
    );

    if (signeeNip) {
      pList.push(
        new Paragraph({
          spacing: { line: LINE_PROPER },
          children: [
            new TextRun({
              text: `NIP/NUPTK: ${signeeNip}`,
              font: targetFont,
              size: font12pt,
            }),
          ],
        })
      );
    }

    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: invisibleTableBorders,
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 5500, type: WidthType.DXA },
              borders: invisibleCellBorders,
              children: [new Paragraph({})],
            }),
            new TableCell({
              width: { size: 4100, type: WidthType.DXA },
              borders: invisibleCellBorders,
              children: pList,
            }),
          ],
        }),
      ],
    });
  };

  const docType = doc.docType || 'sk';
  const mainChildren: (Paragraph | Table)[] = [];

  // =========================================================================
  // 1. SURAT RESMI / DINAS (Undangan, Edaran, Tugas, Keterangan)
  // =========================================================================
  if (docType === 'official_letter') {
    mainChildren.push(createKopTable(1));

    // Tanggal Surat di pojok kanan atas
    mainChildren.push(
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { before: 120, line: 240, after: 120 },
        children: [
          new TextRun({
            text: `${doc.closing.city}, ${doc.closing.date}`,
            font: targetFont,
            size: font12pt,
          }),
        ],
      })
    );

    // Tabel Metadata Surat (Nomor, Lampiran, Hal di kiri; Kepada Yth di kanan)
    const metadataTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: invisibleTableBorders,
      rows: [
        new TableRow({
          children: [
            // Kolom Kiri: Nomor, Lampiran, Perihal
            new TableCell({
              width: { size: 5200, type: WidthType.DXA },
              borders: invisibleCellBorders,
              children: [
                new Paragraph({
                  spacing: { line: 240, after: 40 },
                  children: [
                    new TextRun({ text: 'Nomor      : ', font: targetFont, size: font12pt }),
                    new TextRun({
                      text: doc.officialLetter?.letterNumber || '-',
                      font: targetFont,
                      size: font12pt,
                    }),
                  ],
                }),
                new Paragraph({
                  spacing: { line: 240, after: 40 },
                  children: [
                    new TextRun({ text: 'Lampiran  : ', font: targetFont, size: font12pt }),
                    new TextRun({
                      text: doc.officialLetter?.attachment || '-',
                      font: targetFont,
                      size: font12pt,
                    }),
                  ],
                }),
                new Paragraph({
                  spacing: { line: 240, after: 120 },
                  children: [
                    new TextRun({ text: 'Perihal     : ', font: targetFont, size: font12pt }),
                    new TextRun({
                      text: doc.officialLetter?.regarding || '-',
                      font: targetFont,
                      bold: true,
                      underline: {},
                      size: font12pt,
                    }),
                  ],
                }),
              ],
            }),
            // Kolom Kanan: Kepada Yth
            new TableCell({
              width: { size: 4400, type: WidthType.DXA },
              borders: invisibleCellBorders,
              children: [
                new Paragraph({
                  spacing: { line: 240 },
                  children: [
                    new TextRun({ text: 'Kepada Yth.', font: targetFont, size: font12pt }),
                  ],
                }),
                new Paragraph({
                  spacing: { line: 240 },
                  children: [
                    new TextRun({
                      text: doc.officialLetter?.recipient || 'Bapak/Ibu Wali Murid',
                      font: targetFont,
                      bold: true,
                      size: font12pt,
                    }),
                  ],
                }),
                new Paragraph({
                  spacing: { line: 240, after: 120 },
                  children: [
                    new TextRun({
                      text: doc.officialLetter?.recipientAddress || 'di Tempat',
                      font: targetFont,
                      size: font12pt,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });
    mainChildren.push(metadataTable);

    // Salam Pembuka
    if (doc.officialLetter?.openingGreeting) {
      mainChildren.push(
        new Paragraph({
          spacing: { before: 120, line: 240, after: 80 },
          children: [
            new TextRun({
              text: doc.officialLetter.openingGreeting,
              font: targetFont,
              size: font12pt,
            }),
          ],
        })
      );
    }

    // Paragraf Pembuka & Isi
    if (doc.officialLetter?.openingParagraph) {
      const paragraphs = doc.officialLetter.openingParagraph.split('\n\n');
      paragraphs.forEach((p) => {
        mainChildren.push(
          new Paragraph({
            alignment: AlignmentType.BOTH,
            spacing: { line: 260, after: 100 },
            indent: { firstLine: 567 }, // 10mm indent
            children: [new TextRun({ text: p, font: targetFont, size: font12pt })],
          })
        );
      });
    }

    // Rincian Poin / Acara jika ada
    if (doc.officialLetter?.details && doc.officialLetter.details.length > 0) {
      const detailRows = doc.officialLetter.details.map((item) => {
        return new TableRow({
          children: [
            new TableCell({
              width: { size: 1000, type: WidthType.DXA },
              borders: invisibleCellBorders,
              children: [new Paragraph({})],
            }),
            new TableCell({
              width: { size: 2400, type: WidthType.DXA },
              borders: invisibleCellBorders,
              children: [
                new Paragraph({
                  spacing: { line: 240 },
                  children: [
                    new TextRun({ text: item.label, font: targetFont, size: font12pt }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 300, type: WidthType.DXA },
              borders: invisibleCellBorders,
              children: [
                new Paragraph({
                  spacing: { line: 240 },
                  children: [new TextRun({ text: ':', font: targetFont, size: font12pt })],
                }),
              ],
            }),
            new TableCell({
              width: { size: 5900, type: WidthType.DXA },
              borders: invisibleCellBorders,
              children: [
                new Paragraph({
                  spacing: { line: 240 },
                  children: [
                    new TextRun({
                      text: item.value,
                      font: targetFont,
                      bold: true,
                      size: font12pt,
                    }),
                  ],
                }),
              ],
            }),
          ],
        });
      });

      mainChildren.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: invisibleTableBorders,
          rows: detailRows,
        })
      );
    }

    // Paragraf Penutup
    if (doc.officialLetter?.closingParagraph) {
      const closingPs = doc.officialLetter.closingParagraph.split('\n\n');
      closingPs.forEach((p) => {
        mainChildren.push(
          new Paragraph({
            alignment: AlignmentType.BOTH,
            spacing: { before: 80, line: 260, after: 100 },
            indent: { firstLine: 567 },
            children: [new TextRun({ text: p, font: targetFont, size: font12pt })],
          })
        );
      });
    }

    // Salam Penutup
    if (doc.officialLetter?.closingGreeting) {
      mainChildren.push(
        new Paragraph({
          spacing: { line: 240, after: 120 },
          children: [
            new TextRun({
              text: doc.officialLetter.closingGreeting,
              font: targetFont,
              size: font12pt,
            }),
          ],
        })
      );
    }

    // Tanda Tangan
    mainChildren.push(
      makeSignatureTable(
        doc.closing.signeeRole,
        doc.closing.signeeName,
        doc.closing.signeeNip,
        doc.closing.city,
        doc.closing.date,
        true
      )
    );

    // Tembusan
    if (doc.officialLetter?.tembusan && doc.officialLetter.tembusan.length > 0) {
      mainChildren.push(
        new Paragraph({
          spacing: { before: 240, line: 220 },
          children: [
            new TextRun({
              text: 'Tembusan Yth :',
              font: targetFont,
              bold: true,
              underline: {},
              size: font10pt,
            }),
          ],
        })
      );
      doc.officialLetter.tembusan.forEach((t, tIdx) => {
        mainChildren.push(
          new Paragraph({
            spacing: { line: 210 },
            indent: { left: 240 },
            children: [
              new TextRun({
                text: `${tIdx + 1}. ${t}`,
                font: targetFont,
                size: font10pt,
              }),
            ],
          })
        );
      });
    }
  }

  // =========================================================================
  // 2. SURAT BEBAS / CUSTOM RAW TEXT
  // =========================================================================
  else if (docType === 'free_text') {
    mainChildren.push(createKopTable(1));

    if (doc.freeText?.title) {
      mainChildren.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 120, line: 240, after: 40 },
          children: [
            new TextRun({
              text: doc.freeText.title,
              font: targetFont,
              bold: true,
              size: 26, // 13pt
              underline: {},
            }),
          ],
        })
      );
    }

    if (doc.freeText?.letterNumber) {
      mainChildren.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { line: 240, after: 140 },
          children: [
            new TextRun({
              text: doc.freeText.letterNumber,
              font: targetFont,
              size: font11pt,
            }),
          ],
        })
      );
    }

    const freeParagraphs = (doc.freeText?.rawText || '').split('\n\n');
    freeParagraphs.forEach((p) => {
      if (p.trim().length > 0) {
        mainChildren.push(
          new Paragraph({
            alignment: AlignmentType.BOTH,
            spacing: { line: 260, after: 120 },
            indent: { firstLine: 567 },
            children: [new TextRun({ text: p.trim(), font: targetFont, size: font12pt })],
          })
        );
      }
    });

    mainChildren.push(
      makeSignatureTable(
        doc.closing.signeeRole,
        doc.closing.signeeName,
        doc.closing.signeeNip,
        doc.closing.city,
        doc.closing.date,
        true
      )
    );
  }

  // =========================================================================
  // 3. SURAT KEPUTUSAN (SK) UTAMA + LAMPIRAN
  // =========================================================================
  else {
    mainChildren.push(createKopTable(1));

    mainChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 80, line: LINE_PROPER, after: 10 },
        children: [
          new TextRun({
            text: doc.documentInfo.title,
            font: targetFont,
            bold: true,
            size: font12pt,
            underline: {},
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { line: LINE_PROPER, after: 15 },
        children: [
          new TextRun({
            text: doc.documentInfo.number,
            font: targetFont,
            size: font12pt,
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { line: LINE_PROPER, after: 10 },
        children: [
          new TextRun({
            text: doc.documentInfo.subjectTitle,
            font: targetFont,
            bold: true,
            size: font12pt,
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { line: LINE_PROPER, after: 15 },
        children: [
          new TextRun({
            text: doc.documentInfo.subject,
            font: targetFont,
            bold: true,
            size: font12pt,
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { line: LINE_PROPER, after: 20 },
        children: [
          new TextRun({
            text: doc.documentInfo.signeeTitle,
            font: targetFont,
            bold: true,
            size: font12pt,
          }),
        ],
      })
    );

    const makeKonsideranRow = (
      label: string,
      items: { text: string }[],
      isNumbered: boolean = false
    ) => {
      const contentParagraphs = items.map((item, idx) => {
        const prefix = isNumbered ? `${idx + 1}. ` : `${String.fromCharCode(97 + idx)}. `;
        return new Paragraph({
          alignment: AlignmentType.BOTH,
          spacing: { line: LINE_PROPER, after: 10 },
          indent: { left: 320, hanging: 320 },
          children: [
            new TextRun({ text: prefix, font: targetFont, size: font12pt }),
            new TextRun({ text: item.text, font: targetFont, size: font12pt }),
          ],
        });
      });

      return new TableRow({
        children: [
          new TableCell({
            width: { size: 2100, type: WidthType.DXA },
            borders: invisibleCellBorders,
            children: [
              new Paragraph({
                spacing: { line: LINE_PROPER },
                children: [
                  new TextRun({
                    text: label,
                    font: targetFont,
                    bold: true,
                    size: font12pt,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 7500, type: WidthType.DXA },
            borders: invisibleCellBorders,
            children: contentParagraphs,
          }),
        ],
      });
    };

    const konsideranRows: TableRow[] = [];
    if (doc.konsideran.menimbang.length > 0) {
      konsideranRows.push(makeKonsideranRow('MENIMBANG :', doc.konsideran.menimbang, false));
    }
    if (doc.konsideran.mengingat.length > 0) {
      konsideranRows.push(makeKonsideranRow('MENGINGAT :', doc.konsideran.mengingat, true));
    }
    if (doc.konsideran.memperhatikan.length > 0) {
      konsideranRows.push(
        makeKonsideranRow('MEMPERHATIKAN :', doc.konsideran.memperhatikan, true)
      );
    }

    mainChildren.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: invisibleTableBorders,
        rows: konsideranRows,
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 30, after: 15 },
        children: [
          new TextRun({
            text: 'MEMUTUSKAN',
            font: targetFont,
            bold: true,
            size: font12pt,
          }),
        ],
      })
    );

    const diktumRows = doc.diktum.map((item) => {
      return new TableRow({
        children: [
          new TableCell({
            width: { size: 2100, type: WidthType.DXA },
            borders: invisibleCellBorders,
            children: [
              new Paragraph({
                spacing: { line: LINE_PROPER },
                children: [
                  new TextRun({
                    text: `${item.label} :`,
                    font: targetFont,
                    bold: true,
                    size: font12pt,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 7500, type: WidthType.DXA },
            borders: invisibleCellBorders,
            children: [
              new Paragraph({
                alignment: AlignmentType.BOTH,
                spacing: { line: LINE_PROPER, after: 10 },
                children: [new TextRun({ text: item.content, font: targetFont, size: font12pt })],
              }),
            ],
          }),
        ],
      });
    });

    mainChildren.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: invisibleTableBorders,
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 2100, type: WidthType.DXA },
                borders: invisibleCellBorders,
                children: [
                  new Paragraph({
                    spacing: { line: LINE_PROPER },
                    children: [
                      new TextRun({
                        text: 'MENETAPKAN :',
                        font: targetFont,
                        bold: true,
                        size: font12pt,
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 7500, type: WidthType.DXA },
                borders: invisibleCellBorders,
                children: [new Paragraph({})],
              }),
            ],
          }),
          ...diktumRows,
        ],
      }),
      new Paragraph({ spacing: { before: 20 } }),
      makeSignatureTable(
        doc.closing.signeeRole,
        doc.closing.signeeName,
        doc.closing.signeeNip,
        doc.closing.city,
        doc.closing.date,
        false
      )
    );

    // Lampiran 1
    if (doc.lampiran1?.enabled) {
      mainChildren.push(
        new Paragraph({ pageBreakBefore: true }),
        createKopTable(2, true),
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          spacing: { before: 100, line: LINE_PROPER },
          children: [
            new TextRun({ text: doc.lampiran1.title, font: targetFont, bold: true, size: font12pt }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          spacing: { line: LINE_PROPER },
          children: [
            new TextRun({ text: doc.lampiran1.subtitle, font: targetFont, size: font12pt }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          spacing: { line: LINE_PROPER, after: 30 },
          children: [
            new TextRun({ text: doc.lampiran1.documentNumber, font: targetFont, size: font12pt }),
          ],
        })
      );

      doc.lampiran1.heading.forEach((h, hIdx) => {
        mainChildren.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { line: LINE_PROPER, after: hIdx === doc.lampiran1.heading.length - 1 ? 40 : 0 },
            children: [new TextRun({ text: h, font: targetFont, bold: true, size: font12pt })],
          })
        );
      });

      const colWidthsL1 = [600, 1200, 2600, 3800, 700, 900];
      const l1HeaderRow = new TableRow({
        tableHeader: true,
        children: doc.lampiran1.headers.map(
          (hdr, idx) =>
            new TableCell({
              width: { size: colWidthsL1[idx] || 1500, type: WidthType.DXA },
              borders: {
                top: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
                bottom: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
                left: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
                right: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
              },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { line: LINE_PROPER, before: 10, after: 10 },
                  children: [
                    new TextRun({ text: hdr, font: targetFont, bold: true, size: font12pt }),
                  ],
                }),
              ],
            })
        ),
      });

      const l1BodyRows = doc.lampiran1.rows.map(
        (row) =>
          new TableRow({
            children: row.map((cellText, cIdx) => {
              const lines = cellText.split('\n');
              return new TableCell({
                width: { size: colWidthsL1[cIdx] || 1500, type: WidthType.DXA },
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
                  bottom: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
                  left: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
                  right: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
                },
                children: lines.map(
                  (l) =>
                    new Paragraph({
                      alignment:
                        cIdx === 0 || cIdx === 1 || cIdx >= 4
                          ? AlignmentType.CENTER
                          : AlignmentType.LEFT,
                      spacing: { line: LINE_TABLE, before: 10, after: 10 },
                      children: [new TextRun({ text: l, font: targetFont, size: font12pt })],
                    })
                ),
              });
            }),
          })
      );

      mainChildren.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [l1HeaderRow, ...l1BodyRows],
        }),
        new Paragraph({ spacing: { before: 60 } }),
        makeSignatureTable(
          doc.closing.signeeRole,
          doc.closing.signeeName,
          doc.closing.signeeNip
        )
      );
    }

    // Lampiran 2
    if (doc.lampiran2?.enabled) {
      mainChildren.push(
        new Paragraph({ pageBreakBefore: true }),
        createKopTable(3, true),
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          spacing: { before: 100, line: LINE_PROPER },
          children: [
            new TextRun({ text: doc.lampiran2.title, font: targetFont, bold: true, size: font12pt }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          spacing: { line: LINE_PROPER },
          children: [
            new TextRun({ text: doc.lampiran2.subtitle, font: targetFont, size: font12pt }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          spacing: { line: LINE_PROPER, after: 30 },
          children: [
            new TextRun({ text: doc.lampiran2.documentNumber, font: targetFont, size: font12pt }),
          ],
        })
      );

      doc.lampiran2.heading.forEach((h, hIdx) => {
        mainChildren.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { line: LINE_PROPER, after: hIdx === doc.lampiran2.heading.length - 1 ? 40 : 0 },
            children: [new TextRun({ text: h, font: targetFont, bold: true, size: font12pt })],
          })
        );
      });

      const colWidthsL2 = [600, 2400, 1200, 800, 1400, 1200, 2000];
      const l2HeaderRow = new TableRow({
        tableHeader: true,
        children: doc.lampiran2.headers.map(
          (hdr, idx) =>
            new TableCell({
              width: { size: colWidthsL2[idx] || 1500, type: WidthType.DXA },
              borders: {
                top: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
                bottom: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
                left: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
                right: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
              },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { line: LINE_PROPER, before: 10, after: 10 },
                  children: [
                    new TextRun({ text: hdr, font: targetFont, bold: true, size: font12pt }),
                  ],
                }),
              ],
            })
        ),
      });

      const l2BodyRows = doc.lampiran2.rows.map(
        (row) =>
          new TableRow({
            children: row.map((cellText, cIdx) => {
              const lines = cellText.split('\n');
              return new TableCell({
                width: { size: colWidthsL2[cIdx] || 1500, type: WidthType.DXA },
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
                  bottom: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
                  left: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
                  right: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
                },
                children: lines.map(
                  (l) =>
                    new Paragraph({
                      alignment:
                        cIdx === 0 || (cIdx >= 2 && cIdx <= 5)
                          ? AlignmentType.CENTER
                          : AlignmentType.LEFT,
                      spacing: { line: LINE_TABLE, before: 10, after: 10 },
                      children: [new TextRun({ text: l, font: targetFont, size: font12pt })],
                    })
                ),
              });
            }),
          })
      );

      mainChildren.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [l2HeaderRow, ...l2BodyRows],
        })
      );

      if (doc.lampiran2.notes.length > 0) {
        mainChildren.push(
          new Paragraph({
            spacing: { before: 80, line: LINE_PROPER },
            children: [
              new TextRun({ text: 'Keterangan :', font: targetFont, bold: true, size: font12pt }),
            ],
          })
        );
        doc.lampiran2.notes.forEach((note) => {
          mainChildren.push(
            new Paragraph({
              spacing: { line: LINE_PROPER },
              indent: { left: 240 },
              children: [new TextRun({ text: `- ${note}`, font: targetFont, size: font12pt })],
            })
          );
        });
      }

      mainChildren.push(
        new Paragraph({ spacing: { before: 60 } }),
        makeSignatureTable(
          doc.closing.signeeRole,
          doc.closing.signeeName,
          doc.closing.signeeNip
        )
      );
    }
  }

  // Create Word Document with strict A4 / Folio (F4) page setup
  const wordDoc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              width: isF4 ? 12240 : 11906, // Folio (8.5 in) vs A4 (210 mm)
              height: isF4 ? 18720 : 16838, // Folio (13.0 in) vs A4 (297 mm)
            },
            margin: {
              top: topTwips,
              bottom: bottomTwips,
              left: leftTwips,
              right: rightTwips,
            },
          },
        },
        children: mainChildren,
      },
    ],
  });

  const blob = await Packer.toBlob(wordDoc);
  const safeFilename = (doc.name || 'Surat_Resmi').replace(/[^a-zA-Z0-9_\-]/g, '_');
  saveAs(blob, `${safeFilename}_${paperSize}.docx`);
}
