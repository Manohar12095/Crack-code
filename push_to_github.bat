@echo off
cd /d "%~dp0"
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/Manohar12095/Crack-code.git
git push -u origin main
