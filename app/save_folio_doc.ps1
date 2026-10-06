$word = New-Object -ComObject Word.Application
$word.Visible = $false
try {
    $doc = $word.Documents.Open("C:\Users\lenovo\Downloads\SURAT KEPUTUSAN_RAPI_FOLIO.docx")
    $doc.SaveAs2("C:\Users\lenovo\Downloads\SURAT KEPUTUSAN_RAPI_FOLIO.doc", 0)
    $doc.Close()
    Write-Host "Saved Folio DOC successfully"
} finally {
    $word.Quit()
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
}
