# EcoMarket

EcoMarket is a full-stack e-commerce application with a Vue 3 storefront and a
Node.js/Express REST API backed by Supabase (PostgreSQL).

## Features

- Browse products, view product details, ratings, and reviews
- Register and sign in with JWT-based authentication
- Manage a shopping cart and place orders
- Track stock as order items are added, changed, or removed
- Record payments and manage delivery details, including pickup points
- Get product recommendations based on local weather
- Explore the API through Swagger UI

> **Development note:** Payment records are handled by the API, but the current
> implementation does not integrate with a real payment provider. The frontend
> also calls the API at `http://localhost:3000` directly.

## Technology

| Area | Stack |
|---|---|
| Frontend | Vue 3, Vite, Vue Router, Pinia, Tailwind CSS |
| Backend | Node.js, Express 5 |
| Database | Supabase / PostgreSQL |
| Authentication | JSON Web Tokens (JWT), bcrypt |
| API documentation | Swagger / OpenAPI |

The Vue application sends requests to the Express API. The API handles
authentication and application operations, and reads or writes data in
Supabase. Weather-based recommendations also use the OpenWeather API.

## Requirements

- Node.js `^20.19.0` or `>=22.12.0` (the frontend's declared engine range)
- npm
- A Supabase project with the tables and relationships used by the API
- An OpenWeather API key if you want to use weather recommendations

The application expects Supabase tables named `users`, `products`, `reviews`,
`orders`, `order_items`, `payments`, `deliveries`, and `pickup_points`. There
are no database migrations or schema definitions in this repository; configure
the database schema before using the corresponding features.

## Setup

### 1. Configure the API

Create `server/.env`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-key
JWT_SECRET=replace-with-a-long-random-secret
PORT=3000
OPENWEATHER_API_KEY=your-openweather-api-key
```

`SUPABASE_URL`, `SUPABASE_KEY`, and `JWT_SECRET` are required for normal API
operation. `PORT` selects the API port; the frontend currently expects the
default value `3000`. `OPENWEATHER_API_KEY` is needed for weather
recommendations.

Install dependencies and run the API:

```bash
cd server
npm install
npm run dev
```

The API is available at `http://localhost:3000`. For a non-development start,
run `npm start` in `server`.

### 2. Run the frontend

In another terminal:

```bash
cd client
npm install
npm run dev
```

Vite prints the local frontend URL when it starts (typically
`http://localhost:5173`).

To create a production frontend build, run `npm run build` in `client`.

## API

Interactive API documentation is served at
[`http://localhost:3000/api-docs`](http://localhost:3000/api-docs).

All endpoints below are relative to `http://localhost:3000`. Endpoints marked
**JWT** require an `Authorization` header containing the token returned by the
login endpoint.

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| `GET` | `/` | API status | No |
| `POST` | `/api/auth/register` | Register an account | No |
| `POST` | `/api/auth/login` | Sign in and receive a JWT | No |
| `GET` | `/api/profile` | Get the current user's profile | JWT |
| `PUT` | `/api/profile` | Update the current user's profile | JWT |
| `DELETE` | `/api/delete` | Anonymize and deactivate the current account | JWT |
| `GET` | `/api/products` | List products | No |
| `GET` | `/api/products/:id` | Get a product and its reviews | No |
| `POST` | `/api/products/:id/reviews` | Add a product review | No |
| `GET` | `/api/recommendations/weather?lat=<lat>&lon=<lon>` | Get weather-based product recommendations | No |
| `POST` | `/api/orders` | Create an order | JWT |
| `GET` | `/api/orders` | List the current user's orders | JWT |
| `POST` | `/api/order-items` | Add an item to an order | JWT |
| `GET` | `/api/order-items/:order_id` | List items in an order | JWT |
| `PUT` | `/api/order-items/:item_id` | Change an item's quantity | JWT |
| `DELETE` | `/api/order-items/:item_id` | Remove an item from an order | JWT |
| `POST` | `/api/payments` | Record a payment for an order | JWT |
| `GET` | `/api/payments/order/:order_id` | List payments for an order | JWT |
| `POST` | `/api/deliveries` | Create delivery details for an order | JWT |
| `GET` | `/api/deliveries/order/:order_id` | List deliveries for an order | JWT |
| `PATCH` | `/api/deliveries/:delivery_id` | Update delivery details | JWT |

The weather endpoint requires an OpenWeather API key. The API checks order and
delivery ownership on protected operations. Product reviews are currently
accepted without authentication.

## Project layout

```text
client/   Vue 3 frontend
server/   Express API and Supabase integration
```

## Authors

- Nathan Akpablin — [@Nathanamon](https://github.com/Nathanamon)
- Aimée-Françoise ANOUMOUYÉ
