$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0

$files = @(
    "test_a4_v1_line240_compactHead.docx",
    "test_a4_v2_line230_proper.docx",
    "test_a4_v3_line225_proper.docx"
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
