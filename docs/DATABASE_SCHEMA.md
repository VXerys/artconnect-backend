# Database Schema - ArtConnect Backend

**Document Version:** 1.0  
**Last Updated:** October 24, 2025  
**Database:** MySQL  
**ORM:** Prisma v6.18.0

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Entity Relationship Diagram](#entity-relationship-diagram)
3. [Models](#models)
4. [Relations](#relations)
5. [Enums](#enums)
6. [Indexes](#indexes)
7. [Migration Strategy](#migration-strategy)

---

## 🌐 Overview

Database schema untuk ArtConnect CRM dirancang untuk mengelola:
- **User Management** - Manajemen akun seniman
- **Artwork Inventory** - Katalog karya seni
- **Contact Management** - Database kontak profesional
- **Sales Pipeline** - Tracking penjualan
- **Activity Timeline** - Log aktivitas

### Database Technology Stack

| Component | Technology |
|-----------|-----------|
| Database | MySQL 8.0+ |
| ORM | Prisma 6.18.0 |
| Connection | Prisma Client |
| Migration Tool | Prisma Migrate |
| Schema Management | prisma/schema.prisma |

---

## 📊 Entity Relationship Diagram

```
┌─────────────┐
│    User     │
│ (Firebase)  │
└──────┬──────┘
       │
       │ 1:N
       │
       ├──────────────────┬────────────────┬─────────────────┐
       │                  │                │                 │
       ▼                  ▼                ▼                 ▼
┌──────────┐      ┌──────────┐    ┌──────────┐     ┌──────────┐
│ Artwork  │      │ Contact  │    │  Sales   │     │ Activity │
│          │      │          │    │  Deal    │     │          │
└────┬─────┘      └────┬─────┘    └────┬─────┘     └──────────┘
     │                 │               │
     │                 │               │
     │ 1:N             │ 1:N           │ 1:N
     │                 │               │
     └─────────────────┴───────────────┴──────────────┐
                                                       │
                                                       ▼
                                                ┌──────────┐
                                                │ Activity │
                                                │ (related)│
                                                └──────────┘
```

### Key Relations

1. **User → Artwork** (One-to-Many)
   - Satu user bisa punya banyak artwork
   
2. **User → Contact** (One-to-Many)
   - Satu user bisa punya banyak contact
   
3. **User → Activity** (One-to-Many)
   - User punya banyak activity log
   
4. **Artwork → SalesDeal** (One-to-Many)
   - Satu artwork bisa punya banyak sales deal
   
5. **Contact → SalesDeal** (One-to-Many)
   - Satu contact bisa terlibat di banyak deal
   
6. **SalesDeal → Activity** (One-to-Many)
   - Setiap deal punya activity timeline

---

## 📦 Models

### 1. User Model

**Purpose:** Menyimpan data user yang terintegrasi dengan Firebase Authentication

**Schema:**
```prisma
model User {
  id          String   @id @default(uuid())
  firebaseUid String   @unique
  email       String   @unique
  name        String
  photoUrl    String?
  role        UserRole @default(USER)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  artworks   Artwork[]
  contacts   Contact[]
  activities Activity[]

  @@index([email])
  @@index([firebaseUid])
  @@map("users")
}
```

**Fields Explanation:**

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | String | Primary key UUID | AUTO |
| firebaseUid | String | Firebase Auth UID | UNIQUE, NOT NULL |
| email | String | User email | UNIQUE, NOT NULL |
| name | String | Display name | NOT NULL |
| photoUrl | String? | Profile picture URL | NULLABLE |
| role | UserRole | User role (USER/ADMIN) | DEFAULT: USER |
| createdAt | DateTime | Record creation time | AUTO |
| updatedAt | DateTime | Last update time | AUTO |

**Relations:**
- Has many `Artwork`
- Has many `Contact`
- Has many `Activity`

**Indexes:**
- `email` - For fast lookup by email
- `firebaseUid` - For Firebase token validation

---

### 2. Artwork Model

**Purpose:** Katalog inventaris karya seni milik user

**Schema:**
```prisma
model Artwork {
  id          String        @id @default(uuid())
  title       String
  description String?       @db.Text
  artist      String
  year        Int?
  medium      String?
  dimensions  String?
  price       Float
  currency    String        @default("IDR")
  imageUrl    String?
  status      ArtworkStatus @default(AVAILABLE)
  category    String?
  tags        String[]
  userId      String
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  user       User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  salesDeals SalesDeal[]
  activities Activity[]

  @@index([userId])
  @@index([status])
  @@index([category])
  @@map("artworks")
}
```

**Fields Explanation:**

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | String | Primary key UUID | AUTO |
| title | String | Judul karya | NOT NULL |
| description | String? | Deskripsi lengkap | TEXT, NULLABLE |
| artist | String | Nama artis | NOT NULL |
| year | Int? | Tahun pembuatan | NULLABLE |
| medium | String? | Medium karya (e.g., Oil on Canvas) | NULLABLE |
| dimensions | String? | Ukuran (e.g., 60x80 cm) | NULLABLE |
| price | Float | Harga karya | NOT NULL |
| currency | String | Mata uang | DEFAULT: IDR |
| imageUrl | String? | URL gambar karya | NULLABLE |
| status | ArtworkStatus | Status availability | DEFAULT: AVAILABLE |
| category | String? | Kategori (e.g., Landscape) | NULLABLE |
| tags | String[] | Array tags untuk search | ARRAY |
| userId | String | Owner user ID | FOREIGN KEY |

**Relations:**
- Belongs to `User`
- Has many `SalesDeal`
- Has many `Activity`

**Indexes:**
- `userId` - For filtering by user
- `status` - For filtering by availability
- `category` - For filtering by category

**Business Rules:**
- Artwork harus punya title, artist, dan price
- Status default adalah AVAILABLE saat dibuat
- Ketika user dihapus, artwork juga dihapus (CASCADE)

---

### 3. Contact Model

**Purpose:** Database kontak profesional (kolektor, galeri, museum, dealer)

**Schema:**
```prisma
model Contact {
  id        String        @id @default(uuid())
  name      String
  email     String?
  phone     String?
  company   String?
  type      ContactType
  status    ContactStatus @default(ACTIVE)
  notes     String?       @db.Text
  tags      String[]
  userId    String
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt

  user       User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  salesDeals SalesDeal[]
  activities Activity[]

  @@index([userId])
  @@index([type])
  @@index([status])
  @@map("contacts")
}
```

**Fields Explanation:**

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | String | Primary key UUID | AUTO |
| name | String | Nama kontak | NOT NULL |
| email | String? | Email kontak | NULLABLE |
| phone | String? | Nomor telepon | NULLABLE |
| company | String? | Nama perusahaan/institusi | NULLABLE |
| type | ContactType | Tipe kontak | ENUM, NOT NULL |
| status | ContactStatus | Status kontak | DEFAULT: ACTIVE |
| notes | String? | Catatan tambahan | TEXT, NULLABLE |
| tags | String[] | Tags untuk kategorisasi | ARRAY |
| userId | String | Owner user ID | FOREIGN KEY |

**Relations:**
- Belongs to `User`
- Has many `SalesDeal`
- Has many `Activity`

**Indexes:**
- `userId` - For filtering by user
- `type` - For filtering by contact type
- `status` - For filtering by status

**Business Rules:**
- Contact harus punya name dan type
- Status default ACTIVE
- Type menentukan jenis relasi profesional

---

### 4. SalesDeal Model

**Purpose:** Tracking pipeline penjualan artwork

**Schema:**
```prisma
model SalesDeal {
  id                String     @id @default(uuid())
  title             String
  description       String?    @db.Text
  amount            Float
  currency          String     @default("IDR")
  stage             DealStage  @default(LEAD)
  probability       Int        @default(20)
  expectedCloseDate DateTime?
  closedDate        DateTime?
  userId            String
  contactId         String
  artworkId         String?
  createdAt         DateTime   @default(now())
  updatedAt         DateTime   @updatedAt

  user       User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  contact    Contact    @relation(fields: [contactId], references: [id])
  artwork    Artwork?   @relation(fields: [artworkId], references: [id])
  activities Activity[]

  @@index([userId])
  @@index([contactId])
  @@index([artworkId])
  @@index([stage])
  @@map("sales_deals")
}
```

**Fields Explanation:**

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | String | Primary key UUID | AUTO |
| title | String | Judul deal | NOT NULL |
| description | String? | Deskripsi deal | TEXT, NULLABLE |
| amount | Float | Nilai deal | NOT NULL |
| currency | String | Mata uang | DEFAULT: IDR |
| stage | DealStage | Tahap pipeline | DEFAULT: LEAD |
| probability | Int | % probabilitas closing | DEFAULT: 20 |
| expectedCloseDate | DateTime? | Target closing date | NULLABLE |
| closedDate | DateTime? | Actual closing date | NULLABLE |
| userId | String | Owner user ID | FOREIGN KEY |
| contactId | String | Related contact | FOREIGN KEY |
| artworkId | String? | Related artwork | FOREIGN KEY, NULLABLE |

**Relations:**
- Belongs to `User`
- Belongs to `Contact` (buyer/collector)
- Optionally belongs to `Artwork`
- Has many `Activity`

**Indexes:**
- `userId` - For filtering by user
- `contactId` - For filtering by contact
- `artworkId` - For filtering by artwork
- `stage` - For pipeline view

**Business Rules:**
- Deal harus punya title, amount, dan contact
- Artwork optional (bisa general negotiation)
- Probability berubah sesuai stage movement
- closedDate diisi saat stage CLOSED_WON/CLOSED_LOST

---

### 5. Activity Model

**Purpose:** Timeline log untuk tracking semua aktivitas

**Schema:**
```prisma
model Activity {
  id          String       @id @default(uuid())
  type        ActivityType
  title       String
  description String?      @db.Text
  userId      String
  contactId   String?
  artworkId   String?
  dealId      String?
  createdAt   DateTime     @default(now())

  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  contact   Contact?   @relation(fields: [contactId], references: [id])
  artwork   Artwork?   @relation(fields: [artworkId], references: [id])
  deal      SalesDeal? @relation(fields: [dealId], references: [id])

  @@index([userId])
  @@index([type])
  @@index([createdAt])
  @@map("activities")
}
```

**Fields Explanation:**

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | String | Primary key UUID | AUTO |
| type | ActivityType | Jenis aktivitas | ENUM, NOT NULL |
| title | String | Judul activity | NOT NULL |
| description | String? | Detail activity | TEXT, NULLABLE |
| userId | String | User yang melakukan | FOREIGN KEY |
| contactId | String? | Related contact | FOREIGN KEY, NULLABLE |
| artworkId | String? | Related artwork | FOREIGN KEY, NULLABLE |
| dealId | String? | Related deal | FOREIGN KEY, NULLABLE |
| createdAt | DateTime | Waktu activity | AUTO |

**Relations:**
- Belongs to `User`
- Optionally belongs to `Contact`
- Optionally belongs to `Artwork`
- Optionally belongs to `SalesDeal`

**Indexes:**
- `userId` - For user's activity feed
- `type` - For filtering by activity type
- `createdAt` - For chronological sorting

**Business Rules:**
- Activity selalu punya type dan title
- Bisa relate ke contact/artwork/deal secara optional
- Tidak ada updatedAt (immutable log)

---

## 🔗 Relations

### Relation Summary

| Parent | Child | Type | Cascade Delete |
|--------|-------|------|----------------|
| User | Artwork | One-to-Many | YES |
| User | Contact | One-to-Many | YES |
| User | SalesDeal | One-to-Many | YES |
| User | Activity | One-to-Many | YES |
| Artwork | SalesDeal | One-to-Many | NO |
| Contact | SalesDeal | One-to-Many | NO |
| SalesDeal | Activity | One-to-Many | NO |

### Cascade Delete Rules

**When User is deleted:**
- ✅ All Artworks deleted
- ✅ All Contacts deleted
- ✅ All SalesDeals deleted
- ✅ All Activities deleted

**When Artwork is deleted:**
- ❌ SalesDeals NOT deleted (artworkId becomes NULL)

**When Contact is deleted:**
- ❌ SalesDeals NOT deleted (prevents data loss)

**When SalesDeal is deleted:**
- ❌ Activities NOT deleted (keeps history)

---

## 📐 Enums

### UserRole

```prisma
enum UserRole {
  USER
  ADMIN
}
```

| Value | Description |
|-------|-------------|
| USER | Regular artist user |
| ADMIN | Admin with full access |

---

### ArtworkStatus

```prisma
enum ArtworkStatus {
  AVAILABLE
  RESERVED
  SOLD
  ON_LOAN
}
```

| Value | Description |
|-------|-------------|
| AVAILABLE | Ready for sale |
| RESERVED | Reserved for buyer |
| SOLD | Already sold |
| ON_LOAN | Dipinjamkan ke galeri/museum |

---

### ContactType

```prisma
enum ContactType {
  COLLECTOR
  GALLERY
  MUSEUM
  DEALER
  OTHER
}
```

| Value | Description |
|-------|-------------|
| COLLECTOR | Private art collector |
| GALLERY | Art gallery |
| MUSEUM | Museum institution |
| DEALER | Art dealer |
| OTHER | Other professional contact |

---

### ContactStatus

```prisma
enum ContactStatus {
  ACTIVE
  INACTIVE
  LEAD
}
```

| Value | Description |
|-------|-------------|
| ACTIVE | Active relationship |
| INACTIVE | No longer active |
| LEAD | Potential contact |

---

### DealStage

```prisma
enum DealStage {
  LEAD
  QUALIFIED
  PROPOSAL
  NEGOTIATION
  CLOSED_WON
  CLOSED_LOST
}
```

| Value | Probability | Description |
|-------|-------------|-------------|
| LEAD | 20% | Initial interest |
| QUALIFIED | 40% | Serious buyer |
| PROPOSAL | 60% | Proposal sent |
| NEGOTIATION | 80% | Price negotiation |
| CLOSED_WON | 100% | Deal won |
| CLOSED_LOST | 0% | Deal lost |

---

### ActivityType

```prisma
enum ActivityType {
  ARTWORK_CREATED
  ARTWORK_UPDATED
  ARTWORK_SOLD
  CONTACT_CREATED
  CONTACT_UPDATED
  MEETING_SCHEDULED
  MEETING_COMPLETED
  DEAL_CREATED
  DEAL_STAGE_CHANGED
  DEAL_WON
  DEAL_LOST
  NOTE_ADDED
  EMAIL_SENT
}
```

**Categories:**

**Artwork Activities:**
- ARTWORK_CREATED
- ARTWORK_UPDATED
- ARTWORK_SOLD

**Contact Activities:**
- CONTACT_CREATED
- CONTACT_UPDATED
- MEETING_SCHEDULED
- MEETING_COMPLETED

**Deal Activities:**
- DEAL_CREATED
- DEAL_STAGE_CHANGED
- DEAL_WON
- DEAL_LOST

**Communication:**
- NOTE_ADDED
- EMAIL_SENT

---

## 🔍 Indexes

### Index Strategy

Indexes digunakan untuk optimize query performance pada fields yang sering di-filter atau di-sort.

### User Indexes

```prisma
@@index([email])
@@index([firebaseUid])
```

**Reason:**
- `email` - Login lookup
- `firebaseUid` - Token validation

### Artwork Indexes

```prisma
@@index([userId])
@@index([status])
@@index([category])
```

**Reason:**
- `userId` - Get user's artworks
- `status` - Filter by availability
- `category` - Filter by category

### Contact Indexes

```prisma
@@index([userId])
@@index([type])
@@index([status])
```

**Reason:**
- `userId` - Get user's contacts
- `type` - Filter by contact type
- `status` - Filter by status

### SalesDeal Indexes

```prisma
@@index([userId])
@@index([contactId])
@@index([artworkId])
@@index([stage])
```

**Reason:**
- `userId` - Get user's deals
- `contactId` - Get deals for contact
- `artworkId` - Get deals for artwork
- `stage` - Pipeline view

### Activity Indexes

```prisma
@@index([userId])
@@index([type])
@@index([createdAt])
```

**Reason:**
- `userId` - User activity feed
- `type` - Filter by activity type
- `createdAt` - Chronological sorting

---

## 🚀 Migration Strategy

### Development Workflow

```bash
# 1. Update schema.prisma
# Edit prisma/schema.prisma

# 2. Create migration
npx prisma migrate dev --name add_new_feature

# 3. Prisma will:
#    - Create migration SQL
#    - Apply to database
#    - Generate Prisma Client
```

### Migration Commands

```bash
# Create migration
npx prisma migrate dev --name migration_name

# Apply migrations in production
npx prisma migrate deploy

# Check migration status
npx prisma migrate status

# Reset database (DEV ONLY!)
npx prisma migrate reset

# Generate Prisma Client only
npx prisma generate
```

### Migration Best Practices

1. **Descriptive Names**
   ```bash
   ✅ npx prisma migrate dev --name add_artwork_category
   ❌ npx prisma migrate dev --name update
   ```

2. **Small Migrations**
   - Satu migration = satu logical change
   - Easier to rollback
   - Easier to review

3. **Test Migrations**
   - Test di development first
   - Review generated SQL
   - Check data integrity

4. **Production Safety**
   - Always backup database
   - Use `migrate deploy` in production
   - Never use `migrate reset` in production

### Rollback Strategy

Prisma doesn't support automatic rollback. Manual steps:

```sql
-- 1. Backup database
mysqldump -u user -p database > backup.sql

-- 2. Revert schema changes
-- Edit schema.prisma to previous state

-- 3. Create new migration
npx prisma migrate dev --name revert_previous_change
```

---

## 📊 Database Size Estimates

### Expected Growth

| Table | Records/User | Size per Record | Total/User |
|-------|--------------|-----------------|------------|
| User | 1 | ~500 bytes | 500 B |
| Artwork | 50 | ~2 KB | 100 KB |
| Contact | 30 | ~1 KB | 30 KB |
| SalesDeal | 20 | ~800 bytes | 16 KB |
| Activity | 200 | ~600 bytes | 120 KB |
| **TOTAL** | | | **~266 KB/user** |

**For 1000 users:** ~266 MB  
**For 10,000 users:** ~2.66 GB

### Storage Considerations

- **Images:** Stored in Cloud Storage (not in database)
- **Text Fields:** Description fields use TEXT type
- **Arrays:** Tags stored as JSON array

---

## 🔧 Database Optimization Tips

### Query Optimization

```typescript
// ✅ GOOD - Use indexes
const artworks = await prisma.artwork.findMany({
  where: { userId: userId, status: 'AVAILABLE' }
});

// ✅ GOOD - Select specific fields
const artworks = await prisma.artwork.findMany({
  select: { id: true, title: true, price: true }
});

// ❌ BAD - N+1 query problem
const users = await prisma.user.findMany();
for (const user of users) {
  const artworks = await prisma.artwork.findMany({
    where: { userId: user.id }
  });
}

// ✅ GOOD - Use include/relation loading
const users = await prisma.user.findMany({
  include: { artworks: true }
});
```

### Connection Pooling

```env
# .env
DATABASE_URL="mysql://user:password@localhost:3306/artconnect?connection_limit=10"
```

---

## 📚 Related Documentation

- [API Documentation](./API_DOCUMENTATION.md) - REST API endpoints
- [Project Structure](./PROJECT_STRUCTURE.md) - Code organization
- [Testing Strategy](./TESTING_STRATEGY.md) - Testing approach

---

**Maintained by:** ArtConnect Development Team  
**Last Updated:** October 24, 2025  
**Schema Version:** 1.0
