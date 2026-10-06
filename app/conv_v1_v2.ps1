$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0

try {
    $doc = $word.Documents.Open((Resolve-Path "test_a4_v1_line240_compactHead.docx").Path)
    $doc.SaveAs2((Resolve-Path ".").Path + "\v1_line240.pdf", 17)
    $doc.Close([Microsoft.Office.Interop.Word.WdSaveOptions]::wdDoNotSaveChanges)

    $doc = $word.Documents.Open((Resolve-Path "test_a4_v2_line230_proper.docx").Path)
    $doc.SaveAs2((Resolve-Path ".").Path + "\v2_line230.pdf", 17)
    $doc.Close([Microsoft.Office.Interop.Word.WdSaveOptions]::wdDoNotSaveChanges)
} finally {
    $word.Quit()
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
}
