@echo off
chcp 65001 >nul
title Configuracion Tareas ADSO - Grupo 3
setlocal enabledelayedexpansion

set "BACKEND_DIR=%~dp0"

echo ============================================================
echo  CONFIGURACION DEL PROYECTO - Tareas ADSO (Grupo 3)
echo  Paso 1/4: Instalando dependencias del BACKEND...
echo ============================================================
cd /d "%BACKEND_DIR%"
call npm install
if errorlevel 1 goto :error

echo.
echo ============================================================
echo  Paso 2/4: Creando el archivo .env (si no existe)...
echo ============================================================
if exist ".env" (
    echo  Ya existe .env. Se conserva tal cual.
) else (
    copy ".env.example" ".env" >nul
    echo  Se creo .env a partir de .env.example (Grupo3 / 12345).
    echo  Si tu MySQL usa otras credenciales, edita el archivo .env
)

echo.
echo ============================================================
echo  Paso 3/4: Instalando dependencias del FRONTEND...
echo ============================================================
set "FRONTEND_DIR="
set /p "FRONTEND_DIR=Ingresa la ruta de la carpeta Modulos del frontend (o Enter para usar %BACKEND_DIR%..\..\fronted\Frontend-\Modulos): "
if "%FRONTEND_DIR%"=="" set "FRONTEND_DIR=%BACKEND_DIR%..\..\fronted\Frontend-\Modulos"
if not exist "%FRONTEND_DIR%\package.json" (
    echo.
    echo  ERROR: No se encontro package.json en:
    echo    %FRONTEND_DIR%
    echo  Vuelve a ejecutar este script y escribe la ruta correcta.
    echo  Ejemplo: C:\proyectos\Frontend-\Modulos
    goto :error
)
pushd "%FRONTEND_DIR%"
call npm install
if errorlevel 1 goto :error
popd

echo.
echo ============================================================
echo  Paso 4/4: Probando la conexion a MySQL...
echo ============================================================
cd /d "%BACKEND_DIR%"
node --input-type=module -e "import 'dotenv/config'; import mysql from 'mysql2/promise'; try { const c = await mysql.createConnection({host:process.env.DB_HOST||'localhost',port:+process.env.DB_PORT||3306,user:process.env.DB_USER,password:process.env.DB_PASSWORD,database:process.env.DB_NAME}); const [r] = await c.query('SELECT DATABASE() b, CURRENT_USER() u'); console.log('  BD OK -> Base: '+r[0].b+' | Usuario: '+r[0].u); await c.end(); } catch (e) { console.error('  BD FALLO: '+e.code+' - '+e.message); process.exit(1); }"
if errorlevel 1 goto :error

echo.
echo ============================================================
echo  LISTO! Ahora abre DOS terminales para levantar el proyecto:
echo.
echo  TERMINAL 1 (backend):
echo    cd /d "%BACKEND_DIR%"
echo    npm run dev
echo.
echo  TERMINAL 2 (frontend):
echo    cd /d "%FRONTEND_DIR%"
echo    npm run dev
echo.
echo  Luego abre el navegador en:  http://localhost:5173
echo ============================================================
pause
exit /b 0

:error
echo.
echo  Algo fallo. Revisa el mensaje de arriba e intenta de nuevo.
echo  Tips:
echo    - Que MySQL este encendido y con la BD tareas_adso creada.
echo    - Que el .env tenga las credenciales correctas.
pause
exit /b 1
