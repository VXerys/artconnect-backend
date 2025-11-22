# Database Schema - ArtConnect Backend

**Document Version:** 1.1
**Last Updated:** November 2025
**Database:** PostgreSQL (Supabase)
**ORM:** Prisma

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
- **User Management** - Manajemen akun seniman (Synced with Firebase Auth)
- **Artwork Inventory** - Katalog karya seni
- **Contact Management** - Database kontak profesional
- **Sales Pipeline** - Tracking penjualan
- **Activity Timeline** - Log aktivitas

### Database Technology Stack

| Component | Technology |
|-----------|-----------|
| Database | PostgreSQL (Supabase) |
| ORM | Prisma |
| Connection | Transaction Pool & Session Mode |
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

---

## 📦 Models

### 1. User Model

**Purpose:** Menyimpan data user yang terintegrasi dengan Firebase Authentication. **ID User di DB == Firebase UID.**

**Schema:**
```prisma
model User {
  id          String   @id // Matches Firebase UID
  email       String   @unique
  name        String
  photoUrl    String?
  role        UserRole @default(USER)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  artworks   Artwork[]
  contacts   Contact[]
  activities Activity[]
  salesDeals SalesDeal[]

  @@index([email])
  @@map("users")
}
```

**Fields Explanation:**

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | String | Firebase UID | PK, NOT NULL |
| email | String | User email | UNIQUE, NOT NULL |
| name | String | Display name | NOT NULL |
| photoUrl | String? | Profile picture URL | NULLABLE |
| role | UserRole | User role (USER/ADMIN) | DEFAULT: USER |

---

### 2. Artwork Model

**Purpose:** Katalog inventaris karya seni milik user

**Schema:**
```prisma
model Artwork {
  id          String        @id @default(uuid())
  title       String
  description String?
  artist      String
  year        Int?
  medium      String?
  dimensions  String?
  price       Float
  currency    String        @default("IDR")
  imageUrl    String?
  status      ArtworkStatus @default(AVAILABLE)
  category    String?
  tags        Json?         // Stored as JSON array
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

---

### 3. Contact Model

**Purpose:** Database kontak profesional

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
  notes     String?
  tags      Json?
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

---

### 4. SalesDeal Model

**Purpose:** Tracking pipeline penjualan artwork

**Schema:**
```prisma
model SalesDeal {
  id                String     @id @default(uuid())
  title             String
  description       String?
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

---

### 5. Activity Model

**Purpose:** Timeline log untuk tracking semua aktivitas

**Schema:**
```prisma
model Activity {
  id          String       @id @default(uuid())
  type        ActivityType
  title       String
  description String?
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

---

## 🔗 Relations

### Relation Summary

| Parent | Child | Type | Cascade Delete |
|--------|-------|------|----------------|
| User | Artwork | One-to-Many | YES |
| User | Contact | One-to-Many | YES |
| User | SalesDeal | One-to-Many | YES |
| User | Activity | One-to-Many | YES |

---

## 📐 Enums

(Sama seperti sebelumnya: `UserRole`, `ArtworkStatus`, `ContactType`, `ContactStatus`, `DealStage`, `ActivityType` didukung penuh oleh Prisma + PostgreSQL).

---

## 🚀 Migration Strategy

### Using Supabase (PostgreSQL)

Karena kita menggunakan Supabase dengan Connection Pooling (`pgbouncer`), migrasi harus dijalankan menggunakan **Direct Connection**.

**Configuration:**
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL") // Pool connection (port 6543)
  directUrl = env("DIRECT_URL")   // Direct connection (port 5432)
}
```

**Commands:**
```bash
# Update schema dan apply ke DB (gunakan directUrl otomatis)
npx prisma migrate dev --name change_name
```

---

**Maintained by:** ArtConnect Development Team  
**Last Updated:** November 2025
**Schema Version:** 2.0 (PostgreSQL Migration)
