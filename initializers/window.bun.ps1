# Check Admin Rights
if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "Rilancia come Amministratore." -ForegroundColor Red
    exit
}

# Set Execution Policy (solo se necessario)
Set-ExecutionPolicy Bypass -Scope Process -Force

# Directory temporanea
$tempDir = "$env:TEMP\node_stack_install"
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
Set-Location $tempDir

# Installa Bun (via script curl)
Write-Host "Installing Bun..."
Write-Host "Fonte ufficiale: https://bun.sh"
Write-Host 'Comando equivalente: powershell -c "irm bun.sh/install.ps1 | iex"'
Invoke-WebRequest https://bun.sh/install.ps1 -UseBasicParsing | Invoke-Expression

# Aggiungi Bun al PATH utente se non presente
$bunBinPath = "$env:USERPROFILE\.bun\bin"
$envPath = [Environment]::GetEnvironmentVariable("Path", [EnvironmentVariableTarget]::User)
if (-not $envPath.Split(";") -contains $bunBinPath) {
    [Environment]::SetEnvironmentVariable("Path", "$envPath;$bunBinPath", [EnvironmentVariableTarget]::User)
    Write-Host "✅ PATH aggiornato (riavvia il terminale per applicare)." -ForegroundColor Yellow
} else {
    Write-Host "ℹ️ PATH già configurato correttamente."
}


# Cleanup
Remove-Item $tempDir -Recurse -Force

Write-Host "✅ Installazione completata." -ForegroundColor Green
