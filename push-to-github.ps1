# Script pour pousser vers GitHub facilement
# Usage: .\push-to-github.ps1 "message de commit"

param(
    [string]$commitMessage = "Update"
)

Write-Host "=== Configuration Git ===" -ForegroundColor Cyan
git remote -v
Write-Host ""

Write-Host "=== Statut Git ===" -ForegroundColor Cyan
git status --short
Write-Host ""

Write-Host "=== Ajout de tous les fichiers ===" -ForegroundColor Cyan
git add -A
Write-Host "Fichiers ajoutés" -ForegroundColor Green
Write-Host ""

Write-Host "=== Commit ===" -ForegroundColor Cyan
git commit -m $commitMessage
if ($LASTEXITCODE -eq 0) {
    Write-Host "Commit réussi" -ForegroundColor Green
} else {
    Write-Host "Erreur lors du commit" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "=== Push vers GitHub ===" -ForegroundColor Cyan
git push origin main
if ($LASTEXITCODE -eq 0) {
    Write-Host "Push réussi !" -ForegroundColor Green
} else {
    Write-Host "Erreur lors du push" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "=== Terminé ! ===" -ForegroundColor Green
