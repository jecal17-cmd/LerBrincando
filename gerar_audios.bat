@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo === Ler Brincando: gerador do Banco de Audio v1.2 (vozes neurais) ===
where python >nul 2>nul || (echo Instale o Python 3.10+ em https://www.python.org/downloads/ marcando "Add python.exe to PATH". & pause & exit /b 1)
if not exist .venv (python -m venv .venv)
call .venv\Scripts\activate.bat
python -m pip install --upgrade pip >nul
python -m pip install --upgrade edge-tts numpy soundfile librosa pyloudnorm
echo.
echo 1) Gerando 16 sons de AMOSTRA em audio_amostra\ (escute: silabas "ve", "nha", "que" e fonemas)...
python gerar_audios.py --amostra %*
echo.
echo Se voce ja tinha um banco da versao anterior, ele sera ATUALIZADO automaticamente.
choice /M "Gostou? Gerar/atualizar o banco completo agora (10 a 25 min)"
if errorlevel 2 goto fim
python gerar_audios.py %*
echo.
echo Veja audio\revisar.txt: lista dos sons que merecem uma escuta.
:fim
pause
