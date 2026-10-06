import zipfile

with zipfile.ZipFile('C:/Users/lenovo/Downloads/SURAT KEPUTUSAN_RAPI_FOLIO.docx', 'r') as zin:
    with zipfile.ZipFile('C:/Users/lenovo/Downloads/test_f4_safe.docx', 'w') as zout:
        for item in zin.infolist():
            buf = zin.read(item.filename)
            if item.filename == 'word/document.xml':
                xml = buf.decode('utf-8')
                xml = xml.replace('w:top="680"', 'w:top="850"').replace('w:bottom="680"', 'w:bottom="850"')
                buf = xml.encode('utf-8')
            zout.writestr(item, buf)
print('test_f4_safe.docx created')
