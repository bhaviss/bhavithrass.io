@echo off
echo ========================================
echo Portfolio Deployment Script
echo ========================================
echo.

cd /d "%~dp0"

echo Current directory: %CD%
echo.

echo Checking git status...
git status
echo.

echo ========================================
echo Adding all changes to git...
git add .
echo.

echo ========================================
echo Creating commit...
git commit -m "Major improvements: fixed video playback, redesigned projects layout, updated creative section, added smooth scroll transitions"
echo.

echo ========================================
echo Pushing to GitHub...
git push origin main
echo.

echo ========================================
echo Deployment complete!
echo.
echo Your changes have been pushed to GitHub.
echo Vercel will automatically detect and deploy them.
echo.
echo Check your deployment at: https://vercel.com/dashboard
echo Your website: https://www.bhaviss.com
echo.
echo ========================================
pause
