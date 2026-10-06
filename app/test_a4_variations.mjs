import fs from 'fs';
import { generateWithSpacing } from './test_spacings.mjs';

// Let's test fine-tuned A4 options with line = 240, 230, 225
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

async function testA4Variations() {
  const logoBytes = fs.readFileSync(path.resolve('public/logo.png'));
  const geomBytes = fs.readFileSync(path.resolve('public/header_corner_geometry.png'));
  const targetFont = 'Times New Roman';
  const FONT_12PT = 24;

  const variations = [
    { name: 'v1_line240_compactHead', line: 240, sigBefore: 600, topMm: 10, botMm: 10 },
    { name: 'v2_line230_proper', line: 230, sigBefore: 700, topMm: 11, botMm: 11 },
    { name: 'v3_line225_proper', line: 225, sigBefore: 750, topMm: 12, botMm: 12 },
  ];

  for (const v of variations) {
    const pageWidthDxa = 11906;
    const pageHeightDxa = 16838;
    const topTwips = Math.round(v.topMm * 56.7);
    const bottomTwips = Math.round(v.botMm * 56.7);
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

    const kopBottomBorder = {
      top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
      left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
      right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
      bottom: { style: BorderStyle.DOUBLE, size: 12, color: '000000' },
    };

    const createKopTable = () => {
      const sideWidth = 1500;
      const centerWidth = 6600;

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
                    transformation: { width: 68, height: 21 },
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
                spacing: { line: 100, before: 0, after: 30 },
                children: [
                  new ImageRun({
                    data: logoBytes,
                    transformation: { width: 62, height: 87 },
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
                spacing: { line: 190, after: 10 },
                children: [new TextRun({ text: 'YAYASAN ARJUNA CENDEKIA', font: targetFont, bold: true, size: 24 })],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { line: 200, after: 10 },
                children: [new TextRun({ text: 'TK ISLAM PLUS ARJUNA', font: targetFont, bold: true, size: 28 })],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { line: 170, after: 10 },
                children: [new TextRun({ text: 'KEC. BLIMBING KEL. PURWANTORO KOTA MALANG', font: targetFont, bold: true, size: 20 })],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { line: 160, after: 30 },
                children: [new TextRun({ text: 'Sekretariat : Jl. Citandui 15 B Malang Kodepos 65116 Telp. (0341) 4371932', font: targetFont, size: 18 })],
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
            spacing: { line: v.line },
            children: [new TextRun({ text: `Ditetapkan di : ${city}`, font: targetFont, size: FONT_12PT })],
          }),
          new Paragraph({
            spacing: { line: v.line, after: 10 },
            children: [new TextRun({ text: `Pada Tanggal  : ${date}`, font: targetFont, size: FONT_12PT })],
          })
        );
      }

      pList.push(
        new Paragraph({
          spacing: { line: v.line },
          children: [new TextRun({ text: 'Kepala', font: targetFont, bold: true, size: FONT_12PT })],
        }),
        new Paragraph({
          spacing: { line: v.line },
          children: [new TextRun({ text: 'TK ISLAM PLUS ARJUNA', font: targetFont, bold: true, size: FONT_12PT })],
        }),
        new Paragraph({
          spacing: { before: v.sigBefore, after: 20 },
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
    mainChildren.push(createKopTable());

    mainChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 80, line: v.line, after: 10 },
        children: [new TextRun({ text: 'SURAT KEPUTUSAN', font: targetFont, bold: true, size: FONT_12PT, underline: {} })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { line: v.line, after: 15 },
        children: [new TextRun({ text: 'Nomor : 01.013/TK-IPA/PTM/VII/2026', font: targetFont, size: FONT_12PT })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { line: v.line, after: 10 },
        children: [new TextRun({ text: 'TENTANG', font: targetFont, bold: true, size: FONT_12PT })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { line: v.line, after: 15 },
        children: [new TextRun({ text: 'PEMBAGIAN TUGAS GURU DALAM PROSES BELAJAR MENGAJAR TAHUN PELAJARAN 2026/2027', font: targetFont, bold: true, size: FONT_12PT })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { line: v.line, after: 20 },
        children: [new TextRun({ text: 'KEPALA TK ISLAM PLUS ARJUNA', font: targetFont, bold: true, size: FONT_12PT })],
      })
    );

    const makeKonsideranRow = (label, items, isNumbered = false) => {
      const contentParagraphs = items.map((text, idx) => {
        const prefix = isNumbered ? `${idx + 1}. ` : `${String.fromCharCode(97 + idx)}. `;
        return new Paragraph({
          alignment: AlignmentType.BOTH,
          spacing: { line: v.line, after: 10 },
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
                spacing: { line: v.line },
                children: [new TextRun({ text: label, font: targetFont, bold: true, size: FONT_12PT })],
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
        children: [new TextRun({ text: 'MEMUTUSKAN', font: targetFont, bold: true, size: FONT_12PT })],
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
                spacing: { line: v.line },
                children: [new TextRun({ text: `${item.label} :`, font: targetFont, bold: true, size: FONT_12PT })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 7500, type: WidthType.DXA },
            borders: invisibleCellBorders,
            children: [
              new Paragraph({
                alignment: AlignmentType.BOTH,
                spacing: { line: v.line, after: 10 },
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
              spacing: { line: v.line },
              children: [new TextRun({ text: 'MENETAPKAN :', font: targetFont, bold: true, size: FONT_12PT })],
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

    // Lampiran 1 & 2 placeholder
    mainChildren.push(
      new Paragraph({ pageBreakBefore: true, children: [new TextRun({ text: 'LAMPIRAN 1' })] }),
      new Paragraph({ pageBreakBefore: true, children: [new TextRun({ text: 'LAMPIRAN 2' })] })
    );

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              size: { width: pageWidthDxa, height: pageHeightDxa },
              margin: { top: topTwips, bottom: bottomTwips, left: leftTwips, right: rightTwips },
            },
          },
          children: mainChildren,
        },
      ],
    });

    const buf = await Packer.toBuffer(doc);
    fs.writeFileSync(`test_a4_${v.name}.docx`, buf);
    console.log(`Generated test_a4_${v.name}.docx`);
  }
}

testA4Variations().catch(console.error);
