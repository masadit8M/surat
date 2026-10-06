$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0
try {
    $doc = $word.Documents.Open('C:\Users\lenovo\Downloads\SURAT KEPUTUSAN.doc')
    $pages = $doc.ComputeStatistics([Microsoft.Office.Interop.Word.WdStatistic]::wdStatisticPages)
    Write-Host "Original doc pages: $pages"
    Write-Host "PageSetup Width:" $doc.PageSetup.PageWidth "Height:" $doc.PageSetup.PageHeight
    Write-Host "TopMargin:" $doc.PageSetup.TopMargin "BottomMargin:" $doc.PageSetup.BottomMargin
    Write-Host "LeftMargin:" $doc.PageSetup.LeftMargin "RightMargin:" $doc.PageSetup.RightMargin
    $doc.Close()
} finally {
    $word.Quit()
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
}
