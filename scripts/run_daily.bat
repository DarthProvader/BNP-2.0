@echo off
REM Daily pipeline via Cursor Automations (collect → inbox → webhooks → social)
REM Requires webhook URL/KEY vars in scripts\.env (see scripts\automations\README.md)

cd /d C:\PV\BNP-2.0

call venv\Scripts\activate.bat
cd scripts
python run_cursor_daily.py
set PIPELINE_EXIT=%ERRORLEVEL%
cd ..

exit /b %PIPELINE_EXIT%
