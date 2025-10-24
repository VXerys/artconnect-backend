# Controllers Folder

## 📁 Tujuan Folder

Folder `controllers/` berisi **request handlers** - fungsi-fungsi yang menangani HTTP requests dari client (frontend) dan mengirim responses kembali.

## 🎯 Apa itu Controller?

Controller adalah **"gerbang masuk"** untuk setiap API endpoint. Tugasnya:
1. **Menerima** request dari client (data dari frontend)
2. **Memvalidasi** input yang diterima
3. **Memanggil** business logic di services layer
4. **Mengirim** response kembali ke client

Think of it as a **receptionist** - menerima tamu (request), memproses kebutuhan mereka, lalu memberikan jawaban.

## 📂 Struktur yang Akan Dibuat

```
controllers/
├── authController.ts       # Handle authentication endpoints
├── artworkController.ts    # Handle artwork CRUD operations
├── contactController.ts    # Handle contact management
├── salesController.ts      # Handle sales pipeline operations
└── analyticsController.ts  # Handle analytics & reporting
```

## 📄 Contoh Controller (Artwork)

**File: `artworkController.ts`**

```typescript
import { Request, Response, NextFunction } from 'express';
import { artworkService } from '@/services/artworkService';
import { ApiError } from '@/middlewares/errorHandler';

// GET /api/artworks - Get all artworks
export const getArtworks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Ambil user ID dari JWT token (sudah di-attach oleh middleware)
    const userId = req.user?.uid;
    if (!userId) throw new ApiError(401, 'Unauthorized');

    // 2. Ambil query parameters untuk filtering & pagination
    const { page = 1, limit = 20, status } = req.query;

    // 3. Panggil service layer untuk business logic
    const result = await artworkService.getAllArtworks({
      userId,
      page: Number(page),
      limit: Number(limit),
      status: status as string
    });

    // 4. Kirim response sukses
    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    // 5. Pass error ke error handler middleware
    next(error);
  }
};

// POST /api/artworks - Create new artwork
export const createArtwork = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.uid;
    if (!userId) throw new ApiError(401, 'Unauthorized');

    const artworkData = req.body;

    const newArtwork = await artworkService.createArtwork(userId, artworkData);

    res.status(201).json({
      success: true,
      data: newArtwork,
      message: 'Artwork created successfully'
    });
  } catch (error) {
    next(error);
  }
};
```

## 🔑 Prinsip Penting

### 1. **Keep Controllers Thin**
Controller hanya handle HTTP layer. Business logic (validasi data, perhitungan, query database) dilakukan di **services layer**.

❌ **JANGAN:**
```typescript
// Jangan taruh business logic di controller
export const getArtworks = async (req, res) => {
  const artworks = await prisma.artwork.findMany({ 
    where: { userId: req.user.uid }
  });
  // Banyak business logic di sini...
  res.json(artworks);
};
```

✅ **LAKUKAN:**
```typescript
// Controller cuma handle HTTP, delegate ke service
export const getArtworks = async (req, res, next) => {
  try {
    const result = await artworkService.getAllArtworks(req.user.uid);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
```

### 2. **Konsisten dengan Response Format**
Semua response harus punya format yang sama:

```typescript
// Success response
{
  "success": true,
  "data": { /* data */ },
  "message": "Optional success message"
}

// Error response (handled by errorHandler middleware)
{
  "success": false,
  "error": {
    "message": "Error description"
  }
}
```

### 3. **Gunakan Try-Catch**
Selalu wrap dengan try-catch dan pass error ke `next()` untuk error handling terpusat.

## 🔗 Hubungan dengan Komponen Lain

```
Request Flow:
Client (Frontend)
    ↓
Router (routes/)
    ↓
Middleware (authMiddleware) ← Validate JWT token
    ↓
Controller (controllers/) ← YOU ARE HERE
    ↓
Service (services/) ← Business logic
    ↓
Database (via Prisma)
    ↓
Service returns data
    ↓
Controller sends response
    ↓
Client receives response
```

## 📝 Catatan Implementation

**Saat ini folder ini masih kosong** karena kita baru setup struktur. Controller akan dibuat setelah:
1. ✅ Database schema (Prisma) - DONE
2. ✅ Middleware (auth, error handling) - DONE
3. ⏳ Services layer - TODO (buat dulu services)
4. ⏳ Routes layer - TODO (define endpoints)
5. ⏳ Controllers - TODO (implement handlers)

## 🎯 Kesimpulan

Controller adalah **"penerima tamu"** aplikasi kita. Mereka:
- Menerima request HTTP
- Extract data dari request
- Panggil services untuk business logic
- Format dan kirim response
- Handle errors dengan gracefully

**Remember:** Controller = HTTP Handler only, no business logic!
