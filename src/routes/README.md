# Routes Folder

## 📁 Tujuan Folder

Folder `routes/` berisi **route definitions** - definisi semua API endpoints dan mapping ke controller functions yang sesuai.

## 🎯 Apa itu Routes?

Routes adalah **"peta jalan"** aplikasi. Mereka mendefinisikan:
- **URL path** apa yang tersedia (contoh: `/api/artworks`)
- **HTTP method** apa yang bisa digunakan (GET, POST, PUT, DELETE)
- **Controller function** mana yang handle request tersebut
- **Middleware** apa yang harus dijalankan sebelum controller

Think of it as a **traffic director** - mengarahkan request ke tujuan yang tepat.

## 📂 Struktur yang Akan Dibuat

```
routes/
├── authRoutes.ts       # Authentication endpoints
├── artworkRoutes.ts    # Artwork management endpoints
├── contactRoutes.ts    # Contact management endpoints
├── salesRoutes.ts      # Sales pipeline endpoints
└── analyticsRoutes.ts  # Analytics & reporting endpoints
```

## 📄 Contoh Route File (Artwork)

**File: `artworkRoutes.ts`**

```typescript
import { Router } from 'express';
import { authMiddleware } from '@/middlewares/authMiddleware';
import {
  getArtworks,
  getArtworkById,
  createArtwork,
  updateArtwork,
  deleteArtwork,
  uploadArtworkImage
} from '@/controllers/artworkController';

const router = Router();

// Semua routes di sini butuh authentication
// GET /api/artworks - Get all artworks with pagination & filters
router.get('/', authMiddleware, getArtworks);

// GET /api/artworks/:id - Get single artwork by ID
router.get('/:id', authMiddleware, getArtworkById);

// POST /api/artworks - Create new artwork
router.post('/', authMiddleware, createArtwork);

// PUT /api/artworks/:id - Update artwork
router.put('/:id', authMiddleware, updateArtwork);

// DELETE /api/artworks/:id - Delete artwork
router.delete('/:id', authMiddleware, deleteArtwork);

// POST /api/artworks/:id/image - Upload artwork image
router.post('/:id/image', authMiddleware, uploadArtworkImage);

export default router;
```

**Cara register routes di main app:**

```typescript
// Di src/index.ts
import artworkRoutes from './routes/artworkRoutes';
import contactRoutes from './routes/contactRoutes';
import salesRoutes from './routes/salesRoutes';

// Register routes dengan prefix
app.use('/api/artworks', artworkRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/sales', salesRoutes);
```

## 🔗 Request Flow

```
1. Client kirim request:
   GET http://localhost:3000/api/artworks?page=1&limit=20

2. Express router match URL:
   /api/artworks → artworkRoutes
   
3. artworkRoutes match method & path:
   GET / → authMiddleware → getArtworks
   
4. Middleware chain:
   authMiddleware → validate JWT
   ↓
   getArtworks controller → handle request
   ↓
   Return response
```

## 📋 Route Mapping untuk ArtConnect

### 1. Authentication Routes (`/api/auth`)
```typescript
POST   /api/auth/register      # Create user after Firebase auth
GET    /api/auth/profile       # Get user profile (protected)
PUT    /api/auth/profile       # Update user profile (protected)
DELETE /api/auth/profile       # Delete user account (protected)
```

### 2. Artwork Routes (`/api/artworks`)
```typescript
GET    /api/artworks           # List all artworks (protected)
POST   /api/artworks           # Create new artwork (protected)
GET    /api/artworks/:id       # Get artwork details (protected)
PUT    /api/artworks/:id       # Update artwork (protected)
DELETE /api/artworks/:id       # Delete artwork (protected)
POST   /api/artworks/:id/image # Upload image (protected)
```

### 3. Contact Routes (`/api/contacts`)
```typescript
GET    /api/contacts           # List all contacts (protected)
POST   /api/contacts           # Create new contact (protected)
GET    /api/contacts/:id       # Get contact details (protected)
PUT    /api/contacts/:id       # Update contact (protected)
DELETE /api/contacts/:id       # Delete contact (protected)
```

### 4. Sales Pipeline Routes (`/api/sales`)
```typescript
GET    /api/sales              # List all deals by stage (protected)
POST   /api/sales              # Create new deal (protected)
GET    /api/sales/:id          # Get deal details (protected)
PUT    /api/sales/:id          # Update deal (protected)
DELETE /api/sales/:id          # Delete deal (protected)
PUT    /api/sales/:id/stage    # Move deal to different stage (protected)
```

### 5. Analytics Routes (`/api/analytics`)
```typescript
GET    /api/analytics/dashboard    # Overview metrics (protected)
GET    /api/analytics/revenue      # Revenue over time (protected)
GET    /api/analytics/artworks     # Artwork performance (protected)
GET    /api/analytics/pipeline     # Pipeline metrics (protected)
GET    /api/analytics/contacts     # Contact conversion (protected)
```

## 🔑 Best Practices

### 1. **RESTful Convention**
Gunakan HTTP methods yang sesuai dengan operasi:

| Method | Operation | Example |
|--------|-----------|---------|
| GET | Read/Retrieve | `GET /api/artworks` - Get list |
| POST | Create | `POST /api/artworks` - Create new |
| PUT | Update (full) | `PUT /api/artworks/123` - Update all fields |
| PATCH | Update (partial) | `PATCH /api/artworks/123` - Update some fields |
| DELETE | Delete | `DELETE /api/artworks/123` - Delete |

### 2. **Route Parameters vs Query String**

**Route Parameters** (`:id`) - Untuk identifier:
```typescript
// GET /api/artworks/123
router.get('/:id', getArtworkById);

// Di controller:
const artworkId = req.params.id;
```

**Query String** (`?key=value`) - Untuk filters & pagination:
```typescript
// GET /api/artworks?page=1&limit=20&status=AVAILABLE
router.get('/', getArtworks);

// Di controller:
const { page, limit, status } = req.query;
```

### 3. **Middleware Order Matters**

```typescript
// ✅ CORRECT - Auth dulu, baru controller
router.get('/', authMiddleware, getArtworks);

// ❌ WRONG - Controller duluan, auth tidak jalan
router.get('/', getArtworks, authMiddleware);
```

### 4. **Group Related Routes**

```typescript
// ✅ GOOD - Grouped by resource
router.get('/artworks', getArtworks);
router.post('/artworks', createArtwork);

// ❌ BAD - Mixed resources
router.get('/artworks', getArtworks);
router.get('/contacts', getContacts);
router.post('/artworks', createArtwork);
```

### 5. **Protected vs Public Routes**

```typescript
// Public routes - no authentication needed
router.get('/health', healthCheck);
router.get('/api/public/artworks', getPublicArtworks);

// Protected routes - requires authentication
router.get('/api/artworks', authMiddleware, getArtworks);
router.post('/api/artworks', authMiddleware, createArtwork);
```

## 🎯 Route Naming Convention

**Consistent URL structure:**
```
/api/{resource}/{identifier}/{sub-resource}

Examples:
/api/artworks              ← Collection
/api/artworks/123          ← Specific artwork
/api/artworks/123/image    ← Sub-resource (image of artwork 123)
/api/sales/456/stage       ← Action on resource (change stage of deal 456)
```

## 📝 Catatan Implementation

**Saat ini folder ini masih kosong** karena menunggu:
1. ✅ Middleware (auth, error) - DONE
2. ⏳ Controllers - TODO (implement handlers dulu)
3. ⏳ Services - TODO (business logic dulu)
4. ⏳ Routes - TODO (define routes setelah controllers ready)

**Implementation Order:**
1. Services (business logic)
2. Controllers (request handlers)
3. Routes (endpoint definitions)

## 🎯 Kesimpulan

Routes adalah **"peta & traffic director"** aplikasi. Mereka:
- Definisikan endpoint URL yang tersedia
- Map HTTP method ke controller function
- Apply middleware untuk authentication & validation
- Organize API structure secara logical

**Remember:** Routes = URL → Middleware → Controller!
