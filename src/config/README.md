# Config Folder

## 📁 Tujuan Folder

Folder `config/` berisi file-file konfigurasi untuk koneksi dan setup berbagai service eksternal yang digunakan oleh aplikasi backend.

## 📄 File-file

### 1. `database.ts`
**Fungsi:** Setup dan konfigurasi Prisma Client untuk koneksi ke database MySQL.

**Apa yang dilakukan:**
- Inisialisasi Prisma Client dengan logging configuration
- Menyediakan function `connectDatabase()` untuk test koneksi database
- Handle graceful shutdown untuk disconnect database saat aplikasi berhenti
- Export prisma instance yang bisa digunakan di seluruh aplikasi

**Kapan digunakan:**
- Di services layer untuk query database
- Saat aplikasi startup untuk verify koneksi database
- Di setiap operasi CRUD yang butuh akses ke database

**Contoh penggunaan:**
```typescript
import prisma from '@/config/database';

// Query data
const users = await prisma.user.findMany();
```

---

### 2. `firebase.ts`
**Fungsi:** Setup Firebase Admin SDK untuk authentication dan validasi JWT token.

**Apa yang dilakukan:**
- Inisialisasi Firebase Admin SDK dengan credentials dari environment variables
- Menyediakan function `initializeFirebase()` untuk initialize Firebase saat app startup
- Export `admin` object untuk digunakan di middleware authentication
- Support 2 metode setup: via environment variables atau service account file

**Kapan digunakan:**
- Di `authMiddleware` untuk verify JWT token dari frontend
- Saat aplikasi startup untuk initialize Firebase
- Untuk validate user credentials dari Firebase Auth

**Contoh penggunaan:**
```typescript
import { admin } from '@/config/firebase';

// Verify token
const decodedToken = await admin.auth().verifyIdToken(token);
```

---

## 🔗 Dependencies

- `@prisma/client` - Prisma ORM client
- `firebase-admin` - Firebase Admin SDK
- Environment variables dari `.env` file

## 📝 Environment Variables Required

**Database:**
```env
DATABASE_URL="mysql://username:password@localhost:3306/artconnect_db"
```

**Firebase:**
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project-id.iam.gserviceaccount.com
```

## 🎯 Kesimpulan

Folder config adalah **"otak konfigurasi"** aplikasi. Semua setup untuk service eksternal (database, Firebase) dilakukan di sini sehingga kode lain di aplikasi tinggal import dan pakai saja tanpa perlu setup ulang.
