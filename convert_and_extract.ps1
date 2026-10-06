$sourceDoc = "C:\Users\lenovo\Downloads\SURAT KEPUTUSAN.doc"
$destDocx = "C:\Users\lenovo\Downloads\SURAT KEPUTUSAN_converted.docx"
$textOut = "C:\Users\lenovo\Downloads\SURAT KEPUTUSAN_extracted.txt"

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = [Microsoft.Office.Interop.Word.WdAlertLevel]::wdAlertsNone

try {
    Write-Host "Opening $sourceDoc..."
    $doc = $word.Documents.Open($sourceDoc)
    
    # Extract text
    $text = $doc.Content.Text
    $text | Out-File -FilePath $textOut -Encoding UTF8
    Write-Host "Text extracted to $textOut (Length: $($text.Length))"
    
    # Save as docx (Format 16 = wdFormatXMLDocument / .docx)
    $doc.SaveAs2($destDocx, 16)
    Write-Host "Saved as docx to $destDocx"
    
    # Print page count and basic info
    $pageCount = $doc.ComputeStatistics([Microsoft.Office.Interop.Word.WdStatistic]::wdStatisticPages)
    Write-Host "Page Count: $pageCount"
    Write-Host "Paragraph Count: $($doc.Paragraphs.Count)"
    Write-Host "Table Count: $($doc.Tables.Count)"
    
    $doc.Close([Microsoft.Office.Interop.Word.WdSaveOptions]::wdDoNotSaveChanges)
} catch {
    Write-Host "Error: $_"
} finally {
    $word.Quit()
}
