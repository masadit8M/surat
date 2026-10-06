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

const logoBytes = fs.readFileSync(path.resolve('public/logo.png'));
const geomBytes = fs.readFileSync(path.resolve('public/header_corner_geometry.png'));
const targetFont = 'Times New Roman';
const FONT_12PT = 24;

const invisibleCellBorders = {
  top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
  bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
  left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
  right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
};

// Row 1: Geometry in top-left
const row1 = new TableRow({
  children: [
    new TableCell({
      width: { size: 1500, type: WidthType.DXA },
      borders: invisibleCellBorders,
      children: [
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { line: 100, before: 0, after: 0 },
          children: [
            new ImageRun({
              data: geomBytes,
              transformation: { width: 70, height: 21 },
              type: 'png',
            }),
          ],
        }),
      ],
    }),
    new TableCell({
      width: { size: 6600, type: WidthType.DXA },
      borders: invisibleCellBorders,
      children: [new Paragraph({ spacing: { line: 100, before: 0, after: 0 } })],
    }),
    new TableCell({
      width: { size: 1500, type: WidthType.DXA },
      borders: invisibleCellBorders,
      children: [new Paragraph({ spacing: { line: 100, before: 0, after: 0 } })],
    }),
  ],
});

// Row 2: Logo on left, text in center, bottom border = DOUBLE LINE
const kopBottomBorder = {
  top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
  left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
  right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
  bottom: { style: BorderStyle.DOUBLE, size: 12, color: '000000' },
};

const row2 = new TableRow({
  children: [
    new TableCell({
      width: { size: 1500, type: WidthType.DXA },
      borders: kopBottomBorder,
      verticalAlign: VerticalAlign.BOTTOM,
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { line: 100, before: 0, after: 40 },
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
      width: { size: 6600, type: WidthType.DXA },
      borders: kopBottomBorder,
      verticalAlign: VerticalAlign.BOTTOM,
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { line: 200, after: 10 },
          children: [
            new TextRun({
              text: 'YAYASAN ARJUNA CENDEKIA',
              font: targetFont,
              bold: true,
              size: FONT_12PT,
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { line: 210, after: 10 },
          children: [
            new TextRun({
              text: 'TK ISLAM PLUS ARJUNA',
              font: targetFont,
              bold: true,
              size: FONT_12PT + 4,
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { line: 180, after: 10 },
          children: [
            new TextRun({
              text: 'KEC. BLIMBING KEL. PURWANTORO KOTA MALANG',
              font: targetFont,
              bold: true,
              size: FONT_12PT - 4,
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { line: 170, after: 40 },
          children: [
            new TextRun({
              text: 'Sekretariat : Jl. Citandui 15 B Malang Kodepos 65116 Telp. (0341) 4371932',
              font: targetFont,
              size: FONT_12PT - 6,
            }),
          ],
        }),
      ],
    }),
    new TableCell({
      width: { size: 1500, type: WidthType.DXA },
      borders: kopBottomBorder,
      verticalAlign: VerticalAlign.BOTTOM,
      children: [new Paragraph({ children: [] })],
    }),
  ],
});

const kopTable = new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  borders: {
    top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    insideHorizontal: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    insideVertical: { style: BorderStyle.NONE, size: 0, color: 'auto' },
  },
  rows: [row1, row2],
});

const doc = new Document({
  sections: [
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 680, bottom: 680, left: 1134, right: 850 },
        },
      },
      children: [
        kopTable,
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 180, after: 30 },
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
      ],
    },
  ],
});

const buf = await Packer.toBuffer(doc);
fs.writeFileSync('test_kop.docx', buf);
console.log('Saved test_kop.docx');
