# ArtConnect Backend API

Backend REST API for ArtConnect CRM Platform - A comprehensive art collection management system.

## 🚀 Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **Prisma ORM** - Database toolkit
- **MySQL** - Relational database
- **Firebase Admin SDK** - Authentication (JWT validation from Firebase Auth)

## 📁 Project Structure

```
artconnect-backend/
├── src/
│   ├── config/          # Configuration files (database, firebase)
│   ├── controllers/     # Request handlers
│   ├── middlewares/     # Express middlewares (auth, error handling)
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   └── index.ts         # Application entry point
├── prisma/
│   └── schema.prisma    # Database schema
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
- `DATABASE_URL` - Your MySQL connection string
- `FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL` - Firebase Admin SDK credentials
- `CORS_ORIGIN` - Your frontend URL (default: http://localhost:5173)

**Important:** Frontend expects backend on port `3000` with `/api` prefix for all routes.

### 3. Setup Database

Make sure MySQL is running, then:

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations to create database tables
npm run prisma:migrate

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

## 🔑 Authentication

This backend validates JWT tokens from Firebase Auth (Google Sign-In).

**Frontend Flow:**
1. User signs in with Google on frontend (Firebase Auth)
2. Frontend receives Firebase JWT token
3. Frontend sends requests with `Authorization: Bearer <token>` header
4. Backend validates token using Firebase Admin SDK

**Protected Routes:**
Add `authMiddleware` to routes that require authentication:

```typescript
import { authMiddleware } from './middlewares/authMiddleware';

router.get('/protected', authMiddleware, controller);
```

## 🗄️ Database Schema

### Core Models:
- **User** - User accounts (synced with Firebase Auth)
- **Artwork** - Art pieces in collection
- **Contact** - Collectors, galleries, museums, dealers
- **SalesDeal** - Sales pipeline management
- **Activity** - Activity timeline/logging

See `prisma/schema.prisma` for detailed schema.

## 🌐 API Endpoints

### Health Check
```
GET /api/health - Check API status
```

### Future Endpoints (to be implemented):
```
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
PUT    /api/sales/:id
DELETE /api/sales/:id

# Analytics
GET    /api/analytics/dashboard
GET    /api/analytics/sales
GET    /api/analytics/artworks
```

## 🔗 Related Projects

- **Frontend**: [artconnect-frontend](https://github.com/VXerys/artconnect-frontend)
  - Vue 3 + TypeScript + Tailwind CSS + Firebase Auth

## 📄 License

ISC

## 👨‍💻 Development

Built with ❤️ for artists and collectors
