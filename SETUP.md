# ArtConnect Backend - Quick Start Guide

## ✅ Installation Complete!

Semua dependencies telah terinstall dengan sukses! ✨

## 📦 Installed Dependencies

### Production Dependencies:
- ✅ express (v5.x) - Web framework
- ✅ cors (v2.8.5) - CORS middleware
- ✅ dotenv (v16.x) - Environment variables
- ✅ firebase-admin (v12.x) - Firebase Admin SDK
- ✅ @prisma/client (v5.x) - Prisma Client
- ✅ zod (v3.x) - Schema Validation

### Development Dependencies:
- ✅ typescript - TypeScript compiler
- ✅ @types/node - Node.js type definitions
- ✅ @types/express - Express type definitions
- ✅ ts-node - TypeScript execution
- ✅ nodemon - Development auto-reload
- ✅ prisma - Prisma CLI
- ✅ jest - Testing framework

## 🚀 Server Status

✅ Development server is running on: http://localhost:3000
✅ Environment: development
✅ CORS Origin: configured in .env

## 🔧 Next Steps

### 1. Setup PostgreSQL Database (Supabase)

Pastikan Anda memiliki instance Supabase (PostgreSQL), kemudian:

\`\`\`bash
# Update connection strings di .env file
# Transaction Mode (port 6543)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:6543/postgres?pgbouncer=true"

# Session Mode (port 5432) - Required for migrations
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"

# Jalankan migrasi untuk membuat tabel
npm run prisma:migrate
\`\`\`

### 2. Setup Firebase Admin SDK

Update `.env` file dengan credentials dari Firebase Console:

\`\`\`env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project-id.iam.gserviceaccount.com
\`\`\`

### 3. Test API Endpoints

\`\`\`bash
# Health check endpoint
curl http://localhost:3000/api/health
\`\`\`

### 4. Prisma Commands

\`\`\`bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations (create tables)
npm run prisma:migrate

# Seed Database
npm run prisma:seed

# Open Prisma Studio
npm run prisma:studio
\`\`\`

## 📝 Development Commands

\`\`\`bash
# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run Tests
npm test
\`\`\`

## 📂 Project Structure Created

\`\`\`
artconnect-backend/
├── src/
│   ├── config/          ✅ Configuration
│   ├── controllers/     ✅ Request handlers (Thin controllers)
│   ├── middlewares/     ✅ Auth, Validation, Error Handling
│   ├── routes/          ✅ API Routes definition
│   ├── schemas/         ✅ Zod Validation Schemas
│   ├── services/        ✅ Business Logic Layer
│   ├── types/           ✅ TypeScript definitions
│   ├── utils/           ✅ Utilities
│   └── index.ts         ✅ Entry point
├── prisma/
│   └── schema.prisma    ✅ PostgreSQL Schema
├── docs/                ✅ Documentation
└── README.md            ✅ Main Documentation
\`\`\`

## 🗄️ Database Models Created

1. **User** - Synced with Firebase (ID = Firebase UID)
2. **Artwork** - Art collection
3. **Contact** - Professional contacts
4. **SalesDeal** - Pipeline tracking
5. **Activity** - Global activity log

## 🔐 Authentication Flow

1. User login dengan Google di frontend.
2. Frontend kirim request ke `/api/auth/sync` untuk sinkronisasi user ke DB.
3. Semua request terproteksi menggunakan header: `Authorization: Bearer <token>`.

## 🎯 Current Status

✅ Project initialized
✅ Tech stack updated to PostgreSQL & Service Layer
✅ Validation layer implemented
✅ Testing configured

**Server is running on: http://localhost:3000** 🚀

---

Happy coding! 🎨✨
