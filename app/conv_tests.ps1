$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0

try {
    # 1. 240 A4
    $doc = $word.Documents.Open((Resolve-Path "test_spasi_240_single_A4.docx").Path)
    $doc.SaveAs2((Resolve-Path ".").Path + "\test_spasi_240_A4.pdf", 17)
    $doc.Close([Microsoft.Office.Interop.Word.WdSaveOptions]::wdDoNotSaveChanges)

    # 2. 240 F4
    $doc = $word.Documents.Open((Resolve-Path "test_spasi_240_single_F4.docx").Path)
    $doc.SaveAs2((Resolve-Path ".").Path + "\test_spasi_240_F4.pdf", 17)
    $doc.Close([Microsoft.Office.Interop.Word.WdSaveOptions]::wdDoNotSaveChanges)

    # 3. 260 F4
    $doc = $word.Documents.Open((Resolve-Path "test_spasi_260_proper_F4.docx").Path)
    $doc.SaveAs2((Resolve-Path ".").Path + "\test_spasi_260_F4.pdf", 17)
    $doc.Close([Microsoft.Office.Interop.Word.WdSaveOptions]::wdDoNotSaveChanges)

    Write-Host "PDFs converted successfully"
} finally {
    $word.Quit()
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
}
