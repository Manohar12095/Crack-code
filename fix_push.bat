@echo off
cd /d "%~dp0"
git add .
git commit -m "fix: restore handleQuizSubmit function header"
git push origin main
