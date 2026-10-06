$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0
try {
    $path = (Resolve-Path "C:\Users\lenovo\Downloads\SURAT KEPUTUSAN_RAPI_FOLIO.docx").Path
    $pdfPath = "C:\Users\lenovo\Downloads\SURAT KEPUTUSAN_RAPI_FOLIO.pdf"
    $docPath = "C:\Users\lenovo\Downloads\SURAT KEPUTUSAN_RAPI_FOLIO.doc"
    $doc = $word.Documents.Open($path, $false, $false, $false)
    $pages = $doc.ComputeStatistics([Microsoft.Office.Interop.Word.WdStatistic]::wdStatisticPages)
    Write-Host "Folio Page Count:" $pages
    $doc.SaveAs2($pdfPath, 17)
    $doc.SaveAs2($docPath, 0)
    $doc.Close()
    Write-Host "Folio exported successfully"
} finally {
    $word.Quit()
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
}
