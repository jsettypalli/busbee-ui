
set client=%1
set mode=%2

REM client should be either oliver or busbee
if NOT %client% == oliver  IF NOT %client% == busbee (
   echo "Please set valid client to build the app. Acceptable clients are  oliver or busbee".
   echo "usage: build.bat <client> <mode>"
   echo "client can be either oliver or busbee"
   echo "mode can be either mobile or web"

   exit /B
)

REM mode should be either mobile or web
if NOT %mode% == mobile  if NOT %mode% == web (
   echo "Please set valid mode to build the app. Acceptable modes are  mobile or web".
   echo "usage: build.bat <client> <mode>"
   echo "client can be either oliver or busbee"
   echo "mode can be either mobile or web"

   exit /B
)

echo "Building %mode% app for %client%"
echo "#################################"

echo "Copying common javascript from core-js/src/providers"
xcopy ..\core-js\src\providers ..\%mode%\src\providers /s /e /y

echo "Copying ui resources from %client%-ui-resources"
xcopy ..\%client%-%mode%-resources\resources ..\%mode%\resources /s /e /y
xcopy ..\%client%-%mode%-resources\src ..\%mode%\src /s /e /y
