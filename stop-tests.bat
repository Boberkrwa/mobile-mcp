@echo off
echo 🛑 Stopping all mobile testing processes...

REM Kill any node processes (Jest, Appium, etc.)
echo Killing Node.js processes...
taskkill /F /IM node.exe 2>nul || echo No Node.js processes found

REM Kill any Java processes (Android/Appium related)
echo Killing Java processes...
taskkill /F /IM java.exe 2>nul || echo No Java processes found

REM Kill any ADB processes
echo Killing ADB processes...
taskkill /F /IM adb.exe 2>nul || echo No ADB processes found

echo ✅ Process cleanup completed!
echo 📱 Your app should stop opening automatically now.
