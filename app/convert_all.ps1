$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0 # wdAlertsNone
try {
    # 1. A4
    $docA4 = $word.Documents.Open("C:\Users\lenovo\Downloads\SURAT KEPUTUSAN_RAPI.docx")
    $pagesA4 = $docA4.ComputeStatistics([Microsoft.Office.Interop.Word.WdStatistic]::wdStatisticPages)
    Write-Host "A4 Page Count:" $pagesA4
    $docA4.SaveAs2("C:\Users\lenovo\Downloads\SURAT KEPUTUSAN_RAPI.pdf", 17)
    $docA4.SaveAs2("C:\Users\lenovo\Downloads\SURAT KEPUTUSAN_RAPI.doc", 0)
    $docA4.Close()

    # 2. Folio
    $docF4 = $word.Documents.Open("C:\Users\lenovo\Downloads\SURAT KEPUTUSAN_RAPI_FOLIO.docx")
    $pagesF4 = $docF4.ComputeStatistics([Microsoft.Office.Interop.Word.WdStatistic]::wdStatisticPages)
    Write-Host "Folio Page Count:" $pagesF4
    $docF4.SaveAs2("C:\Users\lenovo\Downloads\SURAT KEPUTUSAN_RAPI_FOLIO.pdf", 17)
    $docF4.SaveAs2("C:\Users\lenovo\Downloads\SURAT KEPUTUSAN_RAPI_FOLIO.doc", 0)
    $docF4.Close()
} finally {
    $word.Quit()
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
}
