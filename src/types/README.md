# Types Folder

## 📁 Tujuan Folder

Folder `types/` berisi **TypeScript type definitions** - definisi tipe data yang digunakan di seluruh aplikasi untuk type safety dan better developer experience.

## 🎯 Apa itu Types?

Types adalah **"kontrak data"** yang memastikan:
- Data yang dikirim/diterima sesuai format yang diharapkan
- IDE bisa memberikan autocomplete
- Compiler bisa catch errors sebelum runtime
- Code lebih maintainable dan documented

## 📄 File yang Ada: `index.ts`

**Current content:**

```typescript
// Common response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    message: string;
    details?: any;
  };
}

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// User types (from Firebase)
export interface AuthUser {
  uid: string;
  email?: string;
  name?: string;
}
```

## 🎯 Kapan Digunakan?

### 1. **API Response Types**

```typescript
import { ApiResponse, PaginatedResponse } from '@/types';

// Controller response
export const getArtworks = async (req, res) => {
  const result: PaginatedResponse<Artwork> = await artworkService.getAllArtworks();
  
  const response: ApiResponse<PaginatedResponse<Artwork>> = {
    success: true,
    data: result
  };
  
  res.json(response);
};
```

### 2. **Request Validation**

```typescript
// Define type for request body
interface CreateArtworkRequest {
  title: string;
  artist: string;
  year?: number;
  medium?: string;
  price: number;
  currency?: string;
}

// Use in controller
export const createArtwork = async (req: Request, res: Response) => {
  const data: CreateArtworkRequest = req.body;
  // TypeScript akan warning jika field tidak sesuai
};
```

### 3. **Service Functions**

```typescript
// Define service function with typed parameters
export const artworkService = {
  async getAllArtworks(
    params: PaginationParams & { userId: string; status?: string }
  ): Promise<PaginatedResponse<Artwork>> {
    // Implementation...
  }
};
```

## 📋 Types yang Perlu Ditambahkan

### For Artwork Management

```typescript
// types/artwork.types.ts
export interface CreateArtworkDTO {
  title: string;
  description?: string;
  artist: string;
  year?: number;
  medium?: string;
  dimensions?: string;
  price: number;
  currency?: string;
  category?: string;
  tags?: string[];
}

export interface UpdateArtworkDTO extends Partial<CreateArtworkDTO> {}

export interface ArtworkFilterParams extends PaginationParams {
  status?: 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'ON_LOAN';
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}
```

### For Contact Management

```typescript
// types/contact.types.ts
export interface CreateContactDTO {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  type: 'COLLECTOR' | 'GALLERY' | 'MUSEUM' | 'DEALER' | 'OTHER';
  notes?: string;
  tags?: string[];
}

export interface UpdateContactDTO extends Partial<CreateContactDTO> {}

export interface ContactFilterParams extends PaginationParams {
  type?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'LEAD';
}
```

### For Sales Pipeline

```typescript
// types/sales.types.ts
export interface CreateDealDTO {
  title: string;
  description?: string;
  amount: number;
  currency?: string;
  stage?: 'LEAD' | 'QUALIFIED' | 'PROPOSAL' | 'NEGOTIATION';
  probability?: number;
  expectedCloseDate?: Date;
  artworkId?: string;
  contactId: string;
}

export interface UpdateDealDTO extends Partial<CreateDealDTO> {}

export interface DealFilterParams extends PaginationParams {
  stage?: string;
  contactId?: string;
  artworkId?: string;
}
```

### For Analytics

```typescript
// types/analytics.types.ts
export interface DashboardMetrics {
  totalArtworks: number;
  totalContacts: number;
  totalDeals: number;
  totalRevenue: number;
  pipelineValue: number;
  conversionRate: number;
}

export interface RevenueData {
  period: string; // '2025-01', '2025-02', etc
  revenue: number;
  deals: number;
}

export interface ArtworkPerformance {
  artworkId: string;
  title: string;
  revenue: number;
  views: number;
  inquiries: number;
}
```

## 🔑 Best Practices

### 1. **Use DTOs (Data Transfer Objects)**

DTO = Data yang dikirim antara layers (API ↔ Service ↔ Database)

```typescript
// ✅ GOOD - Separate types for different purposes
export interface CreateArtworkDTO {
  title: string;
  price: number;
  // Only fields that client can set
}

export interface ArtworkResponse {
  id: string;
  title: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  // All fields including auto-generated
}
```

### 2. **Use Generics untuk Reusability**

```typescript
// Generic pagination type
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

// Usage:
const artworks: PaginatedResponse<Artwork> = await getArtworks();
const contacts: PaginatedResponse<Contact> = await getContacts();
```

### 3. **Extend Prisma Types**

```typescript
import { Artwork } from '@prisma/client';

// Extend Prisma type with additional fields
export interface ArtworkWithRelations extends Artwork {
  salesDeals: SalesDeal[];
  activities: Activity[];
}
```

### 4. **Utility Types**

```typescript
// Make all fields optional for update
export interface UpdateArtworkDTO extends Partial<CreateArtworkDTO> {}

// Pick specific fields
export type ArtworkSummary = Pick<Artwork, 'id' | 'title' | 'price' | 'status'>;

// Omit specific fields
export type ArtworkWithoutDates = Omit<Artwork, 'createdAt' | 'updatedAt'>;
```

## 📂 Struktur yang Disarankan

```
types/
├── index.ts              # Common types (Response, Pagination, etc)
├── artwork.types.ts      # Artwork-specific types
├── contact.types.ts      # Contact-specific types
├── sales.types.ts        # Sales-specific types
├── analytics.types.ts    # Analytics-specific types
└── express.d.ts          # Express type extensions
```

## 🔗 Express Type Extension

**File: `types/express.d.ts`**

Untuk extend Express Request type:

```typescript
// Add custom properties to Express Request
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

export {};
```

Sekarang `req.user` available di semua controllers dengan type safety!

## 🎯 Kesimpulan

Types folder adalah **"kontrak data"** aplikasi. Types:
- Ensure type safety
- Provide autocomplete
- Document expected data structures
- Catch errors at compile time
- Make code more maintainable

**Remember:** Use types everywhere for better DX and fewer bugs!
