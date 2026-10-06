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

export async function generateWithSpacing(lineSpacingTwips = 240, afterTwips = 20, paperType = 'A4') {
  const logoBytes = fs.readFileSync(path.resolve('public/logo.png'));
  const geomBytes = fs.readFileSync(path.resolve('public/header_corner_geometry.png'));

  const targetFont = 'Times New Roman';
  const FONT_12PT = 24;

  const isF4 = paperType === 'F4';
  const pageWidthDxa = isF4 ? 12240 : 11906;
  const pageHeightDxa = isF4 ? 18720 : 16838;

  // Margins in twips: top 12mm (A4) / 15mm (F4), bottom 12mm (A4) / 15mm (F4), left 20mm, right 15mm
  const topTwips = Math.round((isF4 ? 15 : 12) * 56.7);
  const bottomTwips = Math.round((isF4 ? 15 : 12) * 56.7);
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
          spacing: { line: lineSpacingTwips },
          children: [new TextRun({ text: `Ditetapkan di : ${city}`, font: targetFont, size: FONT_12PT })],
        }),
        new Paragraph({
          spacing: { line: lineSpacingTwips, after: 20 },
          children: [new TextRun({ text: `Pada Tanggal  : ${date}`, font: targetFont, size: FONT_12PT })],
        })
      );
    }

    pList.push(
      new Paragraph({
        spacing: { line: lineSpacingTwips },
        children: [new TextRun({ text: 'Kepala', font: targetFont, bold: true, size: FONT_12PT })],
      }),
      new Paragraph({
        spacing: { line: lineSpacingTwips },
        children: [new TextRun({ text: 'TK ISLAM PLUS ARJUNA', font: targetFont, bold: true, size: FONT_12PT })],
      }),
      new Paragraph({
        spacing: { before: 750, after: 20 },
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

  // HALAMAN 1
  mainChildren.push(createKopTable(false));

  mainChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, line: lineSpacingTwips, after: 10 },
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
      spacing: { line: lineSpacingTwips, after: 20 },
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
      spacing: { line: lineSpacingTwips, after: 10 },
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
      spacing: { line: lineSpacingTwips, after: 20 },
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
      spacing: { line: lineSpacingTwips, after: 30 },
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
        spacing: { line: lineSpacingTwips, after: afterTwips },
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
              spacing: { line: lineSpacingTwips },
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
      spacing: { before: 40, after: 20 },
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
              spacing: { line: lineSpacingTwips },
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
              spacing: { line: lineSpacingTwips, after: afterTwips },
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
            spacing: { line: lineSpacingTwips },
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
    new Paragraph({ spacing: { before: 30 } }),
    makeSignatureTable('Malang', '01 Juli 2026')
  );

  // HALAMAN 2
  mainChildren.push(
    new Paragraph({ pageBreakBefore: true }),
    createKopTable(true),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { before: 100, line: lineSpacingTwips },
      children: [new TextRun({ text: 'LAMPIRAN 1', font: targetFont, bold: true, size: FONT_12PT })],
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { line: lineSpacingTwips },
      children: [new TextRun({ text: 'Surat Keputusan Kepala TK Islam Plus Arjuna', font: targetFont, size: FONT_12PT })],
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { line: lineSpacingTwips, after: 30 },
      children: [new TextRun({ text: 'Nomor : 01.013/TK-IPA/PTM/VII/2026', font: targetFont, size: FONT_12PT })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: lineSpacingTwips },
      children: [new TextRun({ text: 'PEMBAGIAN TUGAS / JADWAL MENGAJAR', font: targetFont, bold: true, size: FONT_12PT })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: lineSpacingTwips },
      children: [new TextRun({ text: 'TK ISLAM PLUS ARJUNA', font: targetFont, bold: true, size: FONT_12PT })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: lineSpacingTwips, after: 40 },
      children: [new TextRun({ text: 'TAHUN AJARAN 2026/2027', font: targetFont, bold: true, size: FONT_12PT })],
    })
  );

  const makeL1HeaderCell = (text, width) =>
    new TableCell({
      width: { size: width, type: WidthType.DXA },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
        left: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
        bottom: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
        right: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
      },
      verticalAlign: VerticalAlign.CENTER,
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { line: lineSpacingTwips, after: 10, before: 10 },
          children: [new TextRun({ text, font: targetFont, bold: true, size: FONT_12PT })],
        }),
      ],
    });

  const l1HeaderRow = new TableRow({
    children: [
      makeL1HeaderCell('NO', 500),
      makeL1HeaderCell('HARI', 1100),
      makeL1HeaderCell('NAMA GURU', 2100),
      makeL1HeaderCell('KEGIATAN PEMBELAJARAN', 3500),
      makeL1HeaderCell('JPM', 600),
      makeL1HeaderCell('KELOMPOK', 1400),
    ],
  });

  const makeL1BodyCell = (paragraphs, width, align = AlignmentType.LEFT) =>
    new TableCell({
      width: { size: width, type: WidthType.DXA },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
        left: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
        bottom: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
        right: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
      },
      children: paragraphs.map(
        (p) =>
          new Paragraph({
            alignment: align,
            spacing: { line: lineSpacingTwips, after: 5 },
            children: [new TextRun({ text: p, font: targetFont, size: FONT_12PT })],
          })
      ),
    });

  const l1Days = ['SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU'];
  const l1Rows = l1Days.map((hari, idx) => {
    return new TableRow({
      children: [
        makeL1BodyCell([`${idx + 1}.`], 500, AlignmentType.CENTER),
        makeL1BodyCell([hari], 1100, AlignmentType.CENTER),
        makeL1BodyCell(['GURU A : DWI RETNO SETYORINI', 'GURU B : MERINDA EKA E.'], 2100),
        makeL1BodyCell([
          'I. KEGIATAN AWAL (30 MNT): AGAMA, SIKAP PERILAKU',
          'II. KEGIATAN INTI (60 MNT): BAHASA, KOGNITIF, FISIK MOTORIK',
          'III. KEGIATAN AKHIR (30 MNT): SENI',
        ], 3500),
        makeL1BodyCell(['3'], 600, AlignmentType.CENTER),
        makeL1BodyCell(['A & B'], 1400, AlignmentType.CENTER),
      ],
    });
  });

  mainChildren.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [l1HeaderRow, ...l1Rows],
    }),
    new Paragraph({ spacing: { before: 60 } }),
    makeSignatureTable()
  );

  // HALAMAN 3
  mainChildren.push(
    new Paragraph({ pageBreakBefore: true }),
    createKopTable(true),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { before: 100, line: lineSpacingTwips },
      children: [new TextRun({ text: 'LAMPIRAN 2', font: targetFont, bold: true, size: FONT_12PT })],
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { line: lineSpacingTwips },
      children: [new TextRun({ text: 'Surat Keputusan Kepala TK Islam Plus Arjuna', font: targetFont, size: FONT_12PT })],
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { line: lineSpacingTwips, after: 30 },
      children: [new TextRun({ text: 'Nomor : 01.013/TK-IPA/PTM/VII/2026', font: targetFont, size: FONT_12PT })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: lineSpacingTwips },
      children: [new TextRun({ text: 'PEMBAGIAN TUGAS / JADWAL MENGAJAR', font: targetFont, bold: true, size: FONT_12PT })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: lineSpacingTwips },
      children: [new TextRun({ text: 'TK ISLAM PLUS ARJUNA', font: targetFont, bold: true, size: FONT_12PT })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: lineSpacingTwips, after: 40 },
      children: [new TextRun({ text: 'TAHUN AJARAN 2026/2027', font: targetFont, bold: true, size: FONT_12PT })],
    })
  );

  const makeL2HeaderCell = (text, width) =>
    new TableCell({
      width: { size: width, type: WidthType.DXA },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
        left: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
        bottom: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
        right: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
      },
      verticalAlign: VerticalAlign.CENTER,
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { line: lineSpacingTwips, after: 10, before: 10 },
          children: [new TextRun({ text, font: targetFont, bold: true, size: FONT_12PT })],
        }),
      ],
    });

  const l2HeaderRow = new TableRow({
    children: [
      makeL2HeaderCell('NO', 600),
      makeL2HeaderCell('NAMA / NUPTK', 2400),
      makeL2HeaderCell('JABATAN', 1200),
      makeL2HeaderCell('KELAS', 800),
      makeL2HeaderCell('JUMLAH SISWA', 1400),
      makeL2HeaderCell('JUMLAH JAM', 1200),
      makeL2HeaderCell('BIDANG STUDI / TUGAS', 2000),
    ],
  });

  const makeL2BodyCell = (paragraphs, width, align = AlignmentType.LEFT) =>
    new TableCell({
      width: { size: width, type: WidthType.DXA },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
        left: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
        bottom: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
        right: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
      },
      children: paragraphs.map(
        (p) =>
          new Paragraph({
            alignment: align,
            spacing: { line: lineSpacingTwips, after: 5 },
            children: [new TextRun({ text: p, font: targetFont, size: FONT_12PT })],
          })
      ),
    });

  const l2Rows = [
    new TableRow({
      children: [
        makeL2BodyCell(['1.'], 600, AlignmentType.CENTER),
        makeL2BodyCell(['GURU B : DWI RETNO SETYORINI'], 2400),
        makeL2BodyCell(['GURU TK'], 1200, AlignmentType.CENTER),
        makeL2BodyCell(['B'], 800, AlignmentType.CENTER),
        makeL2BodyCell(['L = 4, P = 4'], 1400, AlignmentType.CENTER),
        makeL2BodyCell(['30 JPM'], 1200, AlignmentType.CENTER),
        makeL2BodyCell(['GURU KELAS'], 2000),
      ],
    }),
    new TableRow({
      children: [
        makeL2BodyCell(['2.'], 600, AlignmentType.CENTER),
        makeL2BodyCell(['GURU A : MERINDA EKA E.'], 2400),
        makeL2BodyCell(['GURU TK'], 1200, AlignmentType.CENTER),
        makeL2BodyCell(['A'], 800, AlignmentType.CENTER),
        makeL2BodyCell(['L = 2, P = 3'], 1400, AlignmentType.CENTER),
        makeL2BodyCell(['30 JPM'], 1200, AlignmentType.CENTER),
        makeL2BodyCell(['GURU KELAS'], 2000),
      ],
    }),
  ];

  mainChildren.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [l2HeaderRow, ...l2Rows],
    }),
    new Paragraph({
      spacing: { before: 80, line: lineSpacingTwips },
      children: [new TextRun({ text: 'Keterangan :', font: targetFont, bold: true, size: FONT_12PT })],
    }),
    new Paragraph({
      spacing: { line: lineSpacingTwips },
      indent: { left: 240 },
      children: [new TextRun({ text: '- 30 menit berbanding 1 jam pelajaran', font: targetFont, size: FONT_12PT })],
    }),
    new Paragraph({
      spacing: { line: lineSpacingTwips },
      indent: { left: 240 },
      children: [new TextRun({ text: '- Pembiasaan awal sebelum kegiatan, selama 30 menit', font: targetFont, size: FONT_12PT })],
    }),
    new Paragraph({
      spacing: { line: lineSpacingTwips },
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

  return await Packer.toBuffer(doc);
}

async function testAll() {
  const configs = [
    { name: 'spasi_240_single', line: 240, after: 20 },
    { name: 'spasi_260_proper', line: 260, after: 30 },
    { name: 'spasi_276_115', line: 276, after: 40 },
  ];

  for (const c of configs) {
    const bufA4 = await generateWithSpacing(c.line, c.after, 'A4');
    fs.writeFileSync(`test_${c.name}_A4.docx`, bufA4);
    const bufF4 = await generateWithSpacing(c.line, c.after, 'F4');
    fs.writeFileSync(`test_${c.name}_F4.docx`, bufF4);
    console.log(`Generated test files for ${c.name}`);
  }
}

testAll().catch(console.error);
