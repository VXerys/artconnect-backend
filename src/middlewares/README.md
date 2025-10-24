# Middlewares Folder

## 📁 Tujuan Folder

Folder `middlewares/` berisi **middleware functions** - fungsi-fungsi yang berjalan **DI ANTARA** request masuk dan response keluar. Middleware memproses request sebelum sampai ke controller.

## 🎯 Apa itu Middleware?

Middleware adalah **"security checkpoint & processing station"**. Bayangkan seperti security di airport:
1. Cek identitas (authentication)
2. Cek bagasi (validation)
3. Proses dokumen (data transformation)
4. Handle masalah (error handling)

Request harus melewati middleware dulu sebelum sampai ke controller.

## 📄 File-file yang Ada

### 1. `authMiddleware.ts`
**Fungsi:** Validate JWT token dari Firebase dan attach user info ke request.

**Apa yang dilakukan:**
- Extract token dari header `Authorization: Bearer <token>`
- Verify token menggunakan Firebase Admin SDK
- Jika valid: attach user info ke `req.user` dan lanjutkan ke controller
- Jika invalid: return error 401 Unauthorized

**Kapan digunakan:**
Digunakan di routes yang membutuhkan authentication (protected routes).

**Contoh:**
```typescript
import { authMiddleware } from '@/middlewares/authMiddleware';

// Protected route - harus login dulu
router.get('/api/artworks', authMiddleware, getArtworks);

// Public route - tidak perlu login
router.get('/api/health', healthCheck);
```

**Request Flow dengan authMiddleware:**
```
1. Client kirim request dengan header:
   Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...

2. authMiddleware check token:
   - Extract token dari header
   - Verify dengan Firebase Admin SDK
   
3. Jika valid:
   - Attach user info ke req.user = { uid, email, name }
   - next() → lanjut ke controller
   
4. Jika invalid:
   - Throw ApiError(401, 'Invalid token')
   - Error handler middleware tangkap error
   - Return 401 response ke client
```

---

### 2. `errorHandler.ts`
**Fungsi:** Centralized error handling untuk semua errors di aplikasi.

**Apa yang dilakukan:**
- Catch semua errors yang di-throw dari controllers atau middlewares
- Format error jadi response yang konsisten
- Log error untuk debugging
- Return appropriate HTTP status code

**Kapan digunakan:**
Otomatis dipanggil saat ada error. Harus didaftarkan sebagai **middleware terakhir** di Express app.

**Contoh:**
```typescript
// Di src/index.ts
app.use('/api/artworks', artworkRoutes);
app.use('/api/contacts', contactRoutes);

// Error handler harus DI AKHIR
app.use(errorHandler); // ← Catch semua errors
```

**Error Flow:**
```
1. Controller throw error:
   throw new ApiError(404, 'Artwork not found');

2. Error handler middleware catch:
   - Extract status code (404)
   - Extract message ('Artwork not found')
   - Format ke JSON response
   
3. Send response:
   {
     "success": false,
     "error": {
       "message": "Artwork not found"
     }
   }
```

**Custom ApiError Class:**
```typescript
// Defined di errorHandler.ts
export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

// Usage di controller:
if (!artwork) {
  throw new ApiError(404, 'Artwork not found');
}
```

---

## 🔗 Middleware Chain

Middleware dipanggil secara berurutan (chain):

```typescript
// Request flow dengan multiple middlewares:
app.use(express.json());           // 1. Parse JSON body
app.use(cors());                   // 2. Handle CORS
app.use('/api/artworks', 
  authMiddleware,                  // 3. Validate JWT
  getArtworks                      // 4. Controller
);
app.use(errorHandler);             // 5. Catch errors (jika ada)
```

**Visual:**
```
Client Request
    ↓
express.json() ← Parse request body
    ↓
cors() ← Handle CORS headers
    ↓
authMiddleware ← Validate JWT token
    ↓ (req.user now available)
Controller ← Process business logic
    ↓
Response sent
    ↓
Client receives response

(Jika ada error di mana saja → errorHandler catch)
```

## 📝 Middleware Pattern

**Signature:**
```typescript
import { Request, Response, NextFunction } from 'express';

export const myMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Do something with request
  
  // Lanjut ke middleware/controller berikutnya
  next();
  
  // atau return response:
  // res.status(400).json({ error: 'Something wrong' });
};
```

**3 kemungkinan di middleware:**
1. **next()** - Lanjut ke middleware/controller berikutnya
2. **res.send()** - Kirim response dan stop chain
3. **throw error** - Error handler middleware akan catch

## 🎯 Middleware yang Bisa Ditambahkan (Future)

```
middlewares/
├── authMiddleware.ts        ✅ DONE - JWT validation
├── errorHandler.ts          ✅ DONE - Error handling
├── validationMiddleware.ts  ⏳ TODO - Request validation
├── rateLimiter.ts           ⏳ TODO - Rate limiting
├── logger.ts                ⏳ TODO - Request logging
└── uploadMiddleware.ts      ⏳ TODO - File upload handling
```

## 🔑 Prinsip Penting

### 1. **Order Matters**
Middleware dipanggil sesuai urutan pendaftaran. Error handler **HARUS TERAKHIR**.

### 2. **Always Call next()**
Jika tidak kirim response, **HARUS** panggil `next()` atau request akan "hang".

❌ **JANGAN:**
```typescript
export const myMiddleware = (req, res, next) => {
  console.log('Processing...');
  // Forgot to call next() → Request hang!
};
```

✅ **LAKUKAN:**
```typescript
export const myMiddleware = (req, res, next) => {
  console.log('Processing...');
  next(); // ← Continue to next middleware
};
```

### 3. **Type Safety**
Extend Express Request type untuk custom properties:

```typescript
// Di authMiddleware.ts
declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        email?: string;
        name?: string;
      };
    }
  }
}

// Sekarang req.user available di semua controllers
```

## 🎯 Kesimpulan

Middleware adalah **"security & processing layer"** aplikasi. Mereka:
- Process request sebelum sampai controller
- Validate authentication & authorization
- Handle errors secara terpusat
- Transform data jika perlu
- Log activities

**Remember:** Middleware = Pre-processing & Error Handling!
