# Complete Clean Restart Script for CityCare
# Run this in PowerShell: .\COMPLETE_RESTART.ps1

Write-Host "🛑 Step 1: Stopping all Node processes..." -ForegroundColor Yellow
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

Write-Host "🗑️ Step 2: Deleting .next cache..." -ForegroundColor Yellow
Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "🗑️ Step 3: Deleting node_modules cache..." -ForegroundColor Yellow
Remove-Item -Path "node_modules\.cache" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "✅ Cache cleared!" -ForegroundColor Green
Write-Host ""
Write-Host "Now run: npm run dev" -ForegroundColor Cyan
Write-Host "Then press Ctrl+Shift+R in your browser" -ForegroundColor Cyan
