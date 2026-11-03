# Full-Stack E-commerce Application

A full-stack e-commerce platform with a Vue.js frontend and a Node.js / Express REST API, backed by Supabase. Built as a two-person project.

## Features

- User authentication with JWT
- Product catalog [browsing / search / filtering: keep what applies]
- Cart and order management
- Payment and delivery handling
- Ownership checks on protected resources (users can only access their own data)
- Interactive API documentation with Swagger / OpenAPI

## Tech stack

| Layer | Technologies |
|---|---|
| Frontend | Vue.js, [Tailwind CSS, Vue Router, Pinia: keep what applies] |
| Backend | Node.js, Express |
| Database | Supabase (PostgreSQL) |
| Auth | JWT |
| API docs | Swagger / OpenAPI |

## Architecture

```
Vue.js frontend  →  Express REST API  →  Supabase
                      (JWT auth, business logic)
```

[Add a 2-3 line description of how the frontend, the API and Supabase interact.]

## Getting started

### Prerequisites
- Node.js [version]
- A Supabase project (URL and API keys)

### 1. Clone the repo

```bash
git clone https://github.com/Nathanamon/ecommerce-site-api.git
cd ecommerce-site-api
```

### 2. Configure environment variables

Create a `.env` file in [the backend folder] with:

```env
SUPABASE_URL=[your-supabase-url]
SUPABASE_KEY=[your-supabase-key]
JWT_SECRET=[your-jwt-secret]
PORT=[port]
```

### 3. Install dependencies and start the backend

```bash
cd [backend-folder]
npm install
npm run [dev/start]
```

### 4. Install dependencies and start the frontend

```bash
cd [frontend-folder]
npm install
npm run dev
```

## API documentation

Swagger UI is available at `http://localhost:[port]/[docs-path]` once the backend is running.

| Resource | Description |
|---|---|
| `/auth` | [Registration and login] |
| `/products` | [Product catalog] |
| `/orders` | [Order creation and tracking] |
| `/payments` | [Payment processing] |
| `/deliveries` | [Delivery tracking] |

[Replace this table with your real routes.]

## Security

- Passwords [hashed with bcrypt: confirm]
- JWT-based authentication on protected routes
- Ownership checks: a user can only read or modify their own orders, payments and deliveries


## Authors

- Nathan Akpablin ([@Nathanamon](https://github.com/Nathanamon))
- Aimée-Françoise ANOUMOUYÉ
