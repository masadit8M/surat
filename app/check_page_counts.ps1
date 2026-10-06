$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0

$files = @(
    "test_spasi_240_single_A4.docx",
    "test_spasi_240_single_F4.docx",
    "test_spasi_260_proper_A4.docx",
    "test_spasi_260_proper_F4.docx",
    "test_spasi_276_115_A4.docx",
    "test_spasi_276_115_F4.docx"
)

try {
    foreach ($f in $files) {
        $p = (Resolve-Path $f).Path
        $doc = $word.Documents.Open($p)
        $pages = $doc.ComputeStatistics([Microsoft.Office.Interop.Word.WdStatistic]::wdStatisticPages)
        Write-Host "$f => Pages: $pages"
        $doc.Close([Microsoft.Office.Interop.Word.WdSaveOptions]::wdDoNotSaveChanges)
    }
} finally {
    $word.Quit()
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
}
