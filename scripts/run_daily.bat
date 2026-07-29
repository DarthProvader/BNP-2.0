@echo off
REM Daily pipeline via Cursor SDK (collect -> inbox -> local agents -> social)
REM Requires CURSOR_API_KEY in scripts\.env (see scripts\prompts\README.md)

cd /d C:\PV\BNP-2.0

call venv\Scripts\activate.bat
cd scripts
python run_cursor_daily.py
set PIPELINE_EXIT=%ERRORLEVEL%
cd ..

exit /b %PIPELINE_EXIT%
