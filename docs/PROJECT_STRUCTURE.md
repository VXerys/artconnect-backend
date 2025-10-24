# Project Structure - ArtConnect Backend

**Document Version:** 1.0  
**Last Updated:** October 24, 2025  
**Status:** Active Development

---

## 📁 Overview

Dokumen ini menjelaskan struktur folder dan organisasi file dalam project ArtConnect Backend. Project ini menggunakan **layered architecture** dengan separation of concerns untuk maintainability dan scalability.

---

## 🏗️ Architecture Pattern

ArtConnect Backend menggunakan **3-Layer Architecture**:

```
Presentation Layer (Routes + Controllers)
          ↓
Business Logic Layer (Services)
          ↓
Data Access Layer (Prisma ORM + Database)
```

**Benefits:**
- Clear separation of concerns
- Easy to test each layer independently
- Scalable dan maintainable
- Reusable business logic

---

## 📂 Root Directory Structure

```
artconnect-backend/
├── src/                      # Source code aplikasi
├── prisma/                   # Database schema & migrations
├── docs/                     # Documentation files
├── node_modules/             # Dependencies (auto-generated)
├── dist/                     # Compiled JavaScript (auto-generated)
├── .env                      # Environment variables (not committed)
├── .env.example              # Environment template
├── .gitignore                # Git ignore rules
├── package.json              # Project metadata & dependencies
├── tsconfig.json             # TypeScript configuration
├── nodemon.json              # Nodemon configuration
└── README.md                 # Project overview
```

---

## 📁 src/ - Source Code

**Purpose:** Berisi semua source code aplikasi.

```
src/
├── index.ts                  # Application entry point (Express server setup)
├── config/                   # Configuration files
├── controllers/              # HTTP request handlers
├── middlewares/              # Express middlewares
├── routes/                   # API route definitions
├── services/                 # Business logic layer
├── types/                    # TypeScript type definitions
└── utils/                    # Utility functions
```

### 1. `src/index.ts` - Entry Point

**Purpose:** Main file yang menjalankan Express server.

**Contents:**
- Express app initialization
- Middleware registration (CORS, JSON parser)
- Route registration
- Error handler registration
- Server start

**Key Code:**
```typescript
const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

// Routes
app.use('/api/artworks', artworkRoutes);
app.use('/api/contacts', contactRoutes);

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT);
```

---

### 2. `src/config/` - Configuration

**Purpose:** Setup koneksi dan konfigurasi external services.

```
config/
├── database.ts               # Prisma Client setup & DB connection
└── firebase.ts               # Firebase Admin SDK initialization
```

**Files:**
- `database.ts` - Prisma Client instance, connection testing, graceful shutdown
- `firebase.ts` - Firebase Admin SDK untuk JWT verification

**Usage:**
```typescript
import prisma from '@/config/database';
import { admin } from '@/config/firebase';
```

[📖 Detailed README](../src/config/README.md)

---

### 3. `src/controllers/` - Request Handlers

**Purpose:** Handle HTTP requests dan send responses.

```
controllers/
├── authController.ts         # Authentication endpoints
├── artworkController.ts      # Artwork management
├── contactController.ts      # Contact management
├── salesController.ts        # Sales pipeline operations
└── analyticsController.ts    # Analytics & reporting
```

**Responsibilities:**
- Extract data dari request (body, params, query)
- Call appropriate service functions
- Format dan send response
- Pass errors ke error handler

**Example:**
```typescript
export const getArtworks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.uid;
    const result = await artworkService.getAllArtworks({ userId, ...req.query });
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
```

[📖 Detailed README](../src/controllers/README.md)

---

### 4. `src/middlewares/` - Middleware Functions

**Purpose:** Process requests sebelum sampai ke controllers.

```
middlewares/
├── authMiddleware.ts         # JWT token validation
└── errorHandler.ts           # Centralized error handling
```

**Current Middlewares:**

**`authMiddleware.ts`** - Validates Firebase JWT tokens
- Extract token dari Authorization header
- Verify dengan Firebase Admin SDK
- Attach user info ke `req.user`

**`errorHandler.ts`** - Global error handler
- Catch all errors
- Format error response
- Log errors
- Send appropriate HTTP status codes

[📖 Detailed README](../src/middlewares/README.md)

---

### 5. `src/routes/` - API Endpoints

**Purpose:** Define URL endpoints dan map ke controllers.

```
routes/
├── authRoutes.ts             # /api/auth endpoints
├── artworkRoutes.ts          # /api/artworks endpoints
├── contactRoutes.ts          # /api/contacts endpoints
├── salesRoutes.ts            # /api/sales endpoints
└── analyticsRoutes.ts        # /api/analytics endpoints
```

**Route Structure:**
```typescript
// artworkRoutes.ts
router.get('/', authMiddleware, getArtworks);        // GET /api/artworks
router.post('/', authMiddleware, createArtwork);     // POST /api/artworks
router.get('/:id', authMiddleware, getArtworkById);  // GET /api/artworks/:id
router.put('/:id', authMiddleware, updateArtwork);   // PUT /api/artworks/:id
router.delete('/:id', authMiddleware, deleteArtwork); // DELETE /api/artworks/:id
```

[📖 Detailed README](../src/routes/README.md)

---

### 6. `src/services/` - Business Logic

**Purpose:** Implement business logic dan database operations.

```
services/
├── authService.ts            # User management logic
├── artworkService.ts         # Artwork business logic
├── contactService.ts         # Contact management logic
├── salesService.ts           # Sales pipeline logic
└── analyticsService.ts       # Analytics calculations
```

**Responsibilities:**
- Database queries (via Prisma)
- Business rule validation
- Data transformations
- Complex calculations
- Transaction management

**Example:**
```typescript
export const artworkService = {
  async getAllArtworks(params: { userId: string; page: number; limit: number }) {
    const { userId, page, limit } = params;
    const skip = (page - 1) * limit;

    const [artworks, total] = await Promise.all([
      prisma.artwork.findMany({ where: { userId }, skip, take: limit }),
      prisma.artwork.count({ where: { userId } })
    ]);

    return {
      data: artworks,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    };
  }
};
```

[📖 Detailed README](../src/services/README.md)

---

### 7. `src/types/` - TypeScript Types

**Purpose:** Type definitions untuk type safety.

```
types/
├── index.ts                  # Common types (ApiResponse, Pagination, etc)
├── artwork.types.ts          # Artwork-specific types
├── contact.types.ts          # Contact-specific types
├── sales.types.ts            # Sales-specific types
└── analytics.types.ts        # Analytics-specific types
```

**Common Types:**
```typescript
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: { message: string; details?: any };
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
```

[📖 Detailed README](../src/types/README.md)

---

### 8. `src/utils/` - Utility Functions

**Purpose:** Generic helper functions yang reusable.

```
utils/
├── logger.ts                 # Logging utilities
├── validator.ts              # Input validation
├── formatter.ts              # Data formatting
├── dateHelper.ts             # Date manipulation
├── fileHandler.ts            # File operations
└── errorUtils.ts             # Error handling helpers
```

**Examples:**
```typescript
// validator.ts
export const validateEmail = (email: string): boolean => { /* ... */ };

// formatter.ts
export const formatCurrency = (amount: number, currency: string): string => { /* ... */ };

// dateHelper.ts
export const addDays = (date: Date, days: number): Date => { /* ... */ };
```

[📖 Detailed README](../src/utils/README.md)

---

## 📁 prisma/ - Database Schema

**Purpose:** Database schema definition dan migrations.

```
prisma/
├── schema.prisma             # Database schema definition
└── migrations/               # Migration history (auto-generated)
```

**schema.prisma** berisi:
- Database connection (MySQL)
- 5 Models: User, Artwork, Contact, SalesDeal, Activity
- Relations between models
- Enums untuk status values

**Commands:**
```bash
npx prisma generate           # Generate Prisma Client
npx prisma migrate dev        # Create & run migration
npx prisma studio             # Open database GUI
```

[📖 Detailed Schema Documentation](./DATABASE_SCHEMA.md)

---

## 📁 docs/ - Documentation

**Purpose:** Project documentation untuk developers dan stakeholders.

```
docs/
├── SKPL_-_ArtConnect_1.4.txt      # Software Requirements Specification
├── ARCHITECTURE.md                # System architecture
├── PROJECT_STRUCTURE.md           # This file
├── API_DOCUMENTATION.md           # REST API documentation
├── DATABASE_SCHEMA.md             # Database schema details
├── TESTING_STRATEGY.md            # Testing approach
├── DEPLOYMENT.md                  # Deployment guide
├── GIT_STRATEGY.md                # Git workflow
└── AGILE_SCRUM_PLAN.md            # Agile methodology
```

---

## 🔄 Request Flow

```
1. Client (Frontend)
   ↓ HTTP Request
2. Express Server (index.ts)
   ↓ Middleware Chain
3. CORS Middleware
   ↓
4. JSON Parser Middleware
   ↓
5. Router (routes/)
   ↓
6. Auth Middleware (if protected route)
   ↓ Validate JWT & attach req.user
7. Controller (controllers/)
   ↓ Extract request data
8. Service (services/)
   ↓ Business logic & DB queries
9. Prisma ORM
   ↓ SQL queries
10. MySQL Database
    ↓ Return data
11. Service formats data
    ↓
12. Controller sends response
    ↓
13. Client receives response

(If error occurs anywhere → Error Handler Middleware)
```

---

## 📦 Dependencies Structure

### Production Dependencies
```
dependencies/
├── express              # Web framework
├── cors                 # CORS middleware
├── dotenv               # Environment variables
├── @prisma/client       # Database ORM
└── firebase-admin       # Firebase Auth validation
```

### Development Dependencies
```
devDependencies/
├── typescript           # TypeScript compiler
├── @types/*             # Type definitions
├── ts-node              # Run TypeScript directly
├── nodemon              # Auto-reload dev server
└── prisma               # Prisma CLI
```

---

## 🎯 Naming Conventions

### Files
- **PascalCase** for classes: `ApiError.ts`
- **camelCase** for utilities: `dateHelper.ts`
- **Descriptive names**: `authMiddleware.ts`, not `auth.ts`

### Folders
- **Plural lowercase**: `controllers/`, `services/`, `routes/`
- **Singular for config**: `config/`, not `configs/`

### Code
- **PascalCase** for interfaces/types: `ApiResponse`, `CreateArtworkDTO`
- **camelCase** for functions/variables: `getArtworks`, `userId`
- **UPPER_SNAKE_CASE** for constants: `MAX_FILE_SIZE`, `DEFAULT_PAGE_SIZE`

---

## ✅ Development Checklist

### Adding New Feature
```
1. [ ] Define types di src/types/
2. [ ] Create service functions di src/services/
3. [ ] Create controller handlers di src/controllers/
4. [ ] Define routes di src/routes/
5. [ ] Register routes di src/index.ts
6. [ ] Add validation if needed
7. [ ] Write tests
8. [ ] Update API documentation
```

### Modifying Database
```
1. [ ] Update prisma/schema.prisma
2. [ ] Run prisma migrate dev
3. [ ] Update related types
4. [ ] Update services using the model
5. [ ] Test the changes
```

---

## 🔗 Related Documentation

- [API Documentation](./API_DOCUMENTATION.md) - REST API endpoints
- [Database Schema](./DATABASE_SCHEMA.md) - Prisma models detail
- [Testing Strategy](./TESTING_STRATEGY.md) - How to test the application
- [Deployment Guide](./DEPLOYMENT.md) - How to deploy to production

---

## 📝 Notes

**Current Status:** 
- ✅ Base structure setup complete
- ✅ Database schema defined
- ✅ Middleware implemented
- ⏳ Controllers & Services - TODO
- ⏳ Routes - TODO
- ⏳ Testing - TODO

**Next Steps:**
1. Implement services layer (business logic)
2. Implement controllers (request handlers)
3. Define routes (API endpoints)
4. Write unit tests
5. Integration testing with frontend

---

**Maintained by:** ArtConnect Development Team  
**Questions?** Refer to individual README.md files in each folder for detailed information.
