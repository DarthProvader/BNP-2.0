@echo off
REM Daily pipeline runner for Windows Task Scheduler
REM Runs collectors, generates article, commits and pushes to GitHub

cd /d C:\PV\BNP-2.0

REM Activate venv and run pipeline
call venv\Scripts\activate.bat
cd scripts
python run_pipeline.py
set PIPELINE_EXIT=%ERRORLEVEL%
cd ..

REM Pull remote changes first to avoid push rejection
git pull origin main --no-edit
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] git pull failed, skipping commit/push.
    exit /b 1
)

REM Commit and push if there are new articles
git add content\articles\
git diff --staged --quiet
if %ERRORLEVEL% NEQ 0 (
    git commit -m "Daily article %date:~-4%-%date:~-7,2%-%date:~-10,2%"
    git push
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] git push failed.
        exit /b 1
    )
    echo [OK] New articles committed and pushed.
) else (
    echo [INFO] No new content to commit.
)

exit /b %PIPELINE_EXIT%
