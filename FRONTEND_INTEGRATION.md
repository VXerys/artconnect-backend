# Frontend-Backend Integration Analysis

**Analysis Date:** October 24, 2025  
**Frontend Repository:** https://github.com/VXerys/artconnect-app  
**Backend Repository:** c:\Users\user\artconnect-backend

---

## 📊 Repository Analysis Summary

### Frontend Tech Stack (from artconnect-app)
- **Framework:** Vue 3 (Composition API)
- **Build Tool:** Vite 7.1.7
- **Language:** TypeScript (JavaScript 40.5%, Vue 28.3%, CSS 24.2%, HTML 7.0%)
- **Styling:** Tailwind CSS
- **Authentication:** Firebase Auth (Google Sign-In - Free Tier)
- **Testing:** Vitest + Vue Test Utils + happy-dom
- **Dev Server:** http://localhost:5173

### Backend Tech Stack (Our Setup)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **ORM:** Prisma
- **Database:** MySQL
- **Authentication:** Firebase Admin SDK
- **Dev Server:** http://localhost:3000

---

## ✅ Compatibility Check

### 1. ✅ Authentication Flow - COMPATIBLE
**Frontend (artconnect-app):**
```
Firebase Auth → Google Sign-In → JWT Token
```

**Backend (artconnect-backend):**
```
Firebase Admin SDK → Verify JWT Token → Authorize Request
```

**Status:** ✅ **PERFECT MATCH** - Our auth middleware already supports this!

### 2. ✅ API Base URL - FIXED
**Frontend expects:**
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

**Backend changes made:**
- ✅ Port changed: `5000` → `3000`
- ✅ Health endpoint updated: `/health` → `/api/health`
- ✅ All future routes will use `/api` prefix

**Status:** ✅ **FIXED** - Now compatible!

### 3. ✅ CORS Configuration - COMPATIBLE
**Frontend URL:**
```
http://localhost:5173
```

**Backend CORS:**
```typescript
cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
})
```

**Status:** ✅ **PERFECT MATCH**

---

## 🎯 Feature Modules Mapping

Based on frontend structure `src/modules/`, here's what we need to implement:

### 1. Authentication Module (`auth/`)
**Frontend Features:**
- User registration flow
- Firebase Authentication integration
- Profile management
- Google Sign-In

**Backend Requirements:**
- ✅ JWT token validation middleware (DONE)
- ✅ User model in database (DONE)
- ⏳ User registration endpoint (TODO)
- ⏳ Profile CRUD endpoints (TODO)

**Endpoints to Implement:**
```
POST   /api/auth/register      # Create user record after Firebase auth
GET    /api/auth/profile       # Get user profile
PUT    /api/auth/profile       # Update user profile
DELETE /api/auth/profile       # Delete user account
```

---

### 2. Artworks Module (`artworks/`)
**Frontend Features:**
- Upload, edit, organize artworks
- Metadata management (title, artist, year, medium, dimensions, price)
- Image upload
- CRUD operations

**Backend Requirements:**
- ✅ Artwork model in database (DONE)
- ⏳ Artwork CRUD endpoints (TODO)
- ⏳ Image upload handling (TODO)
- ⏳ File storage integration (TODO)

**Endpoints to Implement:**
```
GET    /api/artworks           # List all artworks (with pagination & filters)
POST   /api/artworks           # Create new artwork
GET    /api/artworks/:id       # Get artwork details
PUT    /api/artworks/:id       # Update artwork
DELETE /api/artworks/:id       # Delete artwork
POST   /api/artworks/:id/image # Upload artwork image
```

**Database Fields (from Prisma schema):**
- ✅ title, description, artist, year
- ✅ medium, dimensions, price, currency
- ✅ imageUrl, status, category, tags
- ✅ Relations: user, salesDeals, activities

---

### 3. Contacts Module (`contacts/`)
**Frontend Features:**
- Manage potential buyers and collectors
- Track collectors, galleries, museums, dealers
- Contact information management

**Backend Requirements:**
- ✅ Contact model in database (DONE)
- ⏳ Contact CRUD endpoints (TODO)
- ⏳ Contact categorization (TODO)

**Endpoints to Implement:**
```
GET    /api/contacts           # List all contacts (with filters)
POST   /api/contacts           # Create new contact
GET    /api/contacts/:id       # Get contact details
PUT    /api/contacts/:id       # Update contact
DELETE /api/contacts/:id       # Delete contact
```

**Database Fields (from Prisma schema):**
- ✅ name, email, phone, company
- ✅ type (COLLECTOR, GALLERY, MUSEUM, DEALER, OTHER)
- ✅ status (ACTIVE, INACTIVE, LEAD)
- ✅ notes, tags
- ✅ Relations: user, salesDeals, activities

---

### 4. Pipeline Module (`pipeline/`)
**Frontend Features:**
- Kanban board for sales opportunities
- Track sales pipeline stages
- Visualize sales opportunities

**Backend Requirements:**
- ✅ SalesDeal model in database (DONE)
- ⏳ Sales pipeline endpoints (TODO)
- ⏳ Deal stage management (TODO)
- ⏳ Deal movement tracking (TODO)

**Endpoints to Implement:**
```
GET    /api/sales              # List all deals (grouped by stage)
POST   /api/sales              # Create new sales deal
GET    /api/sales/:id          # Get deal details
PUT    /api/sales/:id          # Update deal (move stage, update info)
DELETE /api/sales/:id          # Delete deal
PUT    /api/sales/:id/stage    # Move deal to different stage
```

**Database Fields (from Prisma schema):**
- ✅ title, description, amount, currency
- ✅ stage (LEAD, QUALIFIED, PROPOSAL, NEGOTIATION, CLOSED_WON, CLOSED_LOST)
- ✅ probability, expectedCloseDate, actualCloseDate
- ✅ Relations: artwork, contact, activities

---

### 5. Analytics Module (`analytics/`)
**Frontend Features:**
- Revenue metrics
- Artwork performance insights
- Conversion rates
- Dashboard visualizations

**Backend Requirements:**
- ✅ Activity model for tracking (DONE)
- ⏳ Analytics aggregation endpoints (TODO)
- ⏳ Revenue calculations (TODO)
- ⏳ Performance metrics (TODO)

**Endpoints to Implement:**
```
GET    /api/analytics/dashboard    # Overview metrics
GET    /api/analytics/revenue      # Revenue over time
GET    /api/analytics/artworks     # Artwork performance
GET    /api/analytics/pipeline     # Sales pipeline metrics
GET    /api/analytics/contacts     # Contact conversion rates
```

**Metrics to Calculate:**
- Total revenue (sum of CLOSED_WON deals)
- Pipeline value (sum of open deals)
- Conversion rate (won deals / total deals)
- Average deal size
- Top performing artworks
- Contact engagement rates

---

## 🗄️ Database Schema Alignment

### User Model
```prisma
✅ Firebase integration (firebaseUid field)
✅ Basic info (email, name, photoUrl)
✅ Role management (USER, ADMIN)
✅ Relations to all other models
```

### Artwork Model
```prisma
✅ Complete artwork metadata
✅ Status tracking (AVAILABLE, RESERVED, SOLD, ON_LOAN)
✅ Pricing information
✅ Image storage (imageUrl)
✅ Tagging system (JSON array)
```

### Contact Model
```prisma
✅ Contact types (COLLECTOR, GALLERY, MUSEUM, DEALER, OTHER)
✅ Status tracking (ACTIVE, INACTIVE, LEAD)
✅ Full contact information
✅ Notes and tags
```

### SalesDeal Model
```prisma
✅ Pipeline stages (6 stages from LEAD to CLOSED_LOST)
✅ Probability tracking (0-100%)
✅ Expected and actual close dates
✅ Relations to artwork and contact
```

### Activity Model
```prisma
✅ Activity types (12 types covering all actions)
✅ Timeline tracking
✅ Relations to all entities
✅ Metadata storage (JSON)
```

---

## 🔐 Authentication Integration

### Frontend Flow (from docs)
1. User clicks "Sign in with Google"
2. Firebase Auth handles OAuth flow
3. Frontend receives Firebase JWT token
4. Frontend stores token (localStorage/sessionStorage)
5. Frontend sends requests with header: `Authorization: Bearer <token>`

### Backend Validation (Our Implementation)
1. Request arrives with `Authorization: Bearer <token>`
2. `authMiddleware` extracts token
3. Firebase Admin SDK verifies token
4. User info attached to `req.user`
5. Request proceeds to controller

**Implementation Status:**
- ✅ Middleware: `src/middlewares/authMiddleware.ts` (DONE)
- ✅ Firebase config: `src/config/firebase.ts` (DONE)
- ✅ Type definitions: `Express.Request.user` (DONE)

**Usage Example:**
```typescript
import { authMiddleware } from './middlewares/authMiddleware';

// Protected route
router.get('/api/artworks', authMiddleware, getArtworks);

// In controller, access user:
const userId = req.user?.uid;
```

---

## 📋 Implementation Roadmap

### Sprint 1-3: Core API (MVP Priority)
Based on frontend Sprint 1-9 MVP plan:

**Week 1-2: Authentication**
- [ ] POST /api/auth/register
- [ ] GET /api/auth/profile
- [ ] PUT /api/auth/profile

**Week 3-4: Artwork CRUD**
- [ ] GET /api/artworks (list with pagination)
- [ ] POST /api/artworks
- [ ] GET /api/artworks/:id
- [ ] PUT /api/artworks/:id
- [ ] DELETE /api/artworks/:id
- [ ] POST /api/artworks/:id/image (image upload)

**Week 5-6: Contact Management**
- [ ] GET /api/contacts (list with filters)
- [ ] POST /api/contacts
- [ ] GET /api/contacts/:id
- [ ] PUT /api/contacts/:id
- [ ] DELETE /api/contacts/:id

**Week 7-8: Sales Pipeline**
- [ ] GET /api/sales (grouped by stage)
- [ ] POST /api/sales
- [ ] GET /api/sales/:id
- [ ] PUT /api/sales/:id
- [ ] DELETE /api/sales/:id
- [ ] PUT /api/sales/:id/stage

**Week 9: Analytics (Basic)**
- [ ] GET /api/analytics/dashboard
- [ ] GET /api/analytics/revenue
- [ ] GET /api/analytics/pipeline

---

## 🎨 Frontend Module Structure (from artconnect-app)

```
src/modules/
├── auth/              # Authentication & user management
│   ├── components/    # Login, Register, Profile components
│   ├── composables/   # useAuth, useUser composables
│   └── services/      # Firebase Auth service
├── artworks/          # Artwork management
│   ├── components/    # ArtworkCard, ArtworkForm, ArtworkList
│   ├── composables/   # useArtworks composable
│   └── services/      # Artwork API service
├── contacts/          # Contact management
│   ├── components/    # ContactCard, ContactForm, ContactList
│   ├── composables/   # useContacts composable
│   └── services/      # Contact API service
├── pipeline/          # Sales pipeline
│   ├── components/    # KanbanBoard, DealCard
│   ├── composables/   # usePipeline composable
│   └── services/      # Sales API service
└── analytics/         # Analytics & reporting
    ├── components/    # Dashboard, Charts
    ├── composables/   # useAnalytics composable
    └── services/      # Analytics API service
```

---

## 🔧 Backend Structure Alignment

We need to create matching structure:

```
src/
├── controllers/       # Request handlers
│   ├── authController.ts
│   ├── artworkController.ts
│   ├── contactController.ts
│   ├── salesController.ts
│   └── analyticsController.ts
├── services/          # Business logic
│   ├── authService.ts
│   ├── artworkService.ts
│   ├── contactService.ts
│   ├── salesService.ts
│   └── analyticsService.ts
├── routes/            # API routes
│   ├── authRoutes.ts
│   ├── artworkRoutes.ts
│   ├── contactRoutes.ts
│   ├── salesRoutes.ts
│   └── analyticsRoutes.ts
├── middlewares/       # ✅ DONE
├── config/            # ✅ DONE
├── types/             # ✅ DONE
└── utils/             # Utility functions (TBD)
```

---

## 📝 API Response Format

Based on frontend expectations, standardize API responses:

**Success Response:**
```typescript
{
  "success": true,
  "data": { /* resource data */ },
  "message": "Operation successful"
}
```

**Error Response:**
```typescript
{
  "success": false,
  "error": {
    "message": "Error description",
    "details": { /* optional error details */ }
  }
}
```

**Pagination Response:**
```typescript
{
  "success": true,
  "data": [ /* array of items */ ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

**Implementation:**
- ✅ Type definitions already in `src/types/index.ts`
- ✅ Error handler already implements this format

---

## 🚀 Deployment Considerations

### Frontend Deployment (from docs)
- **Target:** Firebase Hosting / Vercel / Netlify
- **Build:** `npm run build` → `dist/` folder
- **Environment:** Production Firebase config

### Backend Deployment (TODO)
- **Target:** Heroku / Railway / DigitalOcean / AWS
- **Requirements:**
  - MySQL database (managed service)
  - Environment variables (Firebase credentials, DATABASE_URL)
  - CORS configuration for production frontend URL
  
**Production Checklist:**
- [ ] Update CORS_ORIGIN to production frontend URL
- [ ] Setup production database (MySQL)
- [ ] Configure Firebase Admin SDK credentials
- [ ] Setup environment variables on hosting platform
- [ ] Enable HTTPS
- [ ] Setup database backups
- [ ] Configure logging and monitoring

---

## 📊 Development Status

### ✅ Completed
- [x] Project structure setup
- [x] TypeScript configuration
- [x] Express server with CORS
- [x] Firebase Admin SDK integration
- [x] Authentication middleware
- [x] Error handling middleware
- [x] Prisma schema with 5 models
- [x] Database configuration
- [x] API prefix `/api` added
- [x] Port aligned to `3000`
- [x] Health check endpoint: `/api/health`

### 🔄 In Progress
- [ ] Database migrations (waiting for MySQL setup)
- [ ] Firebase credentials configuration

### ⏳ TODO (High Priority)
- [ ] Auth endpoints (register, profile)
- [ ] Artwork CRUD endpoints
- [ ] Contact CRUD endpoints
- [ ] Sales pipeline endpoints
- [ ] Image upload handling
- [ ] Analytics endpoints
- [ ] Request validation
- [ ] Unit tests
- [ ] Integration tests

---

## 🔗 Integration Testing Plan

Once backend endpoints are implemented:

1. **Test with Postman/Thunder Client:**
   - Test each endpoint individually
   - Verify JWT token validation
   - Check response formats

2. **Test with Frontend:**
   - Update frontend `.env.local`:
     ```env
     VITE_API_BASE_URL=http://localhost:3000/api
     ```
   - Run both servers simultaneously
   - Test authentication flow
   - Test CRUD operations
   - Verify CORS is working

3. **End-to-End Testing:**
   - User registration → Profile management
   - Artwork creation → List → Edit → Delete
   - Contact creation → Sales deal linking
   - Pipeline stage movements
   - Analytics dashboard data

---

## 📞 Next Steps

### Immediate Actions:
1. **Setup MySQL Database:**
   ```bash
   # Create database
   mysql -u root -p
   CREATE DATABASE artconnect_db;
   
   # Run migrations
   npm run prisma:migrate
   ```

2. **Configure Firebase:**
   - Get credentials from Firebase Console
   - Update `.env` file
   - Test authentication middleware

3. **Start Implementation:**
   - Begin with Auth endpoints
   - Then Artwork CRUD
   - Then Contact & Sales pipeline
   - Finally Analytics

### Testing:
- Test backend endpoints with Postman
- Integrate with frontend
- End-to-end testing

---

## ✅ Alignment Status

| Component | Frontend (artconnect-app) | Backend (artconnect-backend) | Status |
|-----------|---------------------------|------------------------------|--------|
| Port | 3000 (expected) | 3000 | ✅ ALIGNED |
| API Prefix | /api | /api | ✅ ALIGNED |
| Auth Method | Firebase JWT | Firebase Admin SDK | ✅ ALIGNED |
| CORS Origin | localhost:5173 | localhost:5173 | ✅ ALIGNED |
| Database Schema | - | 5 models ready | ✅ READY |
| Endpoints | TBD | TBD | ⏳ TODO |

---

**Summary:** Backend structure is now perfectly aligned with frontend expectations. Ready to implement API endpoints! 🚀
