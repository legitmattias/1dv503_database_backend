# 📚 Assignment 2 - Backend (Bookstore API)

This is the backend API for the Assignment 2 Bookstore application, built with **Node.js, Express, and MySQL**.

## 🚀 Getting Started

### 1️⃣ Install dependencies
```sh
yarn install
```

### 2️⃣ Configure environment variables
Create a `.env` file in the project root with the following:
```env
DB_HOST=your-database-host
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=book_store
```

### 3️⃣ Start the backend server
```sh
yarn start
```

The API will be available at **`http://localhost:3000/api`**.

## 📌 Endpoints Overview
- `GET /api/books` → Retrieve all books (paginated)
- `GET /api/books/search?title=...` → Search by title (paginated)
- `GET /api/books/subject` → Browse by subject (paginated)
- `POST /api/members/register` → Register a user
- `POST /api/members/login` → Login and get a session
- `POST /api/cart` → Add books to cart
- `POST /api/orders/checkout` → Place an order

---
