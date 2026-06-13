<#
  set-photo.ps1  —  installs your portrait into the site.

  USAGE (from the project folder):
    # Option A: point it at your photo
    powershell -ExecutionPolicy Bypass -File scripts\set-photo.ps1 -Path "C:\Users\Acer\Downloads\me.jpg"

    # Option B: no path — grabs the NEWEST image in your Downloads folder
    powershell -ExecutionPolicy Bypass -File scripts\set-photo.ps1

  It copies the image to public\profile.jpg. Refresh the site and your
  photo appears in the navbar avatar, footer avatar, and the 3D hologram.
#>
param([string]$Path)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$dest = Join-Path $PSScriptRoot "..\public\profile.jpg"

if (-not $Path) {
  $dl = Join-Path $env:USERPROFILE "Downloads"
  $newest = Get-ChildItem -Path $dl -Include *.jpg, *.jpeg, *.png -Recurse -ErrorAction SilentlyContinue |
    Sort-Object LastWriteTime -Descending | Select-Object -First 1
  if (-not $newest) { Write-Host "No image found in Downloads. Pass -Path to your photo." -ForegroundColor Red; exit 1 }
  $Path = $newest.FullName
  Write-Host "No -Path given; using newest Downloads image:`n  $Path" -ForegroundColor Yellow
}

if (-not (Test-Path $Path)) { Write-Host "File not found: $Path" -ForegroundColor Red; exit 1 }

$img = [System.Drawing.Image]::FromFile($Path)
$dims = "$($img.Width)x$($img.Height)"
$img.Dispose()

Copy-Item -Path $Path -Destination $dest -Force
Write-Host "`n  Installed photo ($dims) -> public\profile.jpg" -ForegroundColor Green
Write-Host "  Refresh the site (Ctrl+Shift+R) to see your hologram.`n" -ForegroundColor Green
