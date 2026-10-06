import zipfile
import xml.etree.ElementTree as ET
import os

docx_path = r'SURAT KEPUTUSAN PEMBAGIAN TUGAS MENGAJAR TK ISLAM PLUS ARJUNA 2026 2027.docx'
with zipfile.ZipFile(docx_path, 'r') as z:
    # Save the logo
    os.makedirs('extracted_assets', exist_ok=True)
    if 'word/media/image1.jpeg' in z.namelist():
        with open('extracted_assets/logo.jpeg', 'wb') as f:
            f.write(z.read('word/media/image1.jpeg'))
        print("Logo extracted to extracted_assets/logo.jpeg")
    
    # Analyze Header 1
    print("\n--- HEADER 1 ANALYSIS ---")
    if 'word/header1.xml' in z.namelist():
        root = ET.fromstring(z.read('word/header1.xml'))
        ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        for p in root.findall('.//w:p', ns):
            text = "".join(p.itertext()).strip()
            pPr = p.find('w:pPr', ns)
            jc = pPr.find('w:jc', ns).attrib if (pPr is not None and pPr.find('w:jc', ns) is not None) else None
            pBdr = pPr.find('w:pBdr', ns) if pPr is not None else None
            border_info = [c.attrib for c in pBdr] if pBdr is not None else None
            
            # runs info
            runs_info = []
            for r in p.findall('.//w:r', ns):
                t = "".join(r.itertext())
                if not t: continue
                rPr = r.find('w:rPr', ns)
                font = rPr.find('w:rFonts', ns).attrib.get('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}ascii') if (rPr is not None and rPr.find('w:rFonts', ns) is not None) else None
                sz = rPr.find('w:sz', ns).attrib.get('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}val') if (rPr is not None and rPr.find('w:sz', ns) is not None) else None
                b = rPr.find('w:b', ns) is not None if rPr is not None else False
                runs_info.append((t, font, sz, b))
            print(f"P Text: '{text}' | Align: {jc} | Borders: {border_info}")
            for r_t, r_font, r_sz, r_b in runs_info:
                print(f"   Run: '{r_t}' | Font: {r_font} | Size: {r_sz} (pt: {int(r_sz)/2 if r_sz else '?'}) | Bold: {r_b}")

    # Analyze Document Body (margins, sections, paragraphs, tables)
    print("\n--- DOCUMENT BODY ANALYSIS ---")
    root = ET.fromstring(z.read('word/document.xml'))
    ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    for sect in root.findall('.//w:sectPr', ns):
        pgSz = sect.find('w:pgSz', ns)
        pgMar = sect.find('w:pgMar', ns)
        print("Page Size:", pgSz.attrib if pgSz is not None else None)
        print("Page Margins:", pgMar.attrib if pgMar is not None else None)

    print("\n--- ALL PARAGRAPHS & RUNS IN DOCUMENT ---")
    body = root.find('w:body', ns)
    for idx, elem in enumerate(body):
        tag = elem.tag.split('}')[-1]
        if tag == 'p':
            p_text = "".join(elem.itertext()).strip()
            if not p_text: continue
            pPr = elem.find('w:pPr', ns)
            jc = pPr.find('w:jc', ns).attrib if (pPr is not None and pPr.find('w:jc', ns) is not None) else None
            # get first run font & size
            rPr = elem.find('.//w:r/w:rPr', ns)
            font = rPr.find('w:rFonts', ns).attrib.get('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}ascii') if (rPr is not None and rPr.find('w:rFonts', ns) is not None) else None
            sz = rPr.find('w:sz', ns).attrib.get('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}val') if (rPr is not None and rPr.find('w:sz', ns) is not None) else None
            b = rPr.find('w:b', ns) is not None if rPr is not None else False
            print(f"[{idx}] P: {p_text[:80]}... | Align: {jc} | Font: {font} | Size: {sz} (pt {int(sz)/2 if sz else '?'}) | Bold: {b}")
        elif tag == 'tbl':
            print(f"[{idx}] --- TABLE ---")
            for tr in elem.findall('.//w:tr', ns):
                cells = []
                for tc in tr.findall('.//w:tc', ns):
                    cells.append("".join(tc.itertext()).strip().replace("\n", " "))
                print("   ROW:", " | ".join(cells))
