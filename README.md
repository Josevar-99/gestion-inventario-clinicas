Sistema Backend - API REST
Información General
Nombre del Coder: Jose Vargas
Clan: Centurion
URL del Repositorio: https://github.com/Josevar-99/PRUEBA_NODE.JS
Tecnologías Utilizadas
Runtime: Node.js (ES Modules)
Framework: Express.js
Lenguaje: TypeScript (tsx)
ORM: Sequelize
Base de Datos: PostgreSQL
Autenticación: JSON Web Tokens (JWT) y bcrypt para encriptación
Manejo de Archivos: Multer
Instructivo de Instalación

1. Clonar el repositorio
   git clone https://github.com/Josevar-99/PRUEBA_NODE.JS.git
   cd PRUEBA_NODE.JS

2. Instalar las dependencias
   npm install

3. Configurar las variables de entorno

Crea un archivo llamado .env en la raíz del proyecto con la siguiente estructura:

PORT=3001
DB_NAME=base_prueba_db
DB_USER=postgres
DB_PASSWORD=tu_contrasena_postgres
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=tu_secreto_jwt_super_seguro

Nota: Reemplaza los valores de ejemplo por las credenciales correspondientes a tu entorno local.

Ejecutar el Proyecto

Para levantar el servidor backend en modo desarrollo, utiliza:

npm run dev

El proyecto utiliza tsx watch, por lo que el servidor se reiniciará automáticamente cuando detecte cambios en el código.

Salida esperada en consola
Conexión a la base de datos establecida exitosamente.
Modelos sincronizados con la base de datos.
Servidor corriendo en el puerto 3001

Ejecutar los Seeders

Para poblar las tablas de la base de datos utilizando los registros iniciales:

npm run db:seed

Endpoints Principales
Autenticación y Usuarios

Base URL: /api/users

Método Endpoint Descripción Protección
POST /api/users/login Autenticación de usuario y generación de token JWT Público
POST /api/users Registro de un nuevo usuario Bearer Token + rol admin
PUT /api/users/:id Actualización de datos de usuario Protegido
DELETE /api/users/:id Eliminación de usuario Protegido
Otras Rutas del Sistema
Ruta Descripción
/api/clinics Gestión de clínicas asociadas por NIT
/api/inventory Control de inventarios
/api/medications Catálogo de medicamentos
/api/requests Solicitudes y trámites internos
/api/stores Gestión de bodegas o almacenes
Comandos Disponibles

# Instalar dependencias

npm install

# Ejecutar el proyecto en modo desarrollo

npm run dev

# Ejecutar los seeders

npm run db:seed
