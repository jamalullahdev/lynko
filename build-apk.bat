@echo off
echo ============================================================
echo      Building Lynko Environmental Mobile APK (Android)
echo ============================================================
set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
set ANDROID_HOME=C:\Users\j4jam\AppData\Local\Android\Sdk
cd /d %~dp0android

call gradlew.bat assembleDebug --no-daemon
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Build Failed! Check the error messages above.
    pause
    exit /b %errorlevel%
)

copy /y "%~dp0android\app\build\outputs\apk\debug\app-debug.apk" "%~dp0Lynko-debug.apk" >nul

echo ============================================================
echo  APK Build Successful!
echo  Main APK Copy: c:\lynko\Lynko-debug.apk
echo  Gradle Output: c:\lynko\android\app\build\outputs\apk\debug\app-debug.apk
echo ============================================================
pause

