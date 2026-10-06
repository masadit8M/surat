$word = New-Object -ComObject Word.Application
$word.Visible = $false
try {
    $docPath = (Resolve-Path "test_kop.docx").Path
    $pdfPath = [System.IO.Path]::ChangeExtension($docPath, "pdf")
    $doc = $word.Documents.Open($docPath)
    $doc.SaveAs2($pdfPath, 17)
    $doc.Close()
} finally {
    $word.Quit()
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
}
