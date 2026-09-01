@echo off
REM Daily pipeline via Codex CLI in WSL (collect -> inbox -> agents -> social)
REM Cursor fallback remains available as scripts\run_cursor_daily.py.

cd /d C:\PV\BNP-2.0

call venv\Scripts\activate.bat
cd scripts
python run_codex_daily.py
set PIPELINE_EXIT=%ERRORLEVEL%
cd ..

exit /b %PIPELINE_EXIT%
