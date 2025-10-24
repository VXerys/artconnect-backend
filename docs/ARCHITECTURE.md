# Architecture Overview – ArtConnect

## System Architecture

ArtConnect menggunakan **Hybrid Architecture** dengan pemisahan concerns yang jelas antara authentication dan business logic.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        End User (Browser)                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Vue 3 Frontend (SPA)                          │
│                 artconnect-frontend (this repo)                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Components: Auth, Artworks, Contacts, Pipeline, etc     │   │
│  │  State: Composables (useAuth, useArtworks, etc)          │   │
│  │  Routing: Vue Router (protected routes)                  │   │
│  │  HTTP Client: Axios (API calls)                          │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────┬────────────────────────────────────────────┬──────────────┘
      │                                            │
      │ Firebase SDK                               │ HTTP REST API
      │ (Auth only)                                │ (Business logic)
      ▼                                            ▼
┌─────────────────────┐              ┌────────────────────────────┐
│  Firebase Auth      │              │  Node.js Backend API       │
│  (Free Tier)        │              │  artconnect-backend        │
│                     │              │  (separate repo)           │
│  - Google OAuth 2.0 │              │  ┌──────────────────────┐  │
│  - ID Token         │──────────────┼─►│ JWT Verification     │  │
│  - User Management  │  Verify Token│  │ (Firebase Admin SDK) │  │
└─────────────────────┘              │  └──────────────────────┘  │
                                     │  ┌──────────────────────┐  │
                                     │  │ Express Routes       │  │
                                     │  │ - /api/artworks      │  │
                                     │  │ - /api/contacts      │  │
                                     │  │ - /api/opportunities │  │
                                     │  │ - /api/analytics     │  │
                                     │  └──────────────────────┘  │
                                     │  ┌──────────────────────┐  │
                                     │  │ Business Logic       │  │
                                     │  │ (Controllers)        │  │
                                     │  └──────────────────────┘  │
                                     │  ┌──────────────────────┐  │
                                     │  │ Prisma ORM           │  │
                                     │  └───────┬──────────────┘  │
                                     └──────────┼─────────────────┘
                                                │
                                                ▼
                                     ┌──────────────────────────┐
                                     │      MySQL Database      │
                                     │                          │
                                     │  Tables:                 │
                                     │  - users                 │
                                     │  - artworks              │
                                     │  - contacts              │
                                     │  - opportunities         │
                                     │  - analytics_events      │
                                     └──────────────────────────┘
```

---

## Component Responsibilities

### Frontend (Vue 3 - This Repo)

**Purpose:** User interface, client-side logic, Firebase Auth integration

**Responsibilities:**
- ✅ Render UI components (forms, lists, charts, etc)
- ✅ Handle user interactions (clicks, form submissions)
- ✅ Client-side validation (before API calls)
- ✅ Firebase Auth integration (Google Sign-In)
- ✅ Obtain Firebase ID Token
- ✅ Call backend REST API dengan JWT token
- ✅ State management (composables)
- ✅ Routing & navigation
- ✅ Error handling & user feedback (toasts, modals)

**Tech Stack:**
- Vue 3 (Composition API)
- Vite (build tool)
- TypeScript (type safety)
- Tailwind CSS (styling)
- Vue Router (routing)
- Axios (HTTP client)
- Firebase SDK (auth only)
- Vitest + Vue Test Utils (testing)

**Environment Variables:**
```bash
VITE_FIREBASE_API_KEY          # Firebase public config
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_APP_ID
VITE_API_BASE_URL              # Backend API URL (e.g., http://localhost:3000/api)
```

---

### Firebase Auth (Free Tier)

**Purpose:** Authentication service (Google OAuth 2.0)

**Responsibilities:**
- ✅ Google Sign-In flow (OAuth 2.0)
- ✅ Generate ID Tokens (JWT)
- ✅ User session management
- ✅ Token refresh (automatic)

**Why Firebase Auth?**
- Free tier sufficient (10K MAU)
- Google OAuth built-in (no custom implementation needed)
- Secure token generation
- Auto-refresh tokens
- Industry-standard security

**What Firebase Auth DOES NOT handle:**
- ❌ User profiles (stored dalam MySQL via backend)
- ❌ Business data (artworks, contacts, etc)
- ❌ File storage (images handled by backend)
- ❌ Analytics data

---

### Backend API (Node.js - Separate Repo)

**Purpose:** Business logic, data persistence, API endpoints

**Responsibilities:**
- ✅ Verify Firebase ID Tokens (Firebase Admin SDK)
- ✅ Issue JWT tokens (for API access)
- ✅ CRUD operations (artworks, contacts, opportunities)
- ✅ Database queries (via Prisma ORM)
- ✅ File uploads (images) - store local atau AWS S3
- ✅ Image processing (thumbnails, compression)
- ✅ Business logic validation
- ✅ Analytics aggregations
- ✅ Report generation

**Tech Stack:**
- Node.js + Express
- Prisma ORM
- MySQL database
- TypeScript (type safety)
- Firebase Admin SDK (token verification)
- Multer (file uploads)
- Sharp (image processing)
- Jest + Supertest (testing)

**Key Endpoints:**
```
POST   /api/auth/verify           # Verify Firebase token, return JWT
GET    /api/artworks               # List artworks
POST   /api/artworks               # Create artwork (with image upload)
GET    /api/artworks/:id           # Get artwork details
PUT    /api/artworks/:id           # Update artwork
DELETE /api/artworks/:id           # Delete artwork
GET    /api/contacts               # List contacts
POST   /api/contacts               # Create contact
... (similar patterns for opportunities, analytics)
```

**Environment Variables:**
```bash
DATABASE_URL                    # MySQL connection string
JWT_SECRET                      # JWT signing secret
FIREBASE_PROJECT_ID             # Firebase project ID (for Admin SDK)
FIREBASE_PRIVATE_KEY            # Firebase service account key
PORT                            # Server port (default: 3000)
NODE_ENV                        # development | production
```

---

### MySQL Database

**Purpose:** Persistent data storage

**Tables:**
- `users` - User profiles (synced with Firebase Auth UID)
- `artworks` - Artwork metadata + image URLs
- `contacts` - Contact/buyer information
- `opportunities` - Sales pipeline opportunities
- `analytics_events` - Event tracking (views, clicks, etc)

**Relationships:**
- `artworks.user_id` → `users.id` (one-to-many)
- `contacts.user_id` → `users.id` (one-to-many)
- `opportunities.user_id` → `users.id` (one-to-many)
- `opportunities.artwork_id` → `artworks.id` (many-to-one)
- `opportunities.contact_id` → `contacts.id` (many-to-one)

---

## Authentication Flow

### 1. User Sign-In (Google)

```
┌──────────┐                                   ┌──────────────┐
│ Frontend │                                   │ Firebase Auth│
└────┬─────┘                                   └──────┬───────┘
     │                                                │
     │ 1. User clicks "Sign in with Google"          │
     │────────────────────────────────────────────►  │
     │                                                │
     │ 2. Google OAuth popup                          │
     │ ◄──────────────────────────────────────────   │
     │                                                │
     │ 3. User authenticates dengan Google            │
     │────────────────────────────────────────────►  │
     │                                                │
     │ 4. Firebase ID Token (JWT)                     │
     │ ◄──────────────────────────────────────────   │
     │                                                │
     └────────────────────────────────────────────────┘
```

### 2. Token Exchange (Get Backend JWT)

```
┌──────────┐          ┌─────────────┐          ┌──────────────┐
│ Frontend │          │   Backend   │          │ Firebase Auth│
└────┬─────┘          └──────┬──────┘          └──────┬───────┘
     │                       │                        │
     │ 5. POST /api/auth/verify                       │
     │    { firebaseToken }  │                        │
     │──────────────────────►│                        │
     │                       │ 6. Verify token        │
     │                       │───────────────────────►│
     │                       │                        │
     │                       │ 7. Token valid ✅      │
     │                       │◄───────────────────────│
     │                       │                        │
     │                       │ 8. Create/update user  │
     │                       │    in MySQL            │
     │                       │                        │
     │ 9. Backend JWT token  │                        │
     │◄──────────────────────│                        │
     │    (for API calls)    │                        │
     │                       │                        │
     └───────────────────────┴────────────────────────┘
```

### 3. Authenticated API Call

```
┌──────────┐                    ┌─────────────┐
│ Frontend │                    │   Backend   │
└────┬─────┘                    └──────┬──────┘
     │                                 │
     │ 10. GET /api/artworks            │
     │     Authorization: Bearer <JWT>  │
     │─────────────────────────────────►│
     │                                  │
     │                                  │ 11. Verify JWT
     │                                  │     Extract user_id
     │                                  │
     │                                  │ 12. Query MySQL
     │                                  │     WHERE user_id = ?
     │                                  │
     │ 13. Artworks data (JSON)         │
     │◄─────────────────────────────────│
     │                                  │
     └──────────────────────────────────┘
```

---

## Data Flow Examples

### Example 1: Create Artwork

**Frontend:**
1. User fills artwork form
2. User selects image file
3. Frontend validates (client-side)
4. Frontend sends POST request:
   ```javascript
   const formData = new FormData()
   formData.append('title', 'Sunset Painting')
   formData.append('price', 1500000)
   formData.append('description', '...')
   formData.append('image', imageFile)
   
   axios.post('/api/artworks', formData, {
     headers: {
       'Authorization': `Bearer ${jwtToken}`,
       'Content-Type': 'multipart/form-data'
     }
   })
   ```

**Backend:**
1. Verify JWT token
2. Extract user_id dari token
3. Save image to storage (local/S3)
4. Generate thumbnails (4 sizes)
5. Insert artwork record ke MySQL:
   ```sql
   INSERT INTO artworks (user_id, title, price, description, image_url, ...)
   VALUES (?, ?, ?, ?, ?, ...)
   ```
6. Return artwork object dengan image URLs:
   ```json
   {
     "id": 123,
     "title": "Sunset Painting",
     "price": 1500000,
     "imageUrls": {
       "thumbnail": "https://.../150.jpg",
       "small": "https://.../400.jpg",
       "medium": "https://.../800.jpg",
       "original": "https://.../original.jpg"
     }
   }
   ```

---

### Example 2: View Sales Pipeline

**Frontend:**
1. User navigates to Pipeline page
2. Frontend fetches opportunities:
   ```javascript
   axios.get('/api/opportunities', {
     headers: { Authorization: `Bearer ${jwtToken}` }
   })
   ```

**Backend:**
1. Verify JWT
2. Query MySQL dengan joins:
   ```sql
   SELECT 
     o.id, o.stage, o.value, o.notes,
     c.name as contact_name, c.email,
     a.title as artwork_title, a.image_url
   FROM opportunities o
   JOIN contacts c ON o.contact_id = c.id
   JOIN artworks a ON o.artwork_id = a.id
   WHERE o.user_id = ?
   ORDER BY o.created_at DESC
   ```
3. Return structured data

**Frontend:**
4. Render Kanban board dengan opportunity cards

---

## Deployment Strategy

### Development Environment

**Frontend:**
- Run locally: `npm run dev` (http://localhost:5173)
- Calls backend: `http://localhost:3000/api`

**Backend:**
- Run locally: `npm run dev` (http://localhost:3000)
- Connects to local MySQL database

**Firebase:**
- Use development Firebase project (Free tier)

---

### Production Environment

**Frontend:**
- Build: `npm run build`
- Deploy to: **Firebase Hosting** (free tier) atau Vercel/Netlify
- URL: `https://artconnect.web.app` (example)

**Backend:**
- Deploy to: **Railway**, **Render**, atau **VPS** (Digital Ocean)
- URL: `https://api.artconnect.com` (example)
- Environment: `NODE_ENV=production`

**Database:**
- Managed MySQL: **PlanetScale** (free tier) atau **Railway MySQL**

**Firebase:**
- Use production Firebase project

---

## Security Considerations

### Frontend Security

✅ **Safe:**
- Firebase config (public keys) exposed in client
- API base URL exposed

❌ **Never Expose:**
- Backend JWT tokens dalam localStorage/cookies (use httpOnly cookies atau secure storage)
- Sensitive user data dalam browser console
- Firebase Admin SDK keys

### Backend Security

✅ **Must Implement:**
- JWT token verification pada setiap protected endpoint
- Rate limiting (prevent DDoS)
- Input validation & sanitization (prevent SQL injection)
- CORS configuration (whitelist frontend domain)
- HTTPS only (production)
- Environment variables for secrets (never commit)

✅ **Firebase Token Verification:**
```javascript
const admin = require('firebase-admin')

async function verifyFirebaseToken(token) {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token)
    return decodedToken.uid // Firebase UID
  } catch (error) {
    throw new Error('Invalid token')
  }
}
```

---

## Scalability Considerations

### Current Setup (MVP)
- **Frontend:** Static hosting (scales automatically)
- **Backend:** Single server (sufficient untuk MVP)
- **Database:** Single MySQL instance
- **Limit:** ~1,000 concurrent users

### Future Scaling (Post-MVP)
- **Backend:** Horizontal scaling (multiple instances behind load balancer)
- **Database:** Read replicas, connection pooling
- **Caching:** Redis untuk frequently accessed data
- **CDN:** CloudFlare untuk static assets
- **File Storage:** AWS S3 + CloudFront CDN

---

## Why This Architecture?

### ✅ Advantages

1. **Separation of Concerns**
   - Frontend: UI/UX only
   - Backend: Business logic isolated
   - Easy to maintain dan scale independently

2. **Firebase Free Tier for Auth**
   - No need to build custom OAuth implementation
   - Google Sign-In free up to 10K MAU
   - Secure, battle-tested

3. **Full Control Over Data**
   - MySQL gives relational power (joins, transactions)
   - No vendor lock-in (can migrate anytime)
   - Custom business logic in backend

4. **Learning Opportunity**
   - Full-stack experience (FE + BE + DB)
   - Industry-standard stack
   - Portfolio-worthy project

5. **Cost-Effective**
   - Firebase Auth: Free (up to 10K users)
   - Frontend hosting: Free (Vercel/Netlify/Firebase Hosting)
   - Backend: $5-10/month (Railway/Render)
   - Database: Free (PlanetScale free tier) atau $5/month

---

## Alternative Architectures (Not Chosen)

### ❌ Option 1: Full Firebase (BaaS)
- **Pros:** Fastest development
- **Cons:** Vendor lock-in, NoSQL limitations, costly at scale, less learning

### ❌ Option 2: Traditional Monolith (No Firebase)
- **Pros:** Full control
- **Cons:** Need to implement OAuth manually (complex), more dev time

### ✅ Option 3: Hybrid (Chosen) ✅
- **Pros:** Best of both worlds - Firebase Auth (fast) + Custom Backend (control)
- **Cons:** Slightly more complex (2 projects) - but manageable

---

## Next Steps

### Frontend (This Repo)
1. ✅ Setup complete (Vue 3 + Vite + Firebase Auth)
2. 🔄 Implement Google Sign-In flow
3. 🔄 Implement token exchange (`POST /api/auth/verify`)
4. 🔄 Implement API client (Axios dengan JWT interceptor)
5. 🔄 Build UI components (artworks, contacts, pipeline)

### Backend (Separate Repo)
1. ✅ Initialize Node.js + Express project
2. ✅ Setup Prisma + MySQL
3. ✅ Implement Firebase token verification middleware
4. 🔄 Implement CRUD endpoints (artworks, contacts, opportunities)
5. 🔄 Implement file upload + image processing
6. 🔄 Write API tests (Jest + Supertest)

---

## Backend Architecture Details

### 3-Layer Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Routes     │──│ Controllers  │──│ Middlewares  │         │
│  │ (Endpoints)  │  │ (HTTP Logic) │  │ (Auth,Error) │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└────────────────────────┬───────────────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────────────┐
│                   BUSINESS LOGIC LAYER                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Services   │──│  Validators  │──│    Utils     │         │
│  │  (Business)  │  │ (Validation) │  │  (Helpers)   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└────────────────────────┬───────────────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────────────┐
│                   DATA ACCESS LAYER                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  Prisma ORM  │──│MySQL Database│──│   Models     │         │
│  │  (Database)  │  │   (Storage)  │  │  (Schema)    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└────────────────────────────────────────────────────────────────┘
```

### Backend Request Flow

```
1. HTTP Request
   │
   ▼
2. Middleware Chain
   ├─► CORS Check
   ├─► Body Parser (JSON)
   ├─► Auth Middleware (JWT Verification)
   └─► Continue if authenticated
       │
       ▼
3. Route Handler
   │ (Match URL + HTTP Method)
   ▼
4. Controller
   │ (Extract request data)
   │ (Call service layer)
   ▼
5. Service Layer
   │ (Business logic)
   │ (Validation)
   │ (Database operations via Prisma)
   ▼
6. Prisma ORM
   │ (Query MySQL)
   ▼
7. MySQL Database
   │ (Data retrieval/modification)
   ▼
8. Response Path (back up)
   │
   ▼ Service returns data
   ▼ Controller formats response
   ▼ Middleware (Error Handler if error occurs)
   ▼ HTTP Response (JSON)
```

### Backend Directory Structure

```
artconnect-backend/
├── src/
│   ├── config/
│   │   ├── database.ts         # Prisma Client initialization
│   │   └── firebase.ts         # Firebase Admin SDK setup
│   ├── controllers/
│   │   ├── authController.ts   # Auth endpoints logic
│   │   ├── artworkController.ts
│   │   ├── contactController.ts
│   │   ├── salesController.ts
│   │   └── analyticsController.ts
│   ├── middlewares/
│   │   ├── authMiddleware.ts   # JWT token verification
│   │   ├── errorHandler.ts     # Global error handling
│   │   └── validator.ts        # Request validation
│   ├── routes/
│   │   ├── index.ts            # Main router
│   │   ├── authRoutes.ts
│   │   ├── artworkRoutes.ts
│   │   ├── contactRoutes.ts
│   │   ├── salesRoutes.ts
│   │   └── analyticsRoutes.ts
│   ├── services/
│   │   ├── authService.ts      # Auth business logic
│   │   ├── artworkService.ts
│   │   ├── contactService.ts
│   │   ├── salesService.ts
│   │   └── analyticsService.ts
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   ├── utils/
│   │   ├── logger.ts           # Logging utility
│   │   ├── validator.ts        # Validation helpers
│   │   └── formatter.ts        # Data formatters
│   └── index.ts                # App entry point
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Migration history
├── tests/
│   ├── integration/            # API integration tests
│   ├── unit/                   # Unit tests
│   └── helpers/                # Test utilities
├── .env                        # Environment variables
├── .env.example
├── tsconfig.json               # TypeScript config
├── package.json
└── README.md
```

### Database Schema (Prisma)

**Complete Schema Overview:**

```prisma
// 5 Core Models

model User {
  id          String   @id @default(uuid())
  firebaseUid String   @unique        // Link to Firebase Auth
  email       String   @unique
  name        String
  photoUrl    String?
  role        UserRole @default(USER)
  
  // Relations
  artworks   Artwork[]
  contacts   Contact[]
  activities Activity[]
  
  @@index([email])
  @@index([firebaseUid])
}

model Artwork {
  id          String        @id @default(uuid())
  title       String
  artist      String
  price       Float
  status      ArtworkStatus @default(AVAILABLE)
  imageUrl    String?
  userId      String        // Foreign key to User
  
  // Relations
  user       User        @relation(fields: [userId], references: [id])
  salesDeals SalesDeal[]
  
  @@index([userId])
  @@index([status])
}

model Contact {
  id     String        @id @default(uuid())
  name   String
  type   ContactType   // COLLECTOR, GALLERY, MUSEUM, DEALER
  status ContactStatus @default(ACTIVE)
  userId String
  
  // Relations
  user       User        @relation(fields: [userId], references: [id])
  salesDeals SalesDeal[]
  
  @@index([userId])
  @@index([type])
}

model SalesDeal {
  id        String    @id @default(uuid())
  title     String
  amount    Float
  stage     DealStage @default(LEAD) // Pipeline stage
  userId    String
  contactId String
  artworkId String?
  
  // Relations
  user    User     @relation(fields: [userId], references: [id])
  contact Contact  @relation(fields: [contactId], references: [id])
  artwork Artwork? @relation(fields: [artworkId], references: [id])
  
  @@index([userId])
  @@index([stage])
}

model Activity {
  id     String       @id @default(uuid())
  type   ActivityType // Event type
  title  String
  userId String
  
  // Relations
  user User @relation(fields: [userId], references: [id])
  
  @@index([userId])
  @@index([createdAt])
}

// Enums
enum UserRole { USER, ADMIN }
enum ArtworkStatus { AVAILABLE, RESERVED, SOLD, ON_LOAN }
enum ContactType { COLLECTOR, GALLERY, MUSEUM, DEALER, OTHER }
enum ContactStatus { ACTIVE, INACTIVE, LEAD }
enum DealStage { LEAD, QUALIFIED, PROPOSAL, NEGOTIATION, CLOSED_WON, CLOSED_LOST }
enum ActivityType { ARTWORK_CREATED, CONTACT_ADDED, DEAL_WON, etc }
```

### Backend Tech Stack Details

**Core Dependencies:**

| Package | Version | Purpose |
|---------|---------|---------|
| express | 5.1.0 | Web framework |
| @prisma/client | 6.18.0 | ORM for MySQL |
| firebase-admin | 13.5.0 | Token verification |
| typescript | 5.7.3 | Type safety |
| cors | 2.8.5 | CORS handling |
| dotenv | 17.2.3 | Environment variables |

**Dev Dependencies:**

| Package | Version | Purpose |
|---------|---------|---------|
| prisma | 6.18.0 | Prisma CLI |
| ts-node | 10.9.2 | TypeScript execution |
| nodemon | 3.1.10 | Hot reload |
| jest | 29.7.0 | Testing framework |
| supertest | 6.3.3 | API testing |

### API Endpoints Summary

**Authentication:**
- `GET  /api/health` - Health check (public)
- `POST /api/auth/register` - Register user from Firebase
- `GET  /api/auth/profile` - Get user profile
- `PUT  /api/auth/profile` - Update profile

**Artworks:**
- `GET    /api/artworks` - List artworks (with filters)
- `POST   /api/artworks` - Create artwork
- `GET    /api/artworks/:id` - Get artwork
- `PUT    /api/artworks/:id` - Update artwork
- `DELETE /api/artworks/:id` - Delete artwork
- `POST   /api/artworks/:id/image` - Upload image

**Contacts:**
- `GET    /api/contacts` - List contacts
- `POST   /api/contacts` - Create contact
- `GET    /api/contacts/:id` - Get contact
- `PUT    /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact

**Sales Pipeline:**
- `GET    /api/sales` - Get all deals (grouped by stage)
- `POST   /api/sales` - Create deal
- `GET    /api/sales/:id` - Get deal
- `PUT    /api/sales/:id` - Update deal
- `PUT    /api/sales/:id/stage` - Move deal to different stage
- `DELETE /api/sales/:id` - Delete deal

**Analytics:**
- `GET /api/analytics/dashboard` - Dashboard metrics
- `GET /api/analytics/revenue` - Revenue over time
- `GET /api/analytics/pipeline` - Pipeline statistics

### Error Handling Strategy

```typescript
// Custom ApiError class
class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
  }
}

// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { 
        stack: err.stack 
      })
    }
  });
};

// Usage in controllers/services
throw new ApiError(404, 'Artwork not found');
throw new ApiError(400, 'Invalid input data');
throw new ApiError(401, 'Unauthorized access');
```

### Environment Configuration

**Development (.env):**
```env
NODE_ENV=development
PORT=3000
DATABASE_URL="mysql://root:password@localhost:3306/artconnect_dev"
FIREBASE_PROJECT_ID=artconnect-dev
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@artconnect-dev.iam.gserviceaccount.com
CORS_ORIGIN=http://localhost:5173
LOG_LEVEL=debug
```

**Production (.env.production):**
```env
NODE_ENV=production
PORT=3000
DATABASE_URL="mysql://user:pass@prod-host:3306/artconnect_prod?connection_limit=10"
FIREBASE_PROJECT_ID=artconnect-prod
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@artconnect-prod.iam.gserviceaccount.com
CORS_ORIGIN=https://artconnect.vercel.app
LOG_LEVEL=error
TRUST_PROXY=true
```

### Backend Deployment Options

**Recommended: Railway**
- ✅ Easy deployment (git push)
- ✅ Built-in MySQL database
- ✅ Automatic HTTPS
- ✅ Environment variables UI
- ✅ Free tier: 500 hours/month
- 💰 Cost: $5/month after free tier

**Alternative: Render**
- ✅ Free tier available
- ✅ Auto-deploy from GitHub
- ✅ Managed databases
- ⚠️ Free tier has cold starts
- 💰 Cost: $7/month for always-on

**Alternative: DigitalOcean App Platform**
- ✅ Full control
- ✅ Scalable
- ⚠️ More setup required
- 💰 Cost: $6/month minimum

### Performance Considerations

**Database Optimization:**
- Indexes on frequently queried fields (userId, status, stage)
- Connection pooling (max 10 connections)
- Query optimization (select only needed fields)
- Pagination for list endpoints

**Caching Strategy (Future):**
- Redis for frequently accessed data
- Cache dashboard metrics (5 min TTL)
- Cache user profiles (10 min TTL)

**Rate Limiting (Future):**
- 100 requests/minute per user
- 1000 requests/hour per user
- DDoS protection via CloudFlare

### Security Measures

**Implemented:**
- ✅ Firebase JWT token verification
- ✅ CORS whitelist (frontend domain only)
- ✅ Environment variables for secrets
- ✅ Input validation on all endpoints
- ✅ SQL injection prevention (Prisma parameterized queries)
- ✅ Error messages don't expose sensitive info

**To Implement:**
- 🔄 Rate limiting
- 🔄 Request size limits
- 🔄 HTTPS only (production)
- 🔄 Security headers (helmet.js)
- 🔄 Audit logging

---

**Document Version:** 2.0  
**Last Updated:** October 24, 2025  
**Owner:** Development Team  
**Review:** Updated with comprehensive backend architecture details
