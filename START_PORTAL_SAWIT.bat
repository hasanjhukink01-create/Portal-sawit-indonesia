@echo off
title Menjalankan Portal Sawit
color 0A

echo =========================================
echo       MEMULAI WEB PORTAL SAWIT
echo =========================================
echo.

:: Pindah ke direktori tempat file .bat ini berada
cd /d "%~dp0"

:: Jalankan Vite server di jendela baru
echo Menjalankan server lokal (Vite)...
start "Vite Server Portal Sawit" cmd /k "npm run dev"

:: Tunggu beberapa detik agar server Vite selesai booting
echo.
echo Menunggu server siap...
timeout /t 4 /nobreak >nul

:: Buka Chrome ke alamat localhost
echo.
echo Membuka browser (Google Chrome)...
start chrome "http://localhost:5173" || start "" "http://localhost:5173"

echo.
echo Selesai! Jendela ini akan tertutup otomatis.
timeout /t 2 >nul
exit
