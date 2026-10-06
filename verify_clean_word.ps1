$docxPath = "C:\Users\lenovo\Downloads\SURAT KEPUTUSAN_RAPI.docx"
$docLegacyPath = "C:\Users\lenovo\Downloads\SURAT KEPUTUSAN_RAPI.doc"
$pdfPath = "C:\Users\lenovo\Downloads\SURAT KEPUTUSAN_RAPI.pdf"

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = [Microsoft.Office.Interop.Word.WdAlertLevel]::wdAlertsNone

try {
    Write-Host "Opening $docxPath in Microsoft Word..."
    $doc = $word.Documents.Open($docxPath)
    
    $pages = $doc.ComputeStatistics([Microsoft.Office.Interop.Word.WdStatistic]::wdStatisticPages)
    $paragraphs = $doc.Paragraphs.Count
    $tables = $doc.Tables.Count
    
    Write-Host "Verification Results:"
    Write-Host "- Total Pages: $pages"
    Write-Host "- Total Paragraphs: $paragraphs"
    Write-Host "- Total Tables: $tables"
    
    # Save as .doc (Format 0 = wdFormatDocument)
    $doc.SaveAs2($docLegacyPath, 0)
    Write-Host "Saved legacy Word (.doc) to $docLegacyPath"
    
    # Save as PDF (Format 17 = wdFormatPDF)
    $doc.SaveAs2($pdfPath, 17)
    Write-Host "Saved PDF to $pdfPath"
    
    $doc.Close([Microsoft.Office.Interop.Word.WdSaveOptions]::wdDoNotSaveChanges)
} catch {
    Write-Host "Error: $_"
} finally {
    $word.Quit()
}
