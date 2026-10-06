$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = [Microsoft.Office.Interop.Word.WdAlertLevel]::wdAlertsNone

function Check-And-Save($docxPath, $docPath, $pdfPath) {
    Write-Host "Opening $docxPath in Microsoft Word..."
    $doc = $word.Documents.Open($docxPath)
    $pages = $doc.ComputeStatistics([Microsoft.Office.Interop.Word.WdStatistic]::wdStatisticPages)
    $paragraphs = $doc.Paragraphs.Count
    Write-Host "-> Total Pages: $pages"
    Write-Host "-> Total Paragraphs: $paragraphs"
    
    # Save .doc
    $doc.SaveAs2($docPath, 0)
    Write-Host "-> Saved .doc: $docPath"
    
    # Save .pdf
    $doc.SaveAs2($pdfPath, 17)
    Write-Host "-> Saved .pdf: $pdfPath"
    
    $doc.Close([Microsoft.Office.Interop.Word.WdSaveOptions]::wdDoNotSaveChanges)
}

try {
    Write-Host "=== VERIFYING A4 (STRICT FONT 12PT) ==="
    Check-And-Save "C:\Users\lenovo\Downloads\SURAT KEPUTUSAN_RAPI.docx" "C:\Users\lenovo\Downloads\SURAT KEPUTUSAN_RAPI.doc" "C:\Users\lenovo\Downloads\SURAT KEPUTUSAN_RAPI.pdf"
    
    Write-Host "`n=== VERIFYING FOLIO / F4 (STRICT FONT 12PT) ==="
    Check-And-Save "C:\Users\lenovo\Downloads\SURAT KEPUTUSAN_RAPI_FOLIO.docx" "C:\Users\lenovo\Downloads\SURAT KEPUTUSAN_RAPI_FOLIO.doc" "C:\Users\lenovo\Downloads\SURAT KEPUTUSAN_RAPI_FOLIO.pdf"
} catch {
    Write-Host "Error: $_"
} finally {
    $word.Quit()
}
