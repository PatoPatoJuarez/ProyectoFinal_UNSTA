🐾 Proyecto Final - Manitos y Patitas

Este repositorio contiene el frontend y el backend del proyecto **Manitos y Patitas**, una aplicación para conectar refugios de animales con personas interesadas en adoptar.

--------------------------

🚀 Puesta en marcha del proyecto

🔧 Instalación de dependencias (frontend + backend)

Una vez clonado el repositorio, ejecutá este comando desde la **carpeta raíz** del proyecto, abriendo la consola en esa misma

```bash
npm run install:all

--> de este modo podran ver que se le instalaran todas absolutamente todas las dependencias del proyecto.

### 🚀 Lanzar la app en desarrollo

```bash 
npm start


ARCHIVO .ENV:
🛠️ Configuración del archivo .env
Para que el backend pueda conectarse a MongoDB Atlas, es necesario crear un archivo .env dentro de la carpeta pf_backend/.

Creá un archivo llamado .env con el siguiente contenido (en la carpeta Back esta el contenido que deberian poner recuerden que tiene que solicitar acceso a la BDD):

MONGO_URI=tu_uri_de_conexion_a_mongodb
PORT=3000
🔐 Este archivo no está incluido en el repositorio por seguridad. Pedíle a un integrante del equipo el contenido del .env, o configurá uno si ya tenés tu propia base de datos.

También podés guiarte con el archivo .env.example como plantilla.


------------------------

ProyectoFinal_UNSTA/
├── pf_backend/      → Servidor Node.js + Express + MongoDB
├── pf_frontend/     → Interfaz construida con React + Vite + MUI
├── .gitignore
├── README.md
└── package.json     → Scripts globales y dependencias