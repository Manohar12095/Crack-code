@echo off
cd /d "%~dp0"
git add .
git commit -m "feat: optimize responsiveness, performance and add sound effects"
git push origin main
