# Productify – Backend

Productify backend is a **Node.js + Express** server with a **MongoDB Atlas** database, providing RESTful API endpoints for managing products.

---

## Features
- **Full CRUD API** – Create, Read, Update, and Delete products.
- **Advanced Filtering** – Query products by name, type, and date range via query string parameters.
- **Auto-increment `number` field** – Implemented via a `counters` collection to ensure each product receives a unique running number, even after multiple insertions.
- **Seeding process** – `npm run seed` populates the database with initial products and updates the counter accordingly, ensuring the numbering remains continuous.
- **Error Handling** – Consistent and descriptive API responses.
- **Logger Middleware** – Tracks incoming requests and errors.

---

## Tech Stack
- **Node.js**
- **Express.js**
- **MongoDB Atlas**
- **dotenv** for environment variables
- **nodemon** (development)

---

## Installation & Setup

1. **Extract the project folder** from the provided ZIP.
2. Open a terminal inside the extracted folder.
3. Install dependencies:
   ```sh
   npm install
   ```
4. **Configure environment variables**  
   Update `.env` with your own connection details in place of `<username>` and `<password>`:
   ```env
   ATLAS_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/
   ATLAS_DBNAME=product_db
   PORT=3030
   ```
5. **Seed the database** (must be done before starting the server):
   ```sh
   npm run seed
   ```
6. **Run the backend server**:
   ```sh
   npm start
   ```
   API will be available at `http://localhost:3030/api/product`.

---

## Project Structure
```
productify-backend/
 ├── api/                # API route handlers
 │   └── product/        # Product controller & routes
 ├── config/             # Config settings
 ├── middlewares/        # Logger and other middlewares
 ├── services/           # Database & product services
 ├── data/               # Seed data
 ├── .env                # Environment variables
 ├── seed.js             # Seed script
 └── server.js           # Entry point
```

---

## API Endpoints

**Base URL:** `/api/product`

| Method | Endpoint  | Description                       |
|--------|-----------|-----------------------------------|
| GET    | `/`       | Get all products (with filters)   |
| GET    | `/:id`    | Get a single product by ID        |
| POST   | `/`       | Add a new product                 |
| PUT    | `/:id`    | Update a product                  |
| DELETE | `/:id`    | Delete a product                  |

---

## Filtering Logic
- **Search term** – Matches product name.
- **Type filter** – `vegetable`, `fruit`, or `field`.
- **Date range** – Filters products by `marketingDate`.
- **Query string sync** – Filters are applied directly via URL parameters.

---

## Notes
- Make sure to run the **seed script** before testing.
- The `number` field auto-increments reliably even across multiple runs.
- Do **not** commit `.env` to source control.
