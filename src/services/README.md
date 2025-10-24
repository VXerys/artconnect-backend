# Services Folder

## 📁 Tujuan Folder

Folder `services/` berisi **business logic layer** - tempat semua logika bisnis, perhitungan, validasi data, dan operasi database dilakukan.

## 🎯 Apa itu Service Layer?

Service layer adalah **"otak aplikasi"** - tempat dimana logika bisnis yang sebenarnya terjadi. Controller hanya handle HTTP, tapi service yang melakukan pekerjaan berat.

**Analogi:** Jika controller adalah **resepsionis**, maka service adalah **tim ahli** di belakang layar yang mengerjakan request tersebut.

## 📂 Struktur yang Akan Dibuat

```
services/
├── authService.ts       # User registration, profile management
├── artworkService.ts    # Artwork CRUD & business logic
├── contactService.ts    # Contact management logic
├── salesService.ts      # Sales pipeline logic
└── analyticsService.ts  # Analytics calculations & aggregations
```

## 📄 Contoh Service (Artwork)

**File: `artworkService.ts`**

```typescript
import prisma from '@/config/database';
import { Artwork, ArtworkStatus } from '@prisma/client';
import { ApiError } from '@/middlewares/errorHandler';

export const artworkService = {
  // Get all artworks with pagination & filters
  async getAllArtworks(params: {
    userId: string;
    page: number;
    limit: number;
    status?: string;
  }) {
    const { userId, page, limit, status } = params;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = { userId };
    if (status) {
      where.status = status as ArtworkStatus;
    }

    // Query database
    const [artworks, total] = await Promise.all([
      prisma.artwork.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          salesDeals: true, // Include related sales
        },
      }),
      prisma.artwork.count({ where }),
    ]);

    // Return data with pagination info
    return {
      data: artworks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  // Create new artwork
  async createArtwork(userId: string, data: any) {
    // Validate data
    if (!data.title || !data.price) {
      throw new ApiError(400, 'Title and price are required');
    }

    // Create artwork in database
    const artwork = await prisma.artwork.create({
      data: {
        ...data,
        userId,
        status: ArtworkStatus.AVAILABLE,
      },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'ARTWORK_CREATED',
        title: `Created artwork: ${artwork.title}`,
        userId,
        artworkId: artwork.id,
      },
    });

    return artwork;
  },

  // Update artwork
  async updateArtwork(artworkId: string, userId: string, data: any) {
    // Check ownership
    const artwork = await prisma.artwork.findFirst({
      where: { id: artworkId, userId },
    });

    if (!artwork) {
      throw new ApiError(404, 'Artwork not found or unauthorized');
    }

    // Update artwork
    const updated = await prisma.artwork.update({
      where: { id: artworkId },
      data,
    });

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'ARTWORK_UPDATED',
        title: `Updated artwork: ${updated.title}`,
        userId,
        artworkId: artwork.id,
      },
    });

    return updated;
  },

  // Delete artwork
  async deleteArtwork(artworkId: string, userId: string) {
    // Check ownership
    const artwork = await prisma.artwork.findFirst({
      where: { id: artworkId, userId },
    });

    if (!artwork) {
      throw new ApiError(404, 'Artwork not found or unauthorized');
    }

    // Delete artwork (CASCADE will delete related records)
    await prisma.artwork.delete({
      where: { id: artworkId },
    });

    return { message: 'Artwork deleted successfully' };
  },
};
```

## 🔑 Prinsip Service Layer

### 1. **Business Logic Hanya Di Service**
SEMUA logika bisnis harus ada di service, TIDAK di controller.

✅ **LAKUKAN:**
```typescript
// Service - business logic here
export const artworkService = {
  async createArtwork(userId: string, data: any) {
    // Validate
    if (!data.title) throw new ApiError(400, 'Title required');
    if (data.price < 0) throw new ApiError(400, 'Invalid price');
    
    // Business logic
    const artwork = await prisma.artwork.create({ data: { ...data, userId } });
    
    // Log activity
    await logActivity('ARTWORK_CREATED', userId, artwork.id);
    
    return artwork;
  }
};

// Controller - thin, just calls service
export const createArtwork = async (req, res, next) => {
  try {
    const artwork = await artworkService.createArtwork(req.user.uid, req.body);
    res.json({ success: true, data: artwork });
  } catch (error) {
    next(error);
  }
};
```

❌ **JANGAN:**
```typescript
// Controller - terlalu banyak logic
export const createArtwork = async (req, res) => {
  // DON'T do validation, database queries in controller!
  if (!req.body.title) return res.status(400).json({ error: 'Title required' });
  
  const artwork = await prisma.artwork.create({...});
  await prisma.activity.create({...});
  
  res.json(artwork);
};
```

### 2. **Reusable Functions**
Service functions bisa dipanggil dari controller mana saja, bahkan dari service lain.

```typescript
// artworkService.ts
export const artworkService = {
  async getArtworkById(id: string, userId: string) {
    const artwork = await prisma.artwork.findFirst({
      where: { id, userId },
    });
    if (!artwork) throw new ApiError(404, 'Artwork not found');
    return artwork;
  }
};

// salesService.ts - reuse artworkService function
import { artworkService } from './artworkService';

export const salesService = {
  async createDeal(data: any) {
    // Reuse artwork validation
    const artwork = await artworkService.getArtworkById(data.artworkId, data.userId);
    
    // Create sales deal
    const deal = await prisma.salesDeal.create({ data });
    return deal;
  }
};
```

### 3. **Transaction Handling**
Gunakan Prisma transaction untuk operasi yang saling bergantungan.

```typescript
export const salesService = {
  async closeDeal(dealId: string) {
    // Use transaction - all or nothing
    return await prisma.$transaction(async (tx) => {
      // 1. Update deal status
      const deal = await tx.salesDeal.update({
        where: { id: dealId },
        data: { 
          stage: 'CLOSED_WON',
          actualCloseDate: new Date()
        },
      });

      // 2. Update artwork status
      if (deal.artworkId) {
        await tx.artwork.update({
          where: { id: deal.artworkId },
          data: { status: 'SOLD' },
        });
      }

      // 3. Log activity
      await tx.activity.create({
        data: {
          type: 'DEAL_WON',
          title: `Deal closed: ${deal.title}`,
          userId: deal.userId,
          dealId: deal.id,
        },
      });

      return deal;
    });
  }
};
```

### 4. **Error Handling**
Gunakan `ApiError` untuk throw errors yang readable.

```typescript
// Good error messages
if (!artwork) {
  throw new ApiError(404, 'Artwork not found');
}

if (artwork.userId !== userId) {
  throw new ApiError(403, 'You do not have permission to edit this artwork');
}

if (artwork.status === 'SOLD') {
  throw new ApiError(400, 'Cannot edit sold artwork');
}
```

## 📋 Service Implementation Plan untuk ArtConnect

### 1. **authService.ts**
```typescript
- registerUser()      // Create user record after Firebase auth
- getUserProfile()    // Get user profile
- updateProfile()     // Update user info
- deleteAccount()     // Soft delete user account
```

### 2. **artworkService.ts**
```typescript
- getAllArtworks()    // List with filters & pagination
- getArtworkById()    // Get single artwork
- createArtwork()     // Create new artwork
- updateArtwork()     // Update artwork data
- deleteArtwork()     // Delete artwork
- uploadImage()       // Handle image upload
- changeStatus()      // Update artwork status
```

### 3. **contactService.ts**
```typescript
- getAllContacts()    // List with filters
- getContactById()    // Get single contact
- createContact()     // Create new contact
- updateContact()     // Update contact data
- deleteContact()     // Delete contact
- getContactsByType() // Filter by type (COLLECTOR, GALLERY, etc)
```

### 4. **salesService.ts**
```typescript
- getAllDeals()       // List deals grouped by stage
- getDealById()       // Get single deal
- createDeal()        // Create new deal
- updateDeal()        // Update deal data
- deleteDeal()        // Delete deal
- changeDealStage()   // Move deal to different stage
- closeDealWon()      // Mark deal as won (update artwork status)
- closeDealLost()     // Mark deal as lost
```

### 5. **analyticsService.ts**
```typescript
- getDashboardMetrics()    // Overview stats
- getRevenueAnalytics()    // Revenue over time
- getArtworkPerformance()  // Top selling artworks
- getPipelineMetrics()     // Pipeline conversion rates
- getContactInsights()     // Contact engagement stats
```

## 🎯 Kesimpulan

Service layer adalah **"otak aplikasi"** tempat semua logika bisnis terjadi. Services:
- Handle database operations
- Validate business rules
- Perform calculations
- Manage transactions
- Reusable across controllers

**Remember:** Keep controllers thin, put ALL business logic in services!
