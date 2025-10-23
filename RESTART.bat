@echo off
echo ============================================
echo  🔄 Nettoyage et Redemarrage Next.js
echo ============================================
echo.

echo [1/3] Arret du serveur...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo [2/3] Nettoyage du cache Next.js...
if exist .next rmdir /s /q .next
echo Cache nettoye!

echo [3/3] Redemarrage du serveur...
echo.
npm run dev

pause

