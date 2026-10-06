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
  ImageRun,
} from 'docx';

async function generate() {
  const logoPath = path.resolve('public/logo.png');
  const geomPath = path.resolve('public/header_corner_geometry.png');

  const logoBytes = fs.readFileSync(logoPath);
  const geomBytes = fs.readFileSync(geomPath);

  const targetFont = 'Times New Roman';

  // Margins in twips (dxa): top 15mm, bottom 15mm, left 20mm, right 15mm
  const topTwips = Math.round(15 * 56.7);
  const bottomTwips = Math.round(15 * 56.7);
  const leftTwips = Math.round(20 * 56.7);
  const rightTwips = Math.round(15 * 56.7);

  // Invisible borders for layout tables
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

  // Helper create Kop Surat
  const createKopTable = (isCompact = false) => {
    const leftCellChildren = [];

    // 1. Ornamen Garis Miring Geometri
    leftCellChildren.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { line: 100, before: 0, after: isCompact ? 20 : 40 },
        children: [
          new ImageRun({
            data: geomBytes,
            transformation: {
              width: isCompact ? 60 : 75,
              height: isCompact ? 20 : 25,
            },
            type: 'png',
          }),
        ],
      })
    );

    // 2. Logo Resmi Yayasan
    leftCellChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { line: 100, before: 0, after: 0 },
        children: [
          new ImageRun({
            data: logoBytes,
            transformation: {
              width: isCompact ? 66 : 86,
              height: isCompact ? 92 : 120,
            },
            type: 'png',
          }),
        ],
      })
    );

    const sideWidth = isCompact ? 1400 : 1700;
    const centerWidth = isCompact ? 6800 : 6200;

    const kopCells = [
      new TableCell({
        width: { size: sideWidth, type: WidthType.DXA },
        borders: invisibleCellBorders,
        children: leftCellChildren,
      }),
      new TableCell({
        width: { size: centerWidth, type: WidthType.DXA },
        borders: invisibleCellBorders,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { line: isCompact ? 190 : 220, after: isCompact ? 10 : 20 },
            children: [
              new TextRun({
                text: 'YAYASAN ARJUNA CENDEKIA',
                font: targetFont,
                bold: true,
                size: isCompact ? 21 : 25, // 10.5pt vs 12.5pt
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { line: isCompact ? 200 : 240, after: isCompact ? 10 : 20 },
            children: [
              new TextRun({
                text: 'TK ISLAM PLUS ARJUNA',
                font: targetFont,
                bold: true,
                size: isCompact ? 26 : 32, // 13pt vs 16pt
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { line: isCompact ? 180 : 200, after: isCompact ? 10 : 20 },
            children: [
              new TextRun({
                text: 'KEC. BLIMBING KEL. PURWANTORO KOTA MALANG',
                font: targetFont,
                bold: true,
                size: isCompact ? 17 : 20, // 8.5pt vs 10pt
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { line: isCompact ? 170 : 190, after: isCompact ? 20 : 40 },
            children: [
              new TextRun({
                text: 'Sekretariat : Jl. Citandui 15 B Malang Kodepos 65116 Telp. (0341) 4371932',
                font: targetFont,
                size: isCompact ? 15 : 18, // 7.5pt vs 9pt
              }),
            ],
          }),
        ],
      }),
      new TableCell({
        width: { size: sideWidth, type: WidthType.DXA },
        borders: invisibleCellBorders,
        children: [new Paragraph({ children: [] })],
      }),
    ];

    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: invisibleTableBorders,
      rows: [new TableRow({ children: kopCells })],
    });
  };

  const createKopSeparator = (isCompact = false) => {
    return new Paragraph({
      border: {
        bottom: {
          color: '000000',
          space: 2,
          style: BorderStyle.DOUBLE,
          size: isCompact ? 10 : 14,
        },
      },
      spacing: { after: isCompact ? 60 : 140 },
      children: [],
    });
  };

  const makeSignatureTable = (city, date) => {
    const pList = [];
    if (city && date) {
      pList.push(
        new Paragraph({
          spacing: { line: 210 },
          children: [new TextRun({ text: `Ditetapkan di : ${city}`, font: targetFont, size: 20 })],
        }),
        new Paragraph({
          spacing: { line: 210, after: 40 },
          children: [new TextRun({ text: `Pada Tanggal  : ${date}`, font: targetFont, size: 20 })],
        })
      );
    }

    pList.push(
      new Paragraph({
        spacing: { line: 220 },
        children: [new TextRun({ text: 'Kepala', font: targetFont, bold: true, size: 22 })],
      }),
      new Paragraph({
        spacing: { line: 220 },
        children: [new TextRun({ text: 'TK ISLAM PLUS ARJUNA', font: targetFont, bold: true, size: 22 })],
      }),
      new Paragraph({
        spacing: { before: 500, after: 40 },
        children: [
          new TextRun({
            text: '(TITIN HAMIDAH, S.Pd)',
            font: targetFont,
            bold: true,
            size: 22,
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
              width: { size: 5600, type: WidthType.DXA },
              borders: invisibleCellBorders,
              children: [new Paragraph({})],
            }),
            new TableCell({
              width: { size: 4000, type: WidthType.DXA },
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
  // HALAMAN 1: SK UTAMA
  // =========================================================================
  mainChildren.push(createKopTable(false));
  mainChildren.push(createKopSeparator(false));

  mainChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: 240, after: 20 },
      children: [
        new TextRun({
          text: 'SURAT KEPUTUSAN',
          font: targetFont,
          bold: true,
          size: 26,
          underline: {},
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: 220, after: 80 },
      children: [
        new TextRun({
          text: 'Nomor : 01.013/TK-IPA/PTM/VII/2026',
          font: targetFont,
          size: 20,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: 220, after: 20 },
      children: [
        new TextRun({
          text: 'TENTANG',
          font: targetFont,
          bold: true,
          size: 21,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: 230, after: 80 },
      children: [
        new TextRun({
          text: 'PEMBAGIAN TUGAS GURU DALAM PROSES BELAJAR MENGAJAR TAHUN PELAJARAN 2026/2027',
          font: targetFont,
          bold: true,
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: 230, after: 120 },
      children: [
        new TextRun({
          text: 'KEPALA TK ISLAM PLUS ARJUNA',
          font: targetFont,
          bold: true,
          size: 22,
        }),
      ],
    })
  );

  const makeKonsideranRow = (label, items, isNumbered = false) => {
    const contentParagraphs = items.map((text, idx) => {
      const prefix = isNumbered ? `${idx + 1}. ` : `${String.fromCharCode(97 + idx)}. `;
      return new Paragraph({
        alignment: AlignmentType.BOTH,
        spacing: { line: 230, after: 30 },
        indent: { left: 300, hanging: 300 },
        children: [
          new TextRun({ text: prefix, font: targetFont, size: 20 }),
          new TextRun({ text, font: targetFont, size: 20 }),
        ],
      });
    });

    return new TableRow({
      children: [
        new TableCell({
          width: { size: 2000, type: WidthType.DXA },
          borders: invisibleCellBorders,
          children: [
            new Paragraph({
              spacing: { line: 230 },
              children: [
                new TextRun({
                  text: label,
                  font: targetFont,
                  bold: true,
                  size: 20,
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          width: { size: 7600, type: WidthType.DXA },
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

  const konsideranTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: invisibleTableBorders,
    rows: [
      makeKonsideranRow('MENIMBANG :', menimbangItems, false),
      makeKonsideranRow('MENGINGAT :', mengingatItems, true),
      makeKonsideranRow('MEMPERHATIKAN :', memperhatikanItems, true),
    ],
  });
  mainChildren.push(konsideranTable);

  mainChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 60 },
      children: [
        new TextRun({
          text: 'MEMUTUSKAN',
          font: targetFont,
          bold: true,
          size: 22,
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
          width: { size: 2000, type: WidthType.DXA },
          borders: invisibleCellBorders,
          children: [
            new Paragraph({
              spacing: { line: 230 },
              children: [
                new TextRun({
                  text: `${item.label} :`,
                  font: targetFont,
                  bold: true,
                  size: 20,
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          width: { size: 7600, type: WidthType.DXA },
          borders: invisibleCellBorders,
          children: [
            new Paragraph({
              alignment: AlignmentType.BOTH,
              spacing: { line: 230, after: 30 },
              children: [new TextRun({ text: item.content, font: targetFont, size: 20 })],
            }),
          ],
        }),
      ],
    });
  });

  const diktumTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: invisibleTableBorders,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 2000, type: WidthType.DXA },
            borders: invisibleCellBorders,
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'MENETAPKAN :',
                    font: targetFont,
                    bold: true,
                    size: 20,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 7600, type: WidthType.DXA },
            borders: invisibleCellBorders,
            children: [new Paragraph({})],
          }),
        ],
      }),
      ...diktumRows,
    ],
  });
  mainChildren.push(diktumTable);

  mainChildren.push(
    new Paragraph({ spacing: { before: 140 } }),
    makeSignatureTable('Malang', '01 Juli 2026')
  );

  // =========================================================================
  // HALAMAN 2: LAMPIRAN 1 (JADWAL MENGAJAR)
  // =========================================================================
  mainChildren.push(
    new Paragraph({ pageBreakBefore: true }),
    createKopTable(true),
    createKopSeparator(true),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { line: 200 },
      children: [
        new TextRun({ text: 'LAMPIRAN 1', font: targetFont, bold: true, size: 18 }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { line: 200 },
      children: [
        new TextRun({ text: 'Surat Keputusan Kepala TK Islam Plus Arjuna', font: targetFont, size: 17 }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { line: 200, after: 80 },
      children: [
        new TextRun({ text: 'Nomor : 01.013/TK-IPA/PTM/VII/2026', font: targetFont, size: 17 }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: 210 },
      children: [new TextRun({ text: 'PEMBAGIAN TUGAS / JADWAL MENGAJAR', font: targetFont, bold: true, size: 20 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: 210 },
      children: [new TextRun({ text: 'TK ISLAM PLUS ARJUNA', font: targetFont, bold: true, size: 20 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: 210, after: 100 },
      children: [new TextRun({ text: 'TAHUN AJARAN 2026/2027', font: targetFont, bold: true, size: 20 })],
    })
  );

  const l1Headers = ['NO', 'HARI', 'NAMA GURU', 'KEGIATAN PEMBELAJARAN', 'JPM', 'KELOMPOK'];
  const l1HeaderRow = new TableRow({
    tableHeader: true,
    children: l1Headers.map((hdr, idx) => {
      const colWidths = [600, 1200, 2400, 3600, 800, 1000];
      return new TableCell({
        width: { size: colWidths[idx], type: WidthType.DXA },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
          bottom: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
          left: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
          right: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: hdr, font: targetFont, bold: true, size: 17 })],
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
      'I. KEGIATAN AWAL = 30 MENIT\n- AGAMA\n- SIKAP PERILAKU\nII. KEGIATAN INTI = 60 MENIT\n- BAHASA\n- KOGNITIF\n- FISIK MOTORIK\nIII. KEGIATAN AKHIR = 30 MENIT\n- SENI',
      '3',
      'A & B',
    ],
    [
      '2.',
      'RABU',
      'GURU A : DWI RETNO SETYORINI\nGURU B : MERINDA EKA E.',
      'I. KEGIATAN AWAL = 30 MENIT\n- AGAMA\n- SIKAP PERILAKU\nII. KEGIATAN INTI = 60 MENIT\n- BAHASA\n- KOGNITIF\n- FISIK MOTORIK\nIII. KEGIATAN AKHIR = 30 MENIT\n- SENI',
      '3',
      'A & B',
    ],
    [
      '3.',
      'KAMIS',
      'GURU A : DWI RETNO SETYORINI\nGURU B : MERINDA EKA E.',
      'I. KEGIATAN AWAL = 30 MENIT\n- AGAMA\n- SIKAP PERILAKU\nII. KEGIATAN INTI = 60 MENIT\n- BAHASA\n- KOGNITIF\n- FISIK MOTORIK\nIII. KEGIATAN AKHIR = 30 MENIT\n- SENI',
      '3',
      'A & B',
    ],
    [
      '4.',
      'JUMAT',
      'GURU A : DWI RETNO SETYORINI\nGURU B : MERINDA EKA E.',
      'I. KEGIATAN AWAL = 30 MENIT\n- AGAMA\n- SIKAP PERILAKU\nII. KEGIATAN INTI = 60 MENIT\n- BAHASA\n- KOGNITIF\n- FISIK MOTORIK\nIII. KEGIATAN AKHIR = 30 MENIT\n- SENI',
      '3',
      'A & B',
    ],
    [
      '5.',
      'SABTU',
      'GURU A : DWI RETNO SETYORINI\nGURU B : MERINDA EKA E.',
      'I. KEGIATAN AWAL = 30 MENIT\n- AGAMA\n- SIKAP PERILAKU\nII. KEGIATAN INTI = 60 MENIT\n- BAHASA\n- KOGNITIF\n- FISIK MOTORIK\nIII. KEGIATAN AKHIR = 30 MENIT\n- SENI',
      '3',
      'A & B',
    ],
  ];

  const colWidths = [600, 1200, 2400, 3600, 800, 1000];
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
              children: [new TextRun({ text: l, font: targetFont, size: 16 })],
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
    new Paragraph({ spacing: { before: 180 } }),
    makeSignatureTable()
  );

  // =========================================================================
  // HALAMAN 3: LAMPIRAN 2 (BEBAN MENGAJAR & KETERANGAN)
  // =========================================================================
  mainChildren.push(
    new Paragraph({ pageBreakBefore: true }),
    createKopTable(true),
    createKopSeparator(true),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { line: 200 },
      children: [
        new TextRun({ text: 'LAMPIRAN 2', font: targetFont, bold: true, size: 18 }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { line: 200 },
      children: [
        new TextRun({ text: 'Surat Keputusan Kepala TK Islam Plus Arjuna', font: targetFont, size: 17 }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { line: 200, after: 80 },
      children: [
        new TextRun({ text: 'Nomor : 01.013/TK-IPA/PTM/VII/2026', font: targetFont, size: 17 }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: 210 },
      children: [new TextRun({ text: 'PEMBAGIAN TUGAS / JADWAL MENGAJAR', font: targetFont, bold: true, size: 20 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: 210 },
      children: [new TextRun({ text: 'TK ISLAM PLUS ARJUNA', font: targetFont, bold: true, size: 20 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: 210, after: 100 },
      children: [new TextRun({ text: 'TAHUN AJARAN 2026/2027', font: targetFont, bold: true, size: 20 })],
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
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: hdr, font: targetFont, bold: true, size: 17 })],
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
              children: [new TextRun({ text: cellText, font: targetFont, size: 16 })],
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
      spacing: { before: 140, line: 210 },
      children: [new TextRun({ text: 'Keterangan :', font: targetFont, bold: true, size: 18 })],
    }),
    new Paragraph({
      spacing: { line: 210 },
      indent: { left: 240 },
      children: [new TextRun({ text: '- 30 menit berbanding 1 jam pelajaran', font: targetFont, size: 18 })],
    }),
    new Paragraph({
      spacing: { line: 210 },
      indent: { left: 240 },
      children: [new TextRun({ text: '- Pembiasaan awal sebelum kegiatan, selama 30 menit', font: targetFont, size: 18 })],
    }),
    new Paragraph({
      spacing: { line: 210 },
      indent: { left: 240 },
      children: [new TextRun({ text: '- Jadi jumlah jam pelajaran per hari sama dengan 5 jam pelajaran', font: targetFont, size: 18 })],
    }),
    new Paragraph({ spacing: { before: 180 } }),
    makeSignatureTable()
  );

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              width: 11906, // A4 210 mm
              height: 16838, // A4 297 mm
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
  const outPath1 = 'C:/Users/lenovo/Downloads/SURAT KEPUTUSAN_RAPI.docx';
  const outPath2 = 'C:/Users/lenovo/Downloads/SURAT KEPUTUSAN.docx';

  fs.writeFileSync(outPath1, buffer);
  fs.writeFileSync(outPath2, buffer);
  console.log('Successfully saved clean Word files:');
  console.log('1. ' + outPath1);
  console.log('2. ' + outPath2);
}

generate().catch(console.error);
