$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0
try {
    Write-Host "A. Opening test_f4_safe..."
    $doc = $word.Documents.Open('C:\Users\lenovo\Downloads\test_f4_safe.docx')
    Write-Host "B. Opened. Computing pages..."
    $pages = $doc.ComputeStatistics([Microsoft.Office.Interop.Word.WdStatistic]::wdStatisticPages)
    Write-Host "C. Pages: $pages"
    Write-Host "D. Saving PDF..."
    $doc.SaveAs2('C:\Users\lenovo\Downloads\SURAT KEPUTUSAN_RAPI_FOLIO.pdf', 17)
    Write-Host "E. Saved PDF. Saving DOC..."
    $doc.SaveAs2('C:\Users\lenovo\Downloads\SURAT KEPUTUSAN_RAPI_FOLIO.doc', 0)
    Write-Host "F. Saved DOC. Closing..."
    $doc.Close()
    Write-Host "G. Finished successfully!"
} catch {
    Write-Host "Error: " $_.Exception.Message
} finally {
    $word.Quit()
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
}
