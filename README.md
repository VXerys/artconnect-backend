# ArtConnect Backend API

Backend REST API for ArtConnect CRM Platform - A comprehensive art collection management system.

## 🚀 Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **Prisma ORM** - Database toolkit
- **PostgreSQL (Supabase)** - Relational database
- **Firebase Admin SDK** - Authentication (JWT validation from Firebase Auth)
- **Zod** - Schema validation

## 📁 Project Structure

```
artconnect-backend/
├── src/
│   ├── config/          # Configuration files (database, firebase)
│   ├── controllers/     # Request handlers (lean, calls services)
│   ├── middlewares/     # Express middlewares (auth, validation, error handling)
│   ├── routes/          # API routes
│   ├── schemas/         # Zod validation schemas
│   ├── services/        # Business logic (database interactions, complex logic)
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── tests/           # Integration tests
│   └── index.ts         # Application entry point
├── prisma/
│   └── schema.prisma    # Database schema
├── docs/                # Project documentation
├── .env                 # Environment variables (not committed)
├── .env.example         # Environment variables template
├── tsconfig.json        # TypeScript configuration
├── nodemon.json         # Nodemon configuration
└── package.json         # Dependencies and scripts
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Update the following in `.env`:
- `DATABASE_URL` - Your Supabase Transaction URL (port 6543)
- `DIRECT_URL` - Your Supabase Session URL (port 5432) for migrations
- `FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL` - Firebase Admin SDK credentials
- `CORS_ORIGIN` - Comma-separated list of allowed origins (e.g., `http://localhost:5173,http://localhost:3000`)

**Important:** Frontend expects backend on port `3000` with `/api` prefix for all routes.

### 3. Setup Database

Make sure your Supabase/PostgreSQL instance is running, then:

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations to create database tables
npm run prisma:migrate

# Seed the database with initial data (Optional)
npm run prisma:seed

# (Optional) Open Prisma Studio to view your database
npm run prisma:studio
```

### 4. Run Development Server

```bash
npm run dev
```

Server will start on `http://localhost:3000`

## 📝 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)
- `npm test` - Run integration tests

## 🔑 Authentication

This backend validates JWT tokens from Firebase Auth (Google Sign-In).

**Frontend Flow:**
1. User signs in with Google on frontend (Firebase Auth)
2. Frontend receives Firebase JWT token
3. Frontend calls `POST /api/auth/sync` with the token to sync user to database.
4. Frontend sends requests with `Authorization: Bearer <token>` header for protected routes.
5. Backend validates token using Firebase Admin SDK.

**User ID Strategy:**
The database `User.id` is the **Firebase UID**. This ensures strict 1:1 mapping between Auth and DB.

## 🗄️ Database Schema

### Core Models:
- **User** - User accounts (Primary Key = Firebase UID)
- **Artwork** - Art pieces in collection
- **Contact** - Collectors, galleries, museums, dealers
- **SalesDeal** - Sales pipeline management
- **Activity** - Activity timeline/logging

See `prisma/schema.prisma` or `docs/DATABASE_SCHEMA.md` for detailed schema.

## 🌐 API Endpoints

### Health Check
```
GET /api/health - Check API status
```

### Core Endpoints:
```
# Auth
POST   /api/auth/sync      - Sync Firebase user to DB
GET    /api/auth/profile   - Get user profile
PUT    /api/auth/profile   - Update user profile

# Artworks
GET    /api/artworks
POST   /api/artworks
GET    /api/artworks/:id
PUT    /api/artworks/:id
DELETE /api/artworks/:id

# Contacts
GET    /api/contacts
POST   /api/contacts
GET    /api/contacts/:id
PUT    /api/contacts/:id
DELETE /api/contacts/:id

# Sales Pipeline
GET    /api/sales
POST   /api/sales
GET    /api/sales/:id
PUT    /api/sales/:id/stage
DELETE /api/sales/:id

# Analytics
GET    /api/analytics/dashboard
GET    /api/analytics/sales-performance
```

## 🔗 Related Projects

- **Frontend**: [artconnect-frontend](https://github.com/VXerys/artconnect-frontend)
  - Vue 3 + TypeScript + Tailwind CSS + Firebase Auth

## 📄 License

ISC

## 👨‍💻 Development

Built with ❤️ for artists and collectors
