@echo off
REM Daily pipeline via OpenCode CLI in WSL (collect -> inbox -> agents -> social)
REM Codex and Cursor fallbacks remain available as scripts\run_codex_daily.py
REM and scripts\run_cursor_daily.py.

cd /d C:\PV\BNP-2.0

call venv\Scripts\activate.bat
cd scripts
python run_opencode_daily.py
set PIPELINE_EXIT=%ERRORLEVEL%
cd ..

exit /b %PIPELINE_EXIT%
