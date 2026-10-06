import fs from 'fs';
import path from 'path';
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
  VerticalAlign,
  ImageRun,
} from 'docx';

export async function generateStrictFont12(paperType = 'A4') {
  const logoBytes = fs.readFileSync(path.resolve('public/logo.png'));
  const geomBytes = fs.readFileSync(path.resolve('public/header_corner_geometry.png'));

  const targetFont = 'Times New Roman';
  const FONT_12PT = 24; // 12pt in docx half-points
  const LINE_PROPER = 240; // 1.0 Single Line Spacing (Standar Tata Naskah Dinas Resmi)
  const LINE_TABLE = 220;  // Spasi tabel proporsional dan nyaman dibaca

  const isF4 = paperType === 'F4';
  const pageWidthDxa = isF4 ? 12240 : 11906; // Folio (8.5 in) vs A4 (210mm)
  const pageHeightDxa = isF4 ? 18720 : 16838; // Folio (13.0 in) vs A4 (297mm)

  // Margins in twips:
  // A4: top 10.5mm, bottom 10.5mm, left 20mm, right 15mm (pas 3 halaman dengan spasi 1.0 single)
  // Folio: top 15mm, bottom 15mm, left 20mm, right 15mm
  const topTwips = Math.round((isF4 ? 15 : 10.5) * 56.7);
  const bottomTwips = Math.round((isF4 ? 15 : 10.5) * 56.7);
  const leftTwips = Math.round(20 * 56.7);
  const rightTwips = Math.round(15 * 56.7);

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

  const createKopTable = (isCompact = false) => {
    const sideWidth = isCompact ? 1300 : 1500;
    const centerWidth = isCompact ? 7000 : 6600;

    const kopBottomBorder = {
      top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
      left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
      right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
      bottom: { style: BorderStyle.DOUBLE, size: isCompact ? 10 : 12, color: '000000' },
    };

    const row1 = new TableRow({
      children: [
        new TableCell({
          width: { size: sideWidth, type: WidthType.DXA },
          borders: invisibleCellBorders,
          children: [
            new Paragraph({
              alignment: AlignmentType.LEFT,
              spacing: { line: 100, before: 0, after: 0 },
              children: [
                new ImageRun({
                  data: geomBytes,
                  transformation: {
                    width: isCompact ? 55 : 68,
                    height: isCompact ? 17 : 21,
                  },
                  type: 'png',
                }),
              ],
            }),
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

    const row2 = new TableRow({
      children: [
        new TableCell({
          width: { size: sideWidth, type: WidthType.DXA },
          borders: kopBottomBorder,
          verticalAlign: VerticalAlign.BOTTOM,
          children: [
            new Paragraph({
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
            }),
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
                  text: 'YAYASAN ARJUNA CENDEKIA',
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
                  text: 'TK ISLAM PLUS ARJUNA',
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
                  text: 'KEC. BLIMBING KEL. PURWANTORO KOTA MALANG',
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
                  text: 'Sekretariat : Jl. Citandui 15 B Malang Kodepos 65116 Telp. (0341) 4371932',
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

  const makeSignatureTable = (city, date) => {
    const pList = [];
    if (city && date) {
      pList.push(
        new Paragraph({
          spacing: { line: LINE_PROPER },
          children: [new TextRun({ text: `Ditetapkan di : ${city}`, font: targetFont, size: FONT_12PT })],
        }),
        new Paragraph({
          spacing: { line: LINE_PROPER, after: 10 },
          children: [new TextRun({ text: `Pada Tanggal  : ${date}`, font: targetFont, size: FONT_12PT })],
        })
      );
    }

    pList.push(
      new Paragraph({
        spacing: { line: LINE_PROPER },
        children: [new TextRun({ text: 'Kepala', font: targetFont, bold: true, size: FONT_12PT })],
      }),
      new Paragraph({
        spacing: { line: LINE_PROPER },
        children: [new TextRun({ text: 'TK ISLAM PLUS ARJUNA', font: targetFont, bold: true, size: FONT_12PT })],
      }),
      new Paragraph({
        spacing: { before: isF4 ? 750 : 620, after: 20 },
        children: [
          new TextRun({
            text: '(TITIN HAMIDAH, S.Pd)',
            font: targetFont,
            bold: true,
            size: FONT_12PT,
            underline: {},
          }),
        ],
      })
    );

    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: invisibleTableBorders,
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 5400, type: WidthType.DXA },
              borders: invisibleCellBorders,
              children: [new Paragraph({})],
            }),
            new TableCell({
              width: { size: 4200, type: WidthType.DXA },
              borders: invisibleCellBorders,
              children: pList,
            }),
          ],
        }),
      ],
    });
  };

  const mainChildren = [];

  // =========================================================================
  // HALAMAN 1: SK UTAMA (SPASI STANDAR PROPER 1.0 SINGLE = 240 TWIPS)
  // =========================================================================
  mainChildren.push(createKopTable(false));

  mainChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 80, line: LINE_PROPER, after: 10 },
      children: [
        new TextRun({
          text: 'SURAT KEPUTUSAN',
          font: targetFont,
          bold: true,
          size: FONT_12PT,
          underline: {},
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: LINE_PROPER, after: 15 },
      children: [
        new TextRun({
          text: 'Nomor : 01.013/TK-IPA/PTM/VII/2026',
          font: targetFont,
          size: FONT_12PT,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: LINE_PROPER, after: 10 },
      children: [
        new TextRun({
          text: 'TENTANG',
          font: targetFont,
          bold: true,
          size: FONT_12PT,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: LINE_PROPER, after: 15 },
      children: [
        new TextRun({
          text: 'PEMBAGIAN TUGAS GURU DALAM PROSES BELAJAR MENGAJAR TAHUN PELAJARAN 2026/2027',
          font: targetFont,
          bold: true,
          size: FONT_12PT,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: LINE_PROPER, after: 20 },
      children: [
        new TextRun({
          text: 'KEPALA TK ISLAM PLUS ARJUNA',
          font: targetFont,
          bold: true,
          size: FONT_12PT,
        }),
      ],
    })
  );

  const makeKonsideranRow = (label, items, isNumbered = false) => {
    const contentParagraphs = items.map((text, idx) => {
      const prefix = isNumbered ? `${idx + 1}. ` : `${String.fromCharCode(97 + idx)}. `;
      return new Paragraph({
        alignment: AlignmentType.BOTH,
        spacing: { line: LINE_PROPER, after: 10 },
        indent: { left: 320, hanging: 320 },
        children: [
          new TextRun({ text: prefix, font: targetFont, size: FONT_12PT }),
          new TextRun({ text, font: targetFont, size: FONT_12PT }),
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
                  size: FONT_12PT,
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

  const menimbangItems = [
    'Bahwa dalam rangka memperlancar pelaksanaan Proses Belajar Mengajar atau Proses Bimbingan Konseling di TK ISLAM PLUS ARJUNA, perlu menetapkan pembagian tugas.',
    'Bahwa berdasarkan pertimbangan sebagaimana dimaksud pada butir a di atas, maka perlu menetapkan Keputusan Kepala TK ISLAM PLUS ARJUNA.',
  ];

  const mengingatItems = [
    'Undang-undang RI Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional.',
    'Undang-undang Nomor 14 Tahun 2005 tentang Guru dan Dosen.',
    'Peraturan Pemerintah RI Nomor 19 Tahun 2005 tentang Standar Nasional Pendidikan.',
    'Peraturan Pemerintah RI Nomor 74 Tahun 2008 tentang Guru.',
    'Permendiknas Nomor 24 Tahun 2006 tentang Pelaksanaan Standar Isi dan Standar Kompetensi Kelulusan.',
    'Permendiknas Nomor 22 Tahun 2006 dan Nomor 23 Tahun 2006.',
    'Permendiknas Nomor 19 Tahun 2007 tentang Standar Pengelolaan.',
    'Permendiknas Nomor 41 Tahun 2007 tentang Standar Proses.',
    'Keputusan Menteri Negara Pendayagunaan Aparatur Negara Nomor 84 Tahun 1993 tentang Jabatan Fungsional Guru dan Angka Kreditnya.',
    'Surat Keputusan bersama Menteri Pendidikan dan Kebudayaan dan Kepala Badan Administrasi Kepegawaian Negara Nomor 0433/P/1993 dan Nomor 25 Tahun 1993 tentang Petunjuk Pelaksanaan Jabatan Fungsional Guru dan Angka Kreditnya.',
  ];

  const memperhatikanItems = [
    'Rapat Pembagian Tugas Guru Tahun Ajaran 2026/2027 TK ISLAM PLUS ARJUNA.',
  ];

  mainChildren.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: invisibleTableBorders,
      rows: [
        makeKonsideranRow('MENIMBANG :', menimbangItems, false),
        makeKonsideranRow('MENGINGAT :', mengingatItems, true),
        makeKonsideranRow('MEMPERHATIKAN :', memperhatikanItems, true),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 30, after: 15 },
      children: [
        new TextRun({
          text: 'MEMUTUSKAN',
          font: targetFont,
          bold: true,
          size: FONT_12PT,
        }),
      ],
    })
  );

  const diktumList = [
    { label: 'PERTAMA', content: 'Pembagian tugas guru dalam proses Belajar Mengajar pada tahun pelajaran 2026/2027 sebagaimana tersebut pada lampiran I.' },
    { label: 'KEDUA', content: 'Pembagian Jadwal Mengajar seperti tersebut pada lampiran II.' },
    { label: 'KETIGA', content: 'Segala biaya yang timbul akibat pelaksanaan keputusan dibebankan pada Anggaran Belanja Sekolah.' },
    { label: 'KEEMPAT', content: 'Apabila dikemudian hari terdapat kekeliruan dalam surat keputusan ini, akan diadakan pembetulan sebagaimana mestinya.' },
    { label: 'KELIMA', content: 'Keputusan ini mulai berlaku sejak tanggal ditetapkan.' },
  ];

  const diktumRows = diktumList.map((item) => {
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
                  size: FONT_12PT,
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
              children: [new TextRun({ text: item.content, font: targetFont, size: FONT_12PT })],
            }),
          ],
        }),
      ],
    });
  });

  const menetapkanRow = new TableRow({
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
                size: FONT_12PT,
              }),
            ],
          }),
        ],
      }),
      new TableCell({
        width: { size: 7500, type: WidthType.DXA },
        borders: invisibleCellBorders,
        children: [new Paragraph({ children: [] })],
      }),
    ],
  });

  mainChildren.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: invisibleTableBorders,
      rows: [menetapkanRow, ...diktumRows],
    }),
    new Paragraph({ spacing: { before: 20 } }),
    makeSignatureTable('Malang', '01 Juli 2026')
  );

  // =========================================================================
  // HALAMAN 2: LAMPIRAN 1 (JADWAL MENGAJAR - SPASI PROPER 12PT)
  // =========================================================================
  mainChildren.push(
    new Paragraph({ pageBreakBefore: true }),
    createKopTable(true),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { before: 100, line: LINE_PROPER },
      children: [
        new TextRun({ text: 'LAMPIRAN 1', font: targetFont, bold: true, size: FONT_12PT }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { line: LINE_PROPER },
      children: [
        new TextRun({ text: 'Surat Keputusan Kepala TK Islam Plus Arjuna', font: targetFont, size: FONT_12PT }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { line: LINE_PROPER, after: 30 },
      children: [
        new TextRun({ text: 'Nomor : 01.013/TK-IPA/PTM/VII/2026', font: targetFont, size: FONT_12PT }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: LINE_PROPER },
      children: [new TextRun({ text: 'PEMBAGIAN TUGAS / JADWAL MENGAJAR', font: targetFont, bold: true, size: FONT_12PT })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: LINE_PROPER },
      children: [new TextRun({ text: 'TK ISLAM PLUS ARJUNA', font: targetFont, bold: true, size: FONT_12PT })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: LINE_PROPER, after: 40 },
      children: [new TextRun({ text: 'TAHUN AJARAN 2026/2027', font: targetFont, bold: true, size: FONT_12PT })],
    })
  );

  const l1Headers = ['NO', 'HARI', 'NAMA GURU', 'KEGIATAN PEMBELAJARAN', 'JPM', 'KELOMPOK'];
  const l1HeaderRow = new TableRow({
    tableHeader: true,
    children: l1Headers.map((hdr, idx) => {
      const colWidths = [600, 1200, 2600, 3800, 700, 900];
      return new TableCell({
        width: { size: colWidths[idx], type: WidthType.DXA },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
          bottom: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
          left: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
          right: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
        },
        verticalAlign: VerticalAlign.CENTER,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { line: LINE_PROPER, before: 10, after: 10 },
            children: [new TextRun({ text: hdr, font: targetFont, bold: true, size: FONT_12PT })],
          }),
        ],
      });
    }),
  });

  const l1RowsData = [
    [
      '1.',
      'SELASA',
      'GURU A : DWI RETNO SETYORINI\nGURU B : MERINDA EKA E.',
      'I. KEGIATAN AWAL (30 MNT): AGAMA, SIKAP PERILAKU\nII. KEGIATAN INTI (60 MNT): BAHASA, KOGNITIF, FISIK MOTORIK\nIII. KEGIATAN AKHIR (30 MNT): SENI',
      '3',
      'A & B',
    ],
    [
      '2.',
      'RABU',
      'GURU A : DWI RETNO SETYORINI\nGURU B : MERINDA EKA E.',
      'I. KEGIATAN AWAL (30 MNT): AGAMA, SIKAP PERILAKU\nII. KEGIATAN INTI (60 MNT): BAHASA, KOGNITIF, FISIK MOTORIK\nIII. KEGIATAN AKHIR (30 MNT): SENI',
      '3',
      'A & B',
    ],
    [
      '3.',
      'KAMIS',
      'GURU A : DWI RETNO SETYORINI\nGURU B : MERINDA EKA E.',
      'I. KEGIATAN AWAL (30 MNT): AGAMA, SIKAP PERILAKU\nII. KEGIATAN INTI (60 MNT): BAHASA, KOGNITIF, FISIK MOTORIK\nIII. KEGIATAN AKHIR (30 MNT): SENI',
      '3',
      'A & B',
    ],
    [
      '4.',
      'JUMAT',
      'GURU A : DWI RETNO SETYORINI\nGURU B : MERINDA EKA E.',
      'I. KEGIATAN AWAL (30 MNT): AGAMA, SIKAP PERILAKU\nII. KEGIATAN INTI (60 MNT): BAHASA, KOGNITIF, FISIK MOTORIK\nIII. KEGIATAN AKHIR (30 MNT): SENI',
      '3',
      'A & B',
    ],
    [
      '5.',
      'SABTU',
      'GURU A : DWI RETNO SETYORINI\nGURU B : MERINDA EKA E.',
      'I. KEGIATAN AWAL (30 MNT): AGAMA, SIKAP PERILAKU\nII. KEGIATAN INTI (60 MNT): BAHASA, KOGNITIF, FISIK MOTORIK\nIII. KEGIATAN AKHIR (30 MNT): SENI',
      '3',
      'A & B',
    ],
  ];

  const colWidths = [600, 1200, 2600, 3800, 700, 900];
  const l1BodyRows = l1RowsData.map((row) => {
    return new TableRow({
      children: row.map((cellText, cIdx) => {
        const lines = cellText.split('\n');
        return new TableCell({
          width: { size: colWidths[cIdx], type: WidthType.DXA },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
            bottom: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
            left: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
            right: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
          },
          children: lines.map((l) => {
            return new Paragraph({
              alignment: cIdx === 0 || cIdx === 1 || cIdx >= 4 ? AlignmentType.CENTER : AlignmentType.LEFT,
              spacing: { line: LINE_TABLE, before: 10, after: 10 },
              children: [new TextRun({ text: l, font: targetFont, size: FONT_12PT })],
            });
          }),
        });
      }),
    });
  });

  mainChildren.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [l1HeaderRow, ...l1BodyRows],
    }),
    new Paragraph({ spacing: { before: 60 } }),
    makeSignatureTable()
  );

  // =========================================================================
  // HALAMAN 3: LAMPIRAN 2 (PEMBAGIAN KELAS - SPASI PROPER 12PT)
  // =========================================================================
  mainChildren.push(
    new Paragraph({ pageBreakBefore: true }),
    createKopTable(true),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { before: 100, line: LINE_PROPER },
      children: [
        new TextRun({ text: 'LAMPIRAN 2', font: targetFont, bold: true, size: FONT_12PT }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { line: LINE_PROPER },
      children: [
        new TextRun({ text: 'Surat Keputusan Kepala TK Islam Plus Arjuna', font: targetFont, size: FONT_12PT }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { line: LINE_PROPER, after: 30 },
      children: [
        new TextRun({ text: 'Nomor : 01.013/TK-IPA/PTM/VII/2026', font: targetFont, size: FONT_12PT }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: LINE_PROPER },
      children: [new TextRun({ text: 'PEMBAGIAN TUGAS / JADWAL MENGAJAR', font: targetFont, bold: true, size: FONT_12PT })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: LINE_PROPER },
      children: [new TextRun({ text: 'TK ISLAM PLUS ARJUNA', font: targetFont, bold: true, size: FONT_12PT })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: LINE_PROPER, after: 40 },
      children: [new TextRun({ text: 'TAHUN AJARAN 2026/2027', font: targetFont, bold: true, size: FONT_12PT })],
    })
  );

  const l2Headers = ['NO', 'NAMA / NUPTK', 'JABATAN', 'KELAS', 'JUMLAH SISWA', 'JUMLAH JAM', 'BIDANG STUDI / TUGAS'];
  const l2Widths = [600, 2400, 1200, 800, 1400, 1200, 2000];

  const l2HeaderRow = new TableRow({
    tableHeader: true,
    children: l2Headers.map((hdr, idx) => {
      return new TableCell({
        width: { size: l2Widths[idx], type: WidthType.DXA },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
          bottom: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
          left: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
          right: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
        },
        verticalAlign: VerticalAlign.CENTER,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { line: LINE_PROPER, before: 10, after: 10 },
            children: [new TextRun({ text: hdr, font: targetFont, bold: true, size: FONT_12PT })],
          }),
        ],
      });
    }),
  });

  const l2RowsData = [
    ['1.', 'GURU B : DWI RETNO SETYORINI', 'GURU TK', 'B', 'L = 4, P = 4', '30 JPM', 'GURU KELAS'],
    ['2.', 'GURU A : MERINDA EKA E.', 'GURU TK', 'A', 'L = 2, P = 3', '30 JPM', 'GURU KELAS'],
  ];

  const l2BodyRows = l2RowsData.map((row) => {
    return new TableRow({
      children: row.map((cellText, cIdx) => {
        return new TableCell({
          width: { size: l2Widths[cIdx], type: WidthType.DXA },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
            bottom: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
            left: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
            right: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
          },
          children: [
            new Paragraph({
              alignment: cIdx === 0 || (cIdx >= 2 && cIdx <= 5) ? AlignmentType.CENTER : AlignmentType.LEFT,
              spacing: { line: LINE_TABLE, before: 10, after: 10 },
              children: [new TextRun({ text: cellText, font: targetFont, size: FONT_12PT })],
            }),
          ],
        });
      }),
    });
  });

  mainChildren.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [l2HeaderRow, ...l2BodyRows],
    }),
    new Paragraph({
      spacing: { before: 80, line: LINE_PROPER },
      children: [new TextRun({ text: 'Keterangan :', font: targetFont, bold: true, size: FONT_12PT })],
    }),
    new Paragraph({
      spacing: { line: LINE_PROPER },
      indent: { left: 240 },
      children: [new TextRun({ text: '- 30 menit berbanding 1 jam pelajaran', font: targetFont, size: FONT_12PT })],
    }),
    new Paragraph({
      spacing: { line: LINE_PROPER },
      indent: { left: 240 },
      children: [new TextRun({ text: '- Pembiasaan awal sebelum kegiatan, selama 30 menit', font: targetFont, size: FONT_12PT })],
    }),
    new Paragraph({
      spacing: { line: LINE_PROPER },
      indent: { left: 240 },
      children: [new TextRun({ text: '- Jadi jumlah jam pelajaran per hari sama dengan 5 jam pelajaran', font: targetFont, size: FONT_12PT })],
    }),
    new Paragraph({ spacing: { before: 80 } }),
    makeSignatureTable()
  );

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              width: pageWidthDxa,
              height: pageHeightDxa,
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

  const buffer = await Packer.toBuffer(doc);
  return buffer;
}

async function run() {
  const bufA4 = await generateStrictFont12('A4');
  fs.writeFileSync('C:/Users/lenovo/Downloads/SURAT KEPUTUSAN_RAPI.docx', bufA4);
  fs.writeFileSync('C:/Users/lenovo/Downloads/SURAT KEPUTUSAN.docx', bufA4);
  console.log('Saved SURAT KEPUTUSAN_RAPI.docx and SURAT KEPUTUSAN.docx with PROPER STANDARD SPACING (A4)');

  const bufF4 = await generateStrictFont12('F4');
  fs.writeFileSync('C:/Users/lenovo/Downloads/SURAT KEPUTUSAN_RAPI_FOLIO.docx', bufF4);
  console.log('Saved SURAT KEPUTUSAN_RAPI_FOLIO.docx with PROPER STANDARD SPACING (Folio/F4)');
}

run().catch(console.error);
