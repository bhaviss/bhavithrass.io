@echo off
echo ========================================
echo   Portfolio Media File Copy Helper
echo ========================================
echo.
echo This script will help you copy your project media files
echo to the correct locations in your portfolio.
echo.
echo Press any key to start, or Ctrl+C to cancel...
pause > nul

echo.
echo Creating directories...
if not exist "images\projects" mkdir "images\projects"

echo.
echo ========================================
echo   Copying Space Debris Tracking Video
echo ========================================
set SOURCE_VIDEO=C:\Users\bhavi\Downloads\tracking_result (1).mp4
set DEST_VIDEO=images\projects\space-debris-tracking.mp4

if exist "%SOURCE_VIDEO%" (
    echo Found: %SOURCE_VIDEO%
    echo Copying to: %DEST_VIDEO%
    copy "%SOURCE_VIDEO%" "%DEST_VIDEO%"
    echo Done!
) else (
    echo WARNING: Source file not found: %SOURCE_VIDEO%
    echo Please copy this file manually.
)

echo.
echo ========================================
echo   Next Steps (Manual):
echo ========================================
echo.
echo 1. Snow Detection Images:
echo    - Navigate to: C:\Users\bhavi\Downloads\IT597 Project\snow_detection_webapp
echo    - Select 1-2 best detection images
echo    - Copy to: %CD%\images\projects\
echo    - Rename to: snow-detection-1.jpg, snow-detection-2.jpg
echo.
echo 2. Geo QR Attendance:
echo    - Open: C:\Users\bhavi\Downloads\Project_Report_ITM_Final.docx
echo    - Save embedded screenshots
echo    - Copy to: %CD%\images\projects\geo-qr-attendance.jpg
echo.
echo 3. Chatbot Screenshot:
echo    - Run: python "C:\Users\bhavi\Downloads\Final chatbot.py"
echo    - Take screenshot (Win + Shift + S)
echo    - Save to: %CD%\images\projects\chatbot-gui.jpg
echo.
echo 4. Create Video Thumbnail:
echo    - Open: %CD%\images\projects\space-debris-tracking.mp4
echo    - Pause at best frame
echo    - Take screenshot
echo    - Save as: %CD%\images\projects\space-debris-thumb.jpg
echo.
echo ========================================
echo   All automatic steps completed!
echo ========================================
echo.
echo Please complete the manual steps above, then:
echo 1. Edit index.html and replace placeholders (see PROJECT_MEDIA_GUIDE.md)
echo 2. Test your portfolio by opening index.html in a browser
echo 3. Deploy to Vercel/GitHub when ready
echo.
echo Press any key to exit...
pause > nul
