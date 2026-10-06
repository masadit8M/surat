$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0

Write-Host "Opening Folio docx..."
try {
    $doc = $word.Documents.Open("C:\Users\lenovo\Downloads\SURAT KEPUTUSAN_RAPI_FOLIO.docx", $false, $true) # read-only
    Write-Host "Opened successfully."
    $pages = $doc.ComputeStatistics([Microsoft.Office.Interop.Word.WdStatistic]::wdStatisticPages)
    Write-Host "Folio pages:" $pages
    Write-Host "Saving PDF..."
    $doc.SaveAs2("C:\Users\lenovo\Downloads\SURAT KEPUTUSAN_RAPI_FOLIO.pdf", 17)
    Write-Host "PDF saved."
    Write-Host "Saving DOC..."
    $doc.SaveAs2("C:\Users\lenovo\Downloads\SURAT KEPUTUSAN_RAPI_FOLIO.doc", 0)
    Write-Host "DOC saved."
    $doc.Close([Microsoft.Office.Interop.Word.WdSaveOptions]::wdDoNotSaveChanges)
} catch {
    Write-Host "Error: " $_.Exception.Message
} finally {
    $word.Quit()
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
    Write-Host "Done."
}
