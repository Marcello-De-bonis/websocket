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

# Install Node.js (LTS)
Write-Host "Installing Node.js v22.14.0 LTS..."
Write-Host "Fonte ufficiale: https://nodejs.org/download"  # Documenta la sorgente
Write-Host 'Comando: Invoke-WebRequest -Uri "https://nodejs.org/dist/v22.14.0/node-v22.14.0-x64.msi" -OutFile "node.msi"'

Invoke-WebRequest -Uri "https://nodejs.org/dist/v22.16.0/node-v22.16.0-x64.msi" -OutFile "node.msi"
Start-Process msiexec.exe -Wait -ArgumentList '/i', 'node.msi', '/quiet', '/norestart'

# Aggiorna NPM all'ultima versione
Write-Host "Updating npm..."
npm install -g npm

# Installa ts-node
Write-Host "Installing ts-node..."
npm install -g ts-node typescript

# Cleanup
Remove-Item $tempDir -Recurse -Force

Write-Host "Installazione completata." -ForegroundColor Green
