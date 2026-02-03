# Run as Administrator: allows inbound TCP port 3000 for the Face Attendance backend
# Right-click PowerShell -> Run as administrator, then: .\allow-firewall-port-3000.ps1

$ruleName = "Face Attendance Backend (Port 3000)"
$port = 3000

if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "Run this script as Administrator (right-click PowerShell -> Run as administrator)" -ForegroundColor Yellow
    exit 1
}

$existing = Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue
if ($existing) {
    Write-Host "Rule '$ruleName' already exists. Removing old rule..."
    Remove-NetFirewallRule -DisplayName $ruleName
}

New-NetFirewallRule -DisplayName $ruleName -Direction Inbound -Protocol TCP -LocalPort $port -Action Allow
Write-Host "Done. Inbound TCP port $port is now allowed. Try the app from your phone again." -ForegroundColor Green
