# API Documentation - ArtConnect Backend

**Document Version:** 1.0  
**Last Updated:** October 24, 2025  
**Base URL:** `http://localhost:3000` (Development)  
**API Prefix:** `/api`

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Common Response Format](#common-response-format)
4. [Error Handling](#error-handling)
5. [Authentication Endpoints](#authentication-endpoints)
6. [Artwork Endpoints](#artwork-endpoints)
7. [Contact Endpoints](#contact-endpoints)
8. [Sales Pipeline Endpoints](#sales-pipeline-endpoints)
9. [Analytics Endpoints](#analytics-endpoints)

---

## 🌐 Overview

ArtConnect Backend menyediakan RESTful API untuk manajemen CRM seniman visual. Semua endpoints menggunakan JSON untuk request dan response body.

### Base Information

| Property | Value |
|----------|-------|
| Protocol | HTTPS (Production), HTTP (Development) |
| Base URL | `http://localhost:3000` (Dev) |
| API Version | v1 |
| Default Port | 3000 |
| Content-Type | `application/json` |
| Authentication | Firebase JWT Token (Bearer) |

### HTTP Methods Used

| Method | Usage |
|--------|-------|
| GET | Retrieve resources |
| POST | Create new resources |
| PUT | Update entire resources |
| PATCH | Partial update resources |
| DELETE | Delete resources |

---

## 🔐 Authentication

Semua endpoints (kecuali health check) memerlukan **Firebase JWT Token** untuk authentication.

### How to Authenticate

1. User login via Firebase Auth di frontend
2. Frontend mendapat JWT token dari Firebase
3. Kirim token dalam Authorization header di setiap request

**Header Format:**
```
Authorization: Bearer <firebase_jwt_token>
```

**Example:**
```bash
curl -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..." \
     http://localhost:3000/api/artworks
```

### Authentication Errors

| Status | Error | Description |
|--------|-------|-------------|
| 401 | No token provided | Authorization header tidak ada |
| 401 | Invalid or expired token | Token tidak valid atau sudah expired |
| 403 | Forbidden | User tidak punya akses ke resource |

---

## 📦 Common Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    // Resource data
  },
  "message": "Operation successful" // Optional
}
```

### Success with Pagination

```json
{
  "success": true,
  "data": [
    // Array of resources
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "details": {} // Optional, hanya di development
  }
}
```

---

## ⚠️ Error Handling

### HTTP Status Codes

| Status Code | Meaning | Usage |
|-------------|---------|-------|
| 200 | OK | Request berhasil |
| 201 | Created | Resource berhasil dibuat |
| 400 | Bad Request | Invalid input/validation error |
| 401 | Unauthorized | Authentication failed |
| 403 | Forbidden | No permission untuk resource |
| 404 | Not Found | Resource tidak ditemukan |
| 500 | Internal Server Error | Server error |

### Common Error Messages

```json
// Validation Error
{
  "success": false,
  "error": {
    "message": "Validation failed: title is required"
  }
}

// Not Found
{
  "success": false,
  "error": {
    "message": "Artwork not found"
  }
}

// Unauthorized
{
  "success": false,
  "error": {
    "message": "You do not have permission to edit this artwork"
  }
}
```

---

## 🔑 Authentication Endpoints

### Health Check (Public)

**Endpoint:** `GET /api/health`  
**Authentication:** None  
**Description:** Check API status

**Response:**
```json
{
  "status": "OK",
  "message": "ArtConnect Backend API is running",
  "timestamp": "2025-10-24T10:30:00.000Z"
}
```

---

### Register User

**Endpoint:** `POST /api/auth/register`  
**Authentication:** Required  
**Description:** Create user record after Firebase authentication

**Request Body:**
```json
{
  "email": "artist@example.com",
  "name": "John Doe",
  "photoUrl": "https://example.com/photo.jpg" // Optional
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "firebaseUid": "firebase-uid",
    "email": "artist@example.com",
    "name": "John Doe",
    "photoUrl": "https://example.com/photo.jpg",
    "role": "USER",
    "createdAt": "2025-10-24T10:30:00.000Z",
    "updatedAt": "2025-10-24T10:30:00.000Z"
  },
  "message": "User registered successfully"
}
```

---

### Get User Profile

**Endpoint:** `GET /api/auth/profile`  
**Authentication:** Required  
**Description:** Get current user profile

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "firebaseUid": "firebase-uid",
    "email": "artist@example.com",
    "name": "John Doe",
    "photoUrl": "https://example.com/photo.jpg",
    "role": "USER",
    "createdAt": "2025-10-24T10:30:00.000Z",
    "updatedAt": "2025-10-24T10:30:00.000Z"
  }
}
```

---

### Update User Profile

**Endpoint:** `PUT /api/auth/profile`  
**Authentication:** Required  
**Description:** Update user profile information

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "photoUrl": "https://example.com/new-photo.jpg"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "email": "artist@example.com",
    "name": "John Doe Updated",
    "photoUrl": "https://example.com/new-photo.jpg",
    "updatedAt": "2025-10-24T11:00:00.000Z"
  },
  "message": "Profile updated successfully"
}
```

---

## 🎨 Artwork Endpoints

### Get All Artworks

**Endpoint:** `GET /api/artworks`  
**Authentication:** Required  
**Description:** Get list of user's artworks with pagination and filters

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 20 | Items per page |
| status | string | - | Filter by status (AVAILABLE, RESERVED, SOLD, ON_LOAN) |
| category | string | - | Filter by category |
| sortBy | string | createdAt | Sort field |
| sortOrder | string | desc | Sort direction (asc, desc) |

**Example Request:**
```bash
GET /api/artworks?page=1&limit=20&status=AVAILABLE&sortBy=createdAt&sortOrder=desc
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "artwork-uuid-1",
      "title": "Sunset Over Mountains",
      "description": "Beautiful landscape painting",
      "artist": "John Doe",
      "year": 2024,
      "medium": "Oil on Canvas",
      "dimensions": "60x80 cm",
      "price": 5000000,
      "currency": "IDR",
      "imageUrl": "https://storage.example.com/artworks/image1.jpg",
      "status": "AVAILABLE",
      "category": "Landscape",
      "tags": ["nature", "mountains", "sunset"],
      "createdAt": "2025-10-24T10:00:00.000Z",
      "updatedAt": "2025-10-24T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

---

### Get Artwork by ID

**Endpoint:** `GET /api/artworks/:id`  
**Authentication:** Required  
**Description:** Get single artwork details

**Path Parameters:**
- `id` - Artwork UUID

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "artwork-uuid-1",
    "title": "Sunset Over Mountains",
    "description": "Beautiful landscape painting",
    "artist": "John Doe",
    "year": 2024,
    "medium": "Oil on Canvas",
    "dimensions": "60x80 cm",
    "price": 5000000,
    "currency": "IDR",
    "imageUrl": "https://storage.example.com/artworks/image1.jpg",
    "status": "AVAILABLE",
    "category": "Landscape",
    "tags": ["nature", "mountains", "sunset"],
    "userId": "user-uuid",
    "createdAt": "2025-10-24T10:00:00.000Z",
    "updatedAt": "2025-10-24T10:00:00.000Z",
    "salesDeals": [],
    "activities": []
  }
}
```

**Error Response:** `404 Not Found`
```json
{
  "success": false,
  "error": {
    "message": "Artwork not found"
  }
}
```

---

### Create Artwork

**Endpoint:** `POST /api/artworks`  
**Authentication:** Required  
**Description:** Create new artwork

**Request Body:**
```json
{
  "title": "Sunset Over Mountains",
  "description": "Beautiful landscape painting",
  "artist": "John Doe",
  "year": 2024,
  "medium": "Oil on Canvas",
  "dimensions": "60x80 cm",
  "price": 5000000,
  "currency": "IDR",
  "category": "Landscape",
  "tags": ["nature", "mountains", "sunset"]
}
```

**Required Fields:**
- `title` (string)
- `artist` (string)
- `price` (number)

**Optional Fields:**
- `description`, `year`, `medium`, `dimensions`, `currency`, `category`, `tags`

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "artwork-uuid-new",
    "title": "Sunset Over Mountains",
    "artist": "John Doe",
    "price": 5000000,
    "status": "AVAILABLE",
    "createdAt": "2025-10-24T11:00:00.000Z"
    // ... other fields
  },
  "message": "Artwork created successfully"
}
```

---

### Update Artwork

**Endpoint:** `PUT /api/artworks/:id`  
**Authentication:** Required  
**Description:** Update artwork information

**Path Parameters:**
- `id` - Artwork UUID

**Request Body:** (All fields optional)
```json
{
  "title": "Updated Title",
  "price": 6000000,
  "status": "RESERVED"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "artwork-uuid-1",
    "title": "Updated Title",
    "price": 6000000,
    "status": "RESERVED",
    "updatedAt": "2025-10-24T12:00:00.000Z"
    // ... other fields
  },
  "message": "Artwork updated successfully"
}
```

---

### Delete Artwork

**Endpoint:** `DELETE /api/artworks/:id`  
**Authentication:** Required  
**Description:** Delete artwork

**Path Parameters:**
- `id` - Artwork UUID

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Artwork deleted successfully"
}
```

---

### Upload Artwork Image

**Endpoint:** `POST /api/artworks/:id/image`  
**Authentication:** Required  
**Description:** Upload image for artwork  
**Content-Type:** `multipart/form-data`

**Path Parameters:**
- `id` - Artwork UUID

**Request Body:**
```
Form Data:
- image: File (JPEG/PNG/WebP, max 10MB)
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "artwork-uuid-1",
    "imageUrl": "https://storage.example.com/artworks/new-image.jpg",
    "updatedAt": "2025-10-24T12:30:00.000Z"
  },
  "message": "Image uploaded successfully"
}
```

---

## 👥 Contact Endpoints

### Get All Contacts

**Endpoint:** `GET /api/contacts`  
**Authentication:** Required  
**Description:** Get list of contacts with filters

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 20 | Items per page |
| type | string | - | Filter by type (COLLECTOR, GALLERY, MUSEUM, DEALER, OTHER) |
| status | string | - | Filter by status (ACTIVE, INACTIVE, LEAD) |

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "contact-uuid-1",
      "name": "Art Gallery Jakarta",
      "email": "info@artgallery.com",
      "phone": "+62812345678",
      "company": "Art Gallery Jakarta",
      "type": "GALLERY",
      "status": "ACTIVE",
      "notes": "Interested in landscape paintings",
      "tags": ["premium", "repeat-buyer"],
      "createdAt": "2025-10-20T10:00:00.000Z",
      "updatedAt": "2025-10-20T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 35,
    "totalPages": 2
  }
}
```

---

### Create Contact

**Endpoint:** `POST /api/contacts`  
**Authentication:** Required  
**Description:** Create new contact

**Request Body:**
```json
{
  "name": "Art Gallery Jakarta",
  "email": "info@artgallery.com",
  "phone": "+62812345678",
  "company": "Art Gallery Jakarta",
  "type": "GALLERY",
  "notes": "Interested in landscape paintings",
  "tags": ["premium"]
}
```

**Required Fields:**
- `name` (string)
- `type` (COLLECTOR | GALLERY | MUSEUM | DEALER | OTHER)

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "contact-uuid-new",
    "name": "Art Gallery Jakarta",
    "type": "GALLERY",
    "status": "ACTIVE",
    "createdAt": "2025-10-24T11:00:00.000Z"
    // ... other fields
  },
  "message": "Contact created successfully"
}
```

---

## 💰 Sales Pipeline Endpoints

### Get All Deals

**Endpoint:** `GET /api/sales`  
**Authentication:** Required  
**Description:** Get all sales deals grouped by stage

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| stage | string | - | Filter by stage |
| contactId | string | - | Filter by contact |
| artworkId | string | - | Filter by artwork |

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "LEAD": [
      {
        "id": "deal-uuid-1",
        "title": "Potential Sale - Sunset Painting",
        "amount": 5000000,
        "currency": "IDR",
        "stage": "LEAD",
        "probability": 20,
        "expectedCloseDate": "2025-11-30",
        "contactId": "contact-uuid-1",
        "artworkId": "artwork-uuid-1"
      }
    ],
    "QUALIFIED": [],
    "PROPOSAL": [],
    "NEGOTIATION": [],
    "CLOSED_WON": [],
    "CLOSED_LOST": []
  }
}
```

---

### Create Deal

**Endpoint:** `POST /api/sales`  
**Authentication:** Required  
**Description:** Create new sales deal

**Request Body:**
```json
{
  "title": "Potential Sale - Sunset Painting",
  "description": "Collector interested in landscape painting",
  "amount": 5000000,
  "currency": "IDR",
  "stage": "LEAD",
  "probability": 20,
  "expectedCloseDate": "2025-11-30",
  "contactId": "contact-uuid-1",
  "artworkId": "artwork-uuid-1"
}
```

**Required Fields:**
- `title` (string)
- `amount` (number)
- `contactId` (string)

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "deal-uuid-new",
    "title": "Potential Sale - Sunset Painting",
    "amount": 5000000,
    "stage": "LEAD",
    "createdAt": "2025-10-24T11:00:00.000Z"
    // ... other fields
  },
  "message": "Deal created successfully"
}
```

---

### Move Deal Stage

**Endpoint:** `PUT /api/sales/:id/stage`  
**Authentication:** Required  
**Description:** Move deal to different stage

**Path Parameters:**
- `id` - Deal UUID

**Request Body:**
```json
{
  "stage": "NEGOTIATION",
  "probability": 70
}
```

**Valid Stages:**
- `LEAD` (20%)
- `QUALIFIED` (40%)
- `PROPOSAL` (60%)
- `NEGOTIATION` (80%)
- `CLOSED_WON` (100%)
- `CLOSED_LOST` (0%)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "deal-uuid-1",
    "stage": "NEGOTIATION",
    "probability": 70,
    "updatedAt": "2025-10-24T12:00:00.000Z"
  },
  "message": "Deal stage updated successfully"
}
```

---

## 📊 Analytics Endpoints

### Get Dashboard Metrics

**Endpoint:** `GET /api/analytics/dashboard`  
**Authentication:** Required  
**Description:** Get overview metrics for dashboard

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "totalArtworks": 45,
    "totalContacts": 35,
    "totalDeals": 12,
    "activeDeals": 8,
    "totalRevenue": 50000000,
    "pipelineValue": 25000000,
    "conversionRate": 35.5,
    "recentActivities": [
      {
        "id": "activity-uuid-1",
        "type": "ARTWORK_CREATED",
        "title": "Created artwork: Sunset Over Mountains",
        "createdAt": "2025-10-24T10:00:00.000Z"
      }
    ]
  }
}
```

---

### Get Revenue Analytics

**Endpoint:** `GET /api/analytics/revenue`  
**Authentication:** Required  
**Description:** Get revenue data over time

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| period | string | month | Period: day, week, month, year |
| startDate | string | - | Start date (ISO 8601) |
| endDate | string | - | End date (ISO 8601) |

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalRevenue": 50000000,
      "totalDeals": 12,
      "averageDealSize": 4166667
    },
    "timeline": [
      {
        "period": "2025-10",
        "revenue": 15000000,
        "deals": 3
      },
      {
        "period": "2025-09",
        "revenue": 20000000,
        "deals": 5
      }
    ]
  }
}
```

---

### Get Pipeline Metrics

**Endpoint:** `GET /api/analytics/pipeline`  
**Authentication:** Required  
**Description:** Get sales pipeline statistics

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "byStage": {
      "LEAD": { "count": 3, "value": 15000000 },
      "QUALIFIED": { "count": 2, "value": 8000000 },
      "PROPOSAL": { "count": 1, "value": 5000000 },
      "NEGOTIATION": { "count": 2, "value": 12000000 },
      "CLOSED_WON": { "count": 8, "value": 50000000 },
      "CLOSED_LOST": { "count": 4, "value": 0 }
    },
    "conversionRate": {
      "leadToQualified": 66.7,
      "qualifiedToProposal": 50.0,
      "proposalToNegotiation": 66.7,
      "negotiationToWon": 80.0,
      "overallWinRate": 35.5
    }
  }
}
```

---

## 📝 Rate Limiting

**Current Status:** Not implemented yet

**Planned Limits:**
- 100 requests per minute per user
- 1000 requests per hour per user

**Headers (Future):**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1635000000
```

---

## 🔧 Development Tools

### Testing API

**Using cURL:**
```bash
# Health check
curl http://localhost:3000/api/health

# With authentication
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:3000/api/artworks
```

**Using Thunder Client (VS Code):**
1. Install Thunder Client extension
2. Create new request
3. Set Authorization: Bearer Token
4. Add token dari Firebase

**Using Postman:**
1. Import collection (coming soon)
2. Set environment variables
3. Get token dari Firebase Auth

---

## 📚 Related Documentation

- [Database Schema](./DATABASE_SCHEMA.md) - Prisma models & relations
- [Project Structure](./PROJECT_STRUCTURE.md) - Folder organization
- [Testing Strategy](./TESTING_STRATEGY.md) - How to test APIs

---

## 🐛 Common Issues

### Issue: 401 Unauthorized
**Solution:** Pastikan token valid dan belum expired. Get fresh token dari Firebase.

### Issue: 404 Not Found on Routes
**Solution:** Cek API prefix `/api` sudah benar.

### Issue: CORS Error
**Solution:** Pastikan `CORS_ORIGIN` di `.env` sesuai dengan frontend URL.

---

**Maintained by:** ArtConnect Development Team  
**Last Updated:** October 24, 2025  
**API Version:** 1.0
