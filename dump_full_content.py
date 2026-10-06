import zipfile
import xml.etree.ElementTree as ET
import json

docx_path = r'SURAT KEPUTUSAN PEMBAGIAN TUGAS MENGAJAR TK ISLAM PLUS ARJUNA 2026 2027.docx'
with zipfile.ZipFile(docx_path, 'r') as z:
    # Let's inspect header styles
    h_root = ET.fromstring(z.read('word/header1.xml'))
    ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    header_texts = []
    for p in h_root.findall('.//w:p', ns):
        t = "".join(p.itertext()).strip()
        if t: header_texts.append(t)
    print("Header texts:", header_texts)

    # Let's extract full document texts cleanly
    doc_root = ET.fromstring(z.read('word/document.xml'))
    body = doc_root.find('w:body', ns)
    
    # We want to understand all paragraphs
    full_paragraphs = []
    for elem in body:
        tag = elem.tag.split('}')[-1]
        if tag == 'p':
            t = "".join(elem.itertext()).strip()
            if t: full_paragraphs.append(t)
        elif tag == 'tbl':
            rows = []
            for tr in elem.findall('.//w:tr', ns):
                cells = ["".join(tc.itertext()).strip().replace("\n", " ") for tc in tr.findall('.//w:tc', ns)]
                rows.append(cells)
            full_paragraphs.append({"table": rows})

with open('document_analysis.json', 'w', encoding='utf-8') as f:
    json.dump({'header': header_texts, 'body': full_paragraphs}, f, indent=2, ensure_ascii=False)

print("Saved document_analysis.json")
