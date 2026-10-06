$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0
try {
    $docF4 = $word.Documents.Open("C:\Users\lenovo\Downloads\SURAT KEPUTUSAN_RAPI_FOLIO.docx")
    $pagesF4 = $docF4.ComputeStatistics([Microsoft.Office.Interop.Word.WdStatistic]::wdStatisticPages)
    Write-Host "Folio Page Count:" $pagesF4
    $docF4.SaveAs2("C:\Users\lenovo\Downloads\SURAT KEPUTUSAN_RAPI_FOLIO.pdf", 17)
    $docF4.Close()
    Write-Host "Saved Folio PDF successfully"
} finally {
    $word.Quit()
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
}
