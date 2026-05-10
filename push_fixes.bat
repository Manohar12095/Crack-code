@echo off
cd /d "%~dp0"
git add .
git commit -m "fix: resolve Next.js 16/TS build errors"
git push origin main
