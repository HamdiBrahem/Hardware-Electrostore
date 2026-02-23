# ElectroStore - MERN Stack E-Commerce

Full-stack electronics store built with MongoDB, Express, React, and Node.js.

## Project Structure

```
electronic-store-mern/
├── client/          # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── api/     # API service layer
│   └── public/
├── server/          # Express + MongoDB backend
│   ├── models/      # Mongoose schemas
│   ├── routes/      # API routes
│   ├── middleware/   # Auth middleware
│   ├── config/      # DB config
│   └── seed.js      # Database seeder
└── package.json     # Root scripts (concurrently)
```

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas connection string)

### 1. Install all dependencies
```bash
npm run install-all
```

### 2. Configure environment
Create `server/.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/electrostore
JWT_SECRET=your_jwt_secret_key_here
```

### 3. Seed the database
```bash
npm run seed
```

### 4. Run in development (both client + server)
```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

## API Endpoints

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | Get all products (with query filters) |
| GET | /api/products/:id | Get single product |
| POST | /api/products | Create product (admin) |
| PUT | /api/products/:id | Update product (admin) |
| DELETE | /api/products/:id | Delete product (admin) |

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user profile |

### Contact
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/contact | Submit contact form |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/orders | Create order |
| GET | /api/orders/my | Get user's orders |
| GET | /api/orders/:id | Get order by ID |
