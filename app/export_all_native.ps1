$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0

try {
    Write-Host "1. Opening A4 DOCX..."
    $doc = $word.Documents.Open('C:\Users\lenovo\Downloads\SURAT KEPUTUSAN_RAPI.docx')
    $pagesA4 = $doc.ComputeStatistics([Microsoft.Office.Interop.Word.WdStatistic]::wdStatisticPages)
    Write-Host "A4 Page Count: $pagesA4"

    Write-Host "2. Saving A4 PDF and DOC..."
    $doc.SaveAs2('C:\Users\lenovo\Downloads\SURAT KEPUTUSAN_RAPI.pdf', 17)
    $doc.SaveAs2('C:\Users\lenovo\Downloads\SURAT KEPUTUSAN_RAPI.doc', 0)
    Write-Host "A4 saved."

    Write-Host "3. Setting PageSetup to Folio (8.5 x 13 in)..."
    $doc.PageSetup.PageWidth = 612 # 8.5 inches * 72
    $doc.PageSetup.PageHeight = 936 # 13.0 inches * 72
    $doc.PageSetup.TopMargin = 42.5 # 15 mm
    $doc.PageSetup.BottomMargin = 42.5 # 15 mm

    $pagesF4 = $doc.ComputeStatistics([Microsoft.Office.Interop.Word.WdStatistic]::wdStatisticPages)
    Write-Host "Folio Page Count: $pagesF4"

    Write-Host "4. Saving Folio DOCX, PDF, and DOC..."
    $doc.SaveAs2('C:\Users\lenovo\Downloads\SURAT KEPUTUSAN_RAPI_FOLIO.docx', 16)
    $doc.SaveAs2('C:\Users\lenovo\Downloads\SURAT KEPUTUSAN_RAPI_FOLIO.pdf', 17)
    $doc.SaveAs2('C:\Users\lenovo\Downloads\SURAT KEPUTUSAN_RAPI_FOLIO.doc', 0)
    Write-Host "Folio files saved successfully!"

    $doc.Close([Microsoft.Office.Interop.Word.WdSaveOptions]::wdDoNotSaveChanges)
} catch {
    Write-Host "Catch Error: " $_.Exception.Message
} finally {
    $word.Quit()
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
    Write-Host "Word application released."
}
