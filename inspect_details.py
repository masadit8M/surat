import zipfile
import xml.etree.ElementTree as ET

with zipfile.ZipFile('SURAT KEPUTUSAN PEMBAGIAN TUGAS MENGAJAR TK ISLAM PLUS ARJUNA 2026 2027.docx') as z:
    root = ET.fromstring(z.read('word/document.xml'))
    ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    body = root.find('w:body', ns)
    
    print(f"Total elements in body: {len(body)}")
    for i in range(len(body)):
        elem = body[i]
        tag = elem.tag.split('}')[-1]
        text = "".join(elem.itertext()).strip()
        if tag == 'p':
            pPr = elem.find('w:pPr', ns)
            jc = pPr.find('w:jc', ns).attrib['{http://schemas.openxmlformats.org/wordprocessingml/2006/main}val'] if (pPr is not None and pPr.find('w:jc', ns) is not None) else 'default'
            ind = pPr.find('w:ind', ns).attrib if (pPr is not None and pPr.find('w:ind', ns) is not None) else None
            # check pageBreak
            br = elem.findall('.//w:br', ns)
            br_types = [b.attrib.get('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}type', 'line') for b in br]
            print(f"P[{i}] (align={jc}, ind={ind}, br={br_types}): {text}")
        elif tag == 'tbl':
            print(f"TBL[{i}] with {len(elem.findall('.//w:tr', ns))} rows")
            for tr in elem.findall('.//w:tr', ns):
                cells = ["".join(tc.itertext()).strip().replace("\n", " ") for tc in tr.findall('.//w:tc', ns)]
                print("   | " + " | ".join(cells) + " |")
