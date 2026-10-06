$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0
try {
    $doc = $word.Documents.Open('C:\Users\lenovo\Downloads\SURAT KEPUTUSAN_RAPI_FOLIO.docx')
    $pages = $doc.ComputeStatistics([Microsoft.Office.Interop.Word.WdStatistic]::wdStatisticPages)
    Write-Host "Folio pages:" $pages
    $doc.SaveAs2('C:\Users\lenovo\Downloads\SURAT KEPUTUSAN_RAPI_FOLIO.pdf', 17)
    $doc.SaveAs2('C:\Users\lenovo\Downloads\SURAT KEPUTUSAN_RAPI_FOLIO.doc', 0)
    $doc.Close()
    Write-Host "Folio exported successfully"
} finally {
    $word.Quit()
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
}
