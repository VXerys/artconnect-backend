# ArtConnect Backend - Quick Start Guide

## ✅ Installation Complete!

Semua dependencies telah terinstall dengan sukses! ✨

## 📦 Installed Dependencies

### Production Dependencies:
- ✅ express (v5.1.0) - Web framework
- ✅ cors (v2.8.5) - CORS middleware
- ✅ dotenv (v17.2.3) - Environment variables
- ✅ firebase-admin (v13.5.0) - Firebase Admin SDK
- ✅ @prisma/client (v6.18.0) - Prisma Client

### Development Dependencies:
- ✅ typescript - TypeScript compiler
- ✅ @types/node - Node.js type definitions
- ✅ @types/express - Express type definitions
- ✅ @types/cors - CORS type definitions
- ✅ ts-node - TypeScript execution
- ✅ nodemon - Development auto-reload
- ✅ prisma - Prisma CLI

## 🚀 Server Status

✅ Development server is running on: http://localhost:5000
✅ Environment: development
✅ CORS Origin: http://localhost:5173

## 🔧 Next Steps

### 1. Setup MySQL Database

Pastikan MySQL sudah terinstall dan berjalan, kemudian:

\`\`\`bash
# Update connection string di .env file
DATABASE_URL="mysql://username:password@localhost:3306/artconnect_db"

# Buat database (via MySQL client atau command line)
mysql -u root -p
CREATE DATABASE artconnect_db;
exit;

# Jalankan migrasi untuk membuat tabel
npm run prisma:migrate
\`\`\`

### 2. Setup Firebase Admin SDK

Ada 2 cara untuk setup Firebase credentials:

**Option A: Menggunakan Environment Variables (Recommended)**

Update `.env` file dengan credentials dari Firebase Console:

\`\`\`env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project-id.iam.gserviceaccount.com
\`\`\`

**Option B: Menggunakan Service Account File**

1. Download service account JSON dari Firebase Console
2. Simpan sebagai `firebase-service-account.json` di root folder
3. Uncomment kode di `src/config/firebase.ts`

### 3. Test API Endpoints

\`\`\`bash
# Health check endpoint
curl http://localhost:5000/health

# atau buka di browser
# http://localhost:5000/health
\`\`\`

### 4. Prisma Commands

\`\`\`bash
# Generate Prisma Client (sudah dilakukan)
npm run prisma:generate

# Run migrations (buat tabel di database)
npm run prisma:migrate

# Open Prisma Studio (database GUI)
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

# Run Prisma Studio
npm run prisma:studio
\`\`\`

## 📂 Project Structure Created

\`\`\`
artconnect-backend/
├── src/
│   ├── config/
│   │   ├── database.ts      ✅ Prisma client setup
│   │   └── firebase.ts      ✅ Firebase Admin SDK setup
│   ├── controllers/         📁 Request handlers (empty, ready for implementation)
│   ├── middlewares/
│   │   ├── authMiddleware.ts    ✅ JWT validation middleware
│   │   └── errorHandler.ts      ✅ Global error handler
│   ├── routes/              📁 API routes (empty, ready for implementation)
│   ├── services/            📁 Business logic (empty, ready for implementation)
│   ├── types/
│   │   └── index.ts         ✅ TypeScript type definitions
│   ├── utils/               📁 Utility functions (empty, ready for implementation)
│   └── index.ts             ✅ Application entry point
├── prisma/
│   └── schema.prisma        ✅ Database schema with 5 models
├── .env                     ✅ Environment variables
├── .env.example             ✅ Environment template
├── .gitignore               ✅ Git ignore rules
├── tsconfig.json            ✅ TypeScript configuration
├── nodemon.json             ✅ Nodemon configuration
├── package.json             ✅ Dependencies & scripts
└── README.md                ✅ Complete documentation
\`\`\`

## 🗄️ Database Models Created

1. **User** - User accounts (synced with Firebase)
2. **Artwork** - Art collection management
3. **Contact** - Collectors, galleries, museums
4. **SalesDeal** - Sales pipeline & opportunity tracking
5. **Activity** - Activity log & timeline

## 🔐 Authentication Flow

1. User login dengan Google di frontend (Firebase Auth)
2. Frontend mendapat JWT token dari Firebase
3. Frontend kirim request dengan header: `Authorization: Bearer <token>`
4. Backend validate token dengan Firebase Admin SDK
5. Request berhasil jika token valid

## 📋 TODO - Next Implementation

Berikutnya yang perlu diimplementasikan:

1. **API Routes & Controllers**
   - Artwork CRUD operations
   - Contact management
   - Sales pipeline management
   - Analytics endpoints

2. **Services Layer**
   - Business logic untuk setiap modul
   - Data validation
   - Complex queries

3. **Additional Middlewares**
   - Request validation
   - Rate limiting
   - Logging

4. **Testing**
   - Unit tests
   - Integration tests

## 🐛 Troubleshooting

**Port already in use:**
\`\`\`bash
# Ganti PORT di .env file
PORT=5001
\`\`\`

**Database connection failed:**
- Pastikan MySQL sudah berjalan
- Cek connection string di .env
- Pastikan database sudah dibuat

**Firebase Auth errors:**
- Cek Firebase credentials di .env
- Pastikan Firebase project sudah setup
- Verify service account memiliki permission yang tepat

## 📚 Resources

- [Express.js Docs](https://expressjs.com/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)

## 🎯 Current Status

✅ Project initialized
✅ Dependencies installed
✅ TypeScript configured
✅ Express server setup
✅ Prisma schema created
✅ Prisma client generated
✅ Authentication middleware ready
✅ Error handling setup
✅ Development server running

**Server is running on: http://localhost:5000** 🚀

---

Happy coding! 🎨✨
\`\`\`
