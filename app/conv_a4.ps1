$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0
try {
    $doc = $word.Documents.Open('C:\Users\lenovo\Downloads\SURAT KEPUTUSAN_RAPI.docx')
    $pages = $doc.ComputeStatistics([Microsoft.Office.Interop.Word.WdStatistic]::wdStatisticPages)
    Write-Host "A4 pages: $pages"
    $doc.SaveAs2('C:\Users\lenovo\Downloads\SURAT KEPUTUSAN_RAPI.pdf', 17)
    $doc.SaveAs2('C:\Users\lenovo\Downloads\SURAT KEPUTUSAN_RAPI.doc', 0)
    $doc.Close()
    Write-Host "A4 successfully converted."
} finally {
    $word.Quit()
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
}
