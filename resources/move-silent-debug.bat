@echo on
setlocal

set "rbx_storage=%LOCALAPPDATA%\Roblox\rbx-storage"
set "assets=%~dp0assets"

echo RBX Storage: %rbx_storage%
echo Assets path: %assets%
echo Bat location: %~dp0

if not exist "%assets%" (
    echo ERROR: Assets folder not found at %assets%
    exit /b 1
)

echo Assets folder found!
dir "%assets%"

mkdir "%rbx_storage%\a5" 2>nul
copy /Y "%assets%\a564ec8aeef3614e788d02f0090089d8" "%rbx_storage%\a5\"

exit /b 0
