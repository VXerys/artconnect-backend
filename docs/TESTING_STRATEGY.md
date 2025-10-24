# Testing Strategy - ArtConnect Backend

**Document Version:** 1.0  
**Last Updated:** October 24, 2025  
**Testing Framework:** Jest / Vitest  
**Coverage Target:** 80%+

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Testing Stack](#testing-stack)
3. [Test Structure](#test-structure)
4. [Unit Testing](#unit-testing)
5. [Integration Testing](#integration-testing)
6. [E2E Testing](#e2e-testing)
7. [Mocking Strategy](#mocking-strategy)
8. [Coverage Requirements](#coverage-requirements)
9. [CI/CD Integration](#cicd-integration)

---

## 🌐 Overview

Testing strategy untuk ArtConnect Backend mencakup 3 level testing:

1. **Unit Tests** - Test individual functions/methods
2. **Integration Tests** - Test API endpoints dengan database
3. **E2E Tests** - Test complete user workflows

### Testing Philosophy

- **Write tests first** (TDD approach recommended)
- **Test behavior, not implementation**
- **Keep tests simple and readable**
- **Mock external dependencies**
- **Fast feedback loop**

---

## 🛠️ Testing Stack

### Recommended Setup: Jest

```json
{
  "devDependencies": {
    "jest": "^29.7.0",
    "@types/jest": "^29.5.11",
    "ts-jest": "^29.1.1",
    "supertest": "^6.3.3",
    "@types/supertest": "^6.0.2"
  }
}
```

### Alternative Setup: Vitest

```json
{
  "devDependencies": {
    "vitest": "^1.1.0",
    "@vitest/ui": "^1.1.0",
    "supertest": "^6.3.3"
  }
}
```

### Installation Commands

```bash
# Jest setup
npm install --save-dev jest @types/jest ts-jest supertest @types/supertest

# Vitest setup
npm install --save-dev vitest @vitest/ui supertest
```

---

## 📁 Test Structure

### Directory Layout

```
artconnect-backend/
├── src/
│   ├── services/
│   │   ├── artworkService.ts
│   │   └── __tests__/
│   │       └── artworkService.test.ts
│   ├── controllers/
│   │   ├── artworkController.ts
│   │   └── __tests__/
│   │       └── artworkController.test.ts
│   └── utils/
│       ├── validator.ts
│       └── __tests__/
│           └── validator.test.ts
├── tests/
│   ├── integration/
│   │   ├── artwork.test.ts
│   │   ├── contact.test.ts
│   │   └── sales.test.ts
│   ├── e2e/
│   │   └── user-journey.test.ts
│   ├── helpers/
│   │   ├── testDatabase.ts
│   │   └── testFactory.ts
│   └── setup.ts
├── jest.config.js
└── package.json
```

### File Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Unit Test | `*.test.ts` | `validator.test.ts` |
| Integration Test | `*.test.ts` | `artwork-api.test.ts` |
| E2E Test | `*.e2e.test.ts` | `user-journey.e2e.test.ts` |
| Test Helper | `test*.ts` | `testFactory.ts` |

---

## 🧪 Unit Testing

### What to Unit Test

- ✅ Services (business logic)
- ✅ Utility functions
- ✅ Validators
- ✅ Formatters
- ✅ Middlewares
- ❌ Simple getters/setters
- ❌ Prisma models

### Service Unit Test Example

**File:** `src/services/__tests__/artworkService.test.ts`

```typescript
import { artworkService } from '../artworkService';
import { prisma } from '../../config/database';

// Mock Prisma
jest.mock('../../config/database', () => ({
  prisma: {
    artwork: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe('ArtworkService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createArtwork', () => {
    it('should create artwork with valid data', async () => {
      // Arrange
      const mockArtwork = {
        id: 'artwork-1',
        title: 'Test Artwork',
        artist: 'Test Artist',
        price: 1000000,
        status: 'AVAILABLE',
        userId: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.artwork.create as jest.Mock).mockResolvedValue(mockArtwork);

      const artworkData = {
        title: 'Test Artwork',
        artist: 'Test Artist',
        price: 1000000,
        userId: 'user-1',
      };

      // Act
      const result = await artworkService.createArtwork(artworkData);

      // Assert
      expect(result).toEqual(mockArtwork);
      expect(prisma.artwork.create).toHaveBeenCalledWith({
        data: artworkData,
      });
    });

    it('should throw error if title is empty', async () => {
      // Arrange
      const artworkData = {
        title: '',
        artist: 'Test Artist',
        price: 1000000,
        userId: 'user-1',
      };

      // Act & Assert
      await expect(
        artworkService.createArtwork(artworkData)
      ).rejects.toThrow('Title is required');
    });

    it('should throw error if price is negative', async () => {
      // Arrange
      const artworkData = {
        title: 'Test Artwork',
        artist: 'Test Artist',
        price: -1000,
        userId: 'user-1',
      };

      // Act & Assert
      await expect(
        artworkService.createArtwork(artworkData)
      ).rejects.toThrow('Price must be positive');
    });
  });

  describe('getArtworksByUser', () => {
    it('should return user artworks with pagination', async () => {
      // Arrange
      const mockArtworks = [
        { id: '1', title: 'Art 1', userId: 'user-1' },
        { id: '2', title: 'Art 2', userId: 'user-1' },
      ];

      (prisma.artwork.findMany as jest.Mock).mockResolvedValue(mockArtworks);

      // Act
      const result = await artworkService.getArtworksByUser('user-1', {
        page: 1,
        limit: 10,
      });

      // Assert
      expect(result).toEqual(mockArtworks);
      expect(prisma.artwork.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        skip: 0,
        take: 10,
      });
    });
  });
});
```

### Utility Function Test Example

**File:** `src/utils/__tests__/validator.test.ts`

```typescript
import { validateEmail, validatePrice, validatePhoneNumber } from '../validator';

describe('Validator Utils', () => {
  describe('validateEmail', () => {
    it('should return true for valid email', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.id')).toBe(true);
    });

    it('should return false for invalid email', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
    });
  });

  describe('validatePrice', () => {
    it('should return true for valid price', () => {
      expect(validatePrice(1000)).toBe(true);
      expect(validatePrice(0.01)).toBe(true);
    });

    it('should return false for invalid price', () => {
      expect(validatePrice(-100)).toBe(false);
      expect(validatePrice(0)).toBe(false);
      expect(validatePrice(NaN)).toBe(false);
    });
  });

  describe('validatePhoneNumber', () => {
    it('should return true for valid Indonesian phone', () => {
      expect(validatePhoneNumber('+628123456789')).toBe(true);
      expect(validatePhoneNumber('08123456789')).toBe(true);
    });

    it('should return false for invalid phone', () => {
      expect(validatePhoneNumber('123')).toBe(false);
      expect(validatePhoneNumber('abcd')).toBe(false);
    });
  });
});
```

### Middleware Test Example

**File:** `src/middlewares/__tests__/authMiddleware.test.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../authMiddleware';
import { admin } from '../../config/firebase';

jest.mock('../../config/firebase');

describe('Auth Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  it('should call next() with valid token', async () => {
    // Arrange
    const mockDecodedToken = {
      uid: 'firebase-uid',
      email: 'test@example.com',
    };

    mockRequest.headers = {
      authorization: 'Bearer valid-token',
    };

    (admin.auth().verifyIdToken as jest.Mock).mockResolvedValue(mockDecodedToken);

    // Act
    await authMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    // Assert
    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.user).toEqual(mockDecodedToken);
  });

  it('should return 401 if no token provided', async () => {
    // Arrange
    mockRequest.headers = {};

    // Act
    await authMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      error: { message: 'No token provided' },
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should return 401 if token is invalid', async () => {
    // Arrange
    mockRequest.headers = {
      authorization: 'Bearer invalid-token',
    };

    (admin.auth().verifyIdToken as jest.Mock).mockRejectedValue(
      new Error('Invalid token')
    );

    // Act
    await authMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(nextFunction).not.toHaveBeenCalled();
  });
});
```

---

## 🔗 Integration Testing

### What to Integration Test

- ✅ API endpoints (full request/response cycle)
- ✅ Database operations
- ✅ Middleware chain
- ✅ Error handling
- ✅ Authentication flow

### Test Database Setup

**File:** `tests/helpers/testDatabase.ts`

```typescript
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL,
    },
  },
});

export async function setupTestDatabase() {
  // Push schema to test database
  execSync('npx prisma migrate deploy', {
    env: {
      ...process.env,
      DATABASE_URL: process.env.TEST_DATABASE_URL,
    },
  });
}

export async function cleanupTestDatabase() {
  const tables = ['Activity', 'SalesDeal', 'Artwork', 'Contact', 'User'];
  
  for (const table of tables) {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${table} CASCADE;`);
  }
}

export async function closeTestDatabase() {
  await prisma.$disconnect();
}

export { prisma };
```

### API Integration Test Example

**File:** `tests/integration/artwork.test.ts`

```typescript
import request from 'supertest';
import { app } from '../../src/index';
import { prisma, setupTestDatabase, cleanupTestDatabase } from '../helpers/testDatabase';

describe('Artwork API Integration Tests', () => {
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    await setupTestDatabase();
    
    // Create test user
    const user = await prisma.user.create({
      data: {
        firebaseUid: 'test-uid',
        email: 'test@example.com',
        name: 'Test User',
      },
    });
    userId = user.id;

    // Mock Firebase token (you'll need to implement this)
    authToken = 'mock-firebase-token';
  });

  afterEach(async () => {
    await cleanupTestDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/artworks', () => {
    it('should create artwork with valid data', async () => {
      const artworkData = {
        title: 'Test Artwork',
        artist: 'Test Artist',
        price: 1000000,
        category: 'Landscape',
      };

      const response = await request(app)
        .post('/api/artworks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(artworkData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        title: artworkData.title,
        artist: artworkData.artist,
        price: artworkData.price,
        status: 'AVAILABLE',
      });
      expect(response.body.data.id).toBeDefined();
    });

    it('should return 400 for missing required fields', async () => {
      const invalidData = {
        title: 'Test Artwork',
        // Missing artist and price
      };

      const response = await request(app)
        .post('/api/artworks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('required');
    });

    it('should return 401 without auth token', async () => {
      const artworkData = {
        title: 'Test Artwork',
        artist: 'Test Artist',
        price: 1000000,
      };

      await request(app)
        .post('/api/artworks')
        .send(artworkData)
        .expect(401);
    });
  });

  describe('GET /api/artworks', () => {
    beforeEach(async () => {
      // Create test artworks
      await prisma.artwork.createMany({
        data: [
          {
            title: 'Artwork 1',
            artist: 'Artist 1',
            price: 1000000,
            status: 'AVAILABLE',
            userId,
          },
          {
            title: 'Artwork 2',
            artist: 'Artist 2',
            price: 2000000,
            status: 'SOLD',
            userId,
          },
        ],
      });
    });

    it('should return all user artworks', async () => {
      const response = await request(app)
        .get('/api/artworks')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination).toBeDefined();
    });

    it('should filter artworks by status', async () => {
      const response = await request(app)
        .get('/api/artworks?status=AVAILABLE')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].status).toBe('AVAILABLE');
    });

    it('should paginate results', async () => {
      const response = await request(app)
        .get('/api/artworks?page=1&limit=1')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.pagination).toMatchObject({
        page: 1,
        limit: 1,
        total: 2,
        totalPages: 2,
      });
    });
  });

  describe('PUT /api/artworks/:id', () => {
    let artworkId: string;

    beforeEach(async () => {
      const artwork = await prisma.artwork.create({
        data: {
          title: 'Original Title',
          artist: 'Original Artist',
          price: 1000000,
          userId,
        },
      });
      artworkId = artwork.id;
    });

    it('should update artwork', async () => {
      const updateData = {
        title: 'Updated Title',
        price: 1500000,
      };

      const response = await request(app)
        .put(`/api/artworks/${artworkId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.data.title).toBe('Updated Title');
      expect(response.body.data.price).toBe(1500000);
      expect(response.body.data.artist).toBe('Original Artist'); // Unchanged
    });

    it('should return 404 for non-existent artwork', async () => {
      await request(app)
        .put('/api/artworks/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated' })
        .expect(404);
    });
  });

  describe('DELETE /api/artworks/:id', () => {
    let artworkId: string;

    beforeEach(async () => {
      const artwork = await prisma.artwork.create({
        data: {
          title: 'To Delete',
          artist: 'Artist',
          price: 1000000,
          userId,
        },
      });
      artworkId = artwork.id;
    });

    it('should delete artwork', async () => {
      await request(app)
        .delete(`/api/artworks/${artworkId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const deleted = await prisma.artwork.findUnique({
        where: { id: artworkId },
      });
      expect(deleted).toBeNull();
    });
  });
});
```

---

## 🌍 E2E Testing

### User Journey Test Example

**File:** `tests/e2e/user-journey.e2e.test.ts`

```typescript
import request from 'supertest';
import { app } from '../../src/index';
import { setupTestDatabase, cleanupTestDatabase } from '../helpers/testDatabase';

describe('E2E: Complete User Journey', () => {
  let authToken: string;
  let artworkId: string;
  let contactId: string;
  let dealId: string;

  beforeAll(async () => {
    await setupTestDatabase();
    authToken = 'mock-token'; // Get from Firebase Auth mock
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  it('should complete full CRM workflow', async () => {
    // Step 1: Create artwork
    const artworkResponse = await request(app)
      .post('/api/artworks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Beautiful Landscape',
        artist: 'John Doe',
        price: 5000000,
        category: 'Landscape',
      })
      .expect(201);

    artworkId = artworkResponse.body.data.id;
    expect(artworkId).toBeDefined();

    // Step 2: Create contact (potential buyer)
    const contactResponse = await request(app)
      .post('/api/contacts')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Art Collector',
        email: 'collector@example.com',
        type: 'COLLECTOR',
      })
      .expect(201);

    contactId = contactResponse.body.data.id;

    // Step 3: Create sales deal
    const dealResponse = await request(app)
      .post('/api/sales')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Landscape Sale',
        amount: 5000000,
        stage: 'LEAD',
        contactId,
        artworkId,
      })
      .expect(201);

    dealId = dealResponse.body.data.id;

    // Step 4: Move deal through pipeline
    await request(app)
      .put(`/api/sales/${dealId}/stage`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ stage: 'QUALIFIED', probability: 40 })
      .expect(200);

    await request(app)
      .put(`/api/sales/${dealId}/stage`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ stage: 'NEGOTIATION', probability: 80 })
      .expect(200);

    // Step 5: Close deal and update artwork
    await request(app)
      .put(`/api/sales/${dealId}/stage`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ stage: 'CLOSED_WON', probability: 100 })
      .expect(200);

    await request(app)
      .put(`/api/artworks/${artworkId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ status: 'SOLD' })
      .expect(200);

    // Step 6: Verify analytics updated
    const analyticsResponse = await request(app)
      .get('/api/analytics/dashboard')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(analyticsResponse.body.data.totalRevenue).toBe(5000000);
    expect(analyticsResponse.body.data.totalDeals).toBeGreaterThan(0);
  });
});
```

---

## 🎭 Mocking Strategy

### Mock Prisma

```typescript
// tests/helpers/prismaMock.ts
import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

export const prismaMock: DeepMockProxy<PrismaClient> = mockDeep<PrismaClient>();

beforeEach(() => {
  mockReset(prismaMock);
});
```

### Mock Firebase Admin

```typescript
// tests/helpers/firebaseMock.ts
jest.mock('firebase-admin', () => ({
  auth: jest.fn(() => ({
    verifyIdToken: jest.fn().mockResolvedValue({
      uid: 'test-uid',
      email: 'test@example.com',
    }),
  })),
  credential: {
    cert: jest.fn(),
  },
  initializeApp: jest.fn(),
}));
```

### Test Factory Pattern

```typescript
// tests/helpers/testFactory.ts
import { faker } from '@faker-js/faker';

export const createMockUser = (overrides = {}) => ({
  id: faker.string.uuid(),
  firebaseUid: faker.string.uuid(),
  email: faker.internet.email(),
  name: faker.person.fullName(),
  role: 'USER',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createMockArtwork = (overrides = {}) => ({
  id: faker.string.uuid(),
  title: faker.lorem.words(3),
  artist: faker.person.fullName(),
  price: faker.number.int({ min: 100000, max: 10000000 }),
  status: 'AVAILABLE',
  userId: faker.string.uuid(),
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createMockContact = (overrides = {}) => ({
  id: faker.string.uuid(),
  name: faker.company.name(),
  email: faker.internet.email(),
  type: 'GALLERY',
  status: 'ACTIVE',
  userId: faker.string.uuid(),
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});
```

---

## 📊 Coverage Requirements

### Target Coverage

| Category | Target | Priority |
|----------|--------|----------|
| Overall | 80%+ | High |
| Services | 90%+ | Critical |
| Controllers | 80%+ | High |
| Utils | 90%+ | High |
| Middlewares | 85%+ | High |
| Routes | 70%+ | Medium |

### Jest Coverage Configuration

```javascript
// jest.config.js
module.exports = {
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/types/**',
    '!src/index.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    './src/services/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
};
```

### Run Coverage Report

```bash
# Generate coverage report
npm run test:coverage

# View HTML report
open coverage/lcov-report/index.html
```

---

## 🚀 CI/CD Integration

### GitHub Actions Example

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: testpassword
          MYSQL_DATABASE: artconnect_test
        ports:
          - 3306:3306
        options: >-
          --health-cmd="mysqladmin ping"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=3

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run Prisma migrations
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: mysql://root:testpassword@localhost:3306/artconnect_test

      - name: Run tests
        run: npm run test:coverage
        env:
          DATABASE_URL: mysql://root:testpassword@localhost:3306/artconnect_test
          FIREBASE_PROJECT_ID: test-project
          FIREBASE_PRIVATE_KEY: ${{ secrets.FIREBASE_PRIVATE_KEY }}
          FIREBASE_CLIENT_EMAIL: ${{ secrets.FIREBASE_CLIENT_EMAIL }}

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
```

### NPM Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:integration": "jest --testPathPattern=tests/integration",
    "test:e2e": "jest --testPathPattern=tests/e2e",
    "test:unit": "jest --testPathPattern=src"
  }
}
```

---

## 🐛 Debugging Tests

### VS Code Debug Configuration

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Jest: Current File",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": [
        "${relativeFile}",
        "--config",
        "jest.config.js"
      ],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### Debug Single Test

```typescript
// Use .only to run single test
it.only('should test this specific case', () => {
  // Test code
});

// Use .skip to skip test
it.skip('should skip this test', () => {
  // Test code
});
```

---

## 📚 Best Practices

### 1. AAA Pattern (Arrange-Act-Assert)

```typescript
it('should create artwork', async () => {
  // Arrange - Setup test data
  const artworkData = { title: 'Test', artist: 'Artist', price: 1000 };
  
  // Act - Execute the function
  const result = await artworkService.create(artworkData);
  
  // Assert - Verify the result
  expect(result.title).toBe('Test');
});
```

### 2. Test Independence

```typescript
// ❌ BAD - Tests depend on each other
let artworkId;

it('creates artwork', async () => {
  const artwork = await createArtwork();
  artworkId = artwork.id;
});

it('updates artwork', async () => {
  await updateArtwork(artworkId); // Depends on previous test
});

// ✅ GOOD - Independent tests
it('creates artwork', async () => {
  const artwork = await createArtwork();
  expect(artwork.id).toBeDefined();
});

it('updates artwork', async () => {
  const artwork = await createArtwork(); // Setup own data
  await updateArtwork(artwork.id);
});
```

### 3. Descriptive Test Names

```typescript
// ❌ BAD
it('test 1', () => {});
it('works', () => {});

// ✅ GOOD
it('should create artwork with valid data', () => {});
it('should throw error when price is negative', () => {});
```

### 4. Test What Matters

```typescript
// ❌ BAD - Testing implementation details
expect(service['privateMethod']).toHaveBeenCalled();

// ✅ GOOD - Testing behavior
expect(result.status).toBe('AVAILABLE');
```

---

## 📚 Related Documentation

- [API Documentation](./API_DOCUMENTATION.md) - API endpoints to test
- [Database Schema](./DATABASE_SCHEMA.md) - Test data structure
- [Project Structure](./PROJECT_STRUCTURE.md) - Where to place tests

---

**Maintained by:** ArtConnect Development Team  
**Last Updated:** October 24, 2025  
**Testing Framework:** Jest 29.7.0
