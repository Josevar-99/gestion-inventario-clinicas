# Clinic Inventory API

REST API for managing medication inventory across clinics, built with Node.js, Express, TypeScript and PostgreSQL.

**Author:** Jose Vargas

## Stack

- Node.js (ES Modules) and Express
- TypeScript, run with tsx
- Sequelize ORM and PostgreSQL
- JWT authentication and bcrypt password hashing
- Multer for file uploads

## Requirements

- Node.js 20 or later
- PostgreSQL

## Installation

```
git clone https://github.com/Josevar-99/gestion-inventario-clinicas.git
cd gestion-inventario-clinicas
npm install
cp .env.example .env
```

Edit `.env` with the credentials of your local PostgreSQL instance. To run PostgreSQL with Docker instead, start the service defined in `docker-compose.yml`:

```
docker compose up -d
```

## Environment variables

| Variable | Description |
|---|---|
| `PORT` | Server port |
| `DB_NAME` | Database name |
| `DB_USER` | Database user |
| `DB_PASSWORD` | Database password |
| `DB_HOST` | Database host |
| `DB_PORT` | Database port |
| `JWT_SECRET` | Secret used to sign tokens |

## Running the project

```
npm run dev
```

The server restarts automatically on code changes (`tsx watch`). Expected output:

```
Database connection established successfully.
Models synchronized with the database.
Server running on port 3001
```

Seed the database with initial records:

```
npm run db:seed
```

## Endpoints

### Authentication and users

Base URL: `/api/users`

| Method | Route | Description | Access |
|---|---|---|---|
| POST | `/api/users/login` | Authenticate and receive a JWT | Public |
| POST | `/api/users` | Register a new user | Bearer token, admin role |
| PUT | `/api/users/:id` | Update a user | Bearer token |
| DELETE | `/api/users/:id` | Delete a user | Bearer token |

### Other resources

| Route | Description |
|---|---|
| `/api/clinics` | Clinics, identified by NIT |
| `/api/inventory` | Inventory control |
| `/api/medications` | Medication catalog |
| `/api/requests` | Internal requests |
| `/api/stores` | Warehouses |

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Development server with automatic restart |
| `npm run db:seed` | Populate the database with initial data |
