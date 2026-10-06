$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0
try {
    Write-Host "1. Opening..."
    $doc = $word.Documents.Open('C:\Users\lenovo\Downloads\SURAT KEPUTUSAN_RAPI_FOLIO.docx')
    Write-Host "2. Opened."
    $pages = $doc.ComputeStatistics([Microsoft.Office.Interop.Word.WdStatistic]::wdStatisticPages)
    Write-Host "3. Pages: $pages"
    $doc.SaveAs2('C:\Users\lenovo\Downloads\SURAT KEPUTUSAN_RAPI_FOLIO.pdf', 17)
    Write-Host "4. Saved PDF."
    $doc.SaveAs2('C:\Users\lenovo\Downloads\SURAT KEPUTUSAN_RAPI_FOLIO.doc', 0)
    Write-Host "5. Saved DOC."
    $doc.Close()
    Write-Host "6. Done."
} catch {
    Write-Host "Catch: " $_.Exception.Message
} finally {
    $word.Quit()
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
}
