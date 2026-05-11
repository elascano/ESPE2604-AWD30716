# Guía de Instalación del Proyecto

Este proyecto contiene dependencias tanto de backend (PHP) como de frontend (JavaScript/Node.js). Sigue estos pasos para instalar todo lo necesario y poder ejecutar el proyecto de manera local.

## 1. Requisitos Previos
Asegúrate de tener instalados los siguientes programas en tu computadora:
- [PHP](https://www.php.net/) y [Composer](https://getcomposer.org/)
- [Node.js](https://nodejs.org/) y npm (Node Package Manager)

## 2. Instalación de Dependencias del Backend (PHP)
El gestor de paquetes de PHP es Composer. Este creará la carpeta `vendor/` con todas las librerías necesarias.

1. Abre tu terminal en la raíz del proyecto (donde se encuentra el archivo `composer.json`).
2. Ejecuta el siguiente comando:
```bash
composer install
```

## 3. Instalación de Dependencias del Frontend (JavaScript)
El gestor de paquetes de Node.js es npm. Este creará la carpeta `node_modules/` con todas las dependencias de la interfaz.

1. En la misma terminal, asegúrate de estar en la carpeta donde se encuentra el archivo `package.json`.
2. Ejecuta el siguiente comando:
```bash
npm install
```

## 4. Ejecución del Proyecto
Una vez que ambas carpetas (`vendor/` y `node_modules/`) se hayan generado con éxito, puedes proceder a levantar los servidores de desarrollo correspondientes según la configuración de tu proyecto (por ejemplo, usando `npm run dev` para el frontend y tu servidor local para PHP).
