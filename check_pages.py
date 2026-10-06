import fitz

for fname in ['SURAT_KEPUTUSAN_FONT12_A4.pdf', 'SURAT_KEPUTUSAN_FONT12_F4.pdf']:
    doc = fitz.open(rf'C:\Users\lenovo\Downloads\{fname}')
    print(f'=== {fname} (Total Pages: {len(doc)}) ===')
    for i, p in enumerate(doc):
        text = p.get_text()
        lines = [l.strip() for l in text.splitlines() if l.strip()]
        first_line = lines[0] if lines else 'EMPTY'
        last_line = lines[-1] if lines else 'EMPTY'
        print(f'  Page {i+1} ({len(lines)} lines): start="{first_line[:40]}" end="{last_line[:40]}"')
