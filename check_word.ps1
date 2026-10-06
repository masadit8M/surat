try {
    $w = New-Object -ComObject Word.Application
    Write-Host "Word COM available, Version: $($w.Version)"
    $w.Quit()
} catch {
    Write-Host "Word COM failed: $_"
}
