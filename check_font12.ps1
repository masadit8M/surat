$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = [Microsoft.Office.Interop.Word.WdAlertLevel]::wdAlertsNone

function Check-Doc($path) {
    Write-Host "Checking $path..."
    $doc = $word.Documents.Open($path)
    $pages = $doc.ComputeStatistics([Microsoft.Office.Interop.Word.WdStatistic]::wdStatisticPages)
    Write-Host "Page Count: $pages"
    
    # Save PDF version for inspection
    $pdfPath = $path.Replace(".docx", ".pdf")
    $doc.SaveAs2($pdfPath, 17)
    Write-Host "Saved PDF: $pdfPath"
    
    $doc.Close([Microsoft.Office.Interop.Word.WdSaveOptions]::wdDoNotSaveChanges)
}

try {
    Check-Doc "C:\Users\lenovo\Downloads\SURAT_KEPUTUSAN_FONT12_A4.docx"
    Check-Doc "C:\Users\lenovo\Downloads\SURAT_KEPUTUSAN_FONT12_F4.docx"
} catch {
    Write-Host "Error: $_"
} finally {
    $word.Quit()
}
