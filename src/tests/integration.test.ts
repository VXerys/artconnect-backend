import request from 'supertest';
import app from '../app';
import prisma from '../utils/prisma';

// Mock headers for development mode
// Corresponds to the mock logic in src/middlewares/auth.ts
const mockHeaders = {
  'Authorization': 'Bearer mock-token',
  'x-mock-user': 'true'
};

const mockUser = {
  uid: 'mock-user-uid',
  email: 'mock@example.com',
  name: 'Mock User',
  photoUrl: 'https://example.com/photo.jpg'
};

describe('Integration Tests', () => {

  beforeAll(async () => {
    // Clean DB before tests
    await prisma.activity.deleteMany();
    await prisma.salesDeal.deleteMany();
    await prisma.contact.deleteMany();
    await prisma.artwork.deleteMany();
    await prisma.user.deleteMany();

    // Ensure Mock User exists for tests (since we switched to User ID = Firebase UID)
    // The auth middleware in mock mode says req.user.uid = 'mock-user-uid'.
    // We need to sync this user first or ensure it exists.
    // The `syncUser` endpoint or direct DB creation can do this.
    await prisma.user.create({
      data: {
        id: mockUser.uid,
        email: mockUser.email,
        name: mockUser.name,
        photoUrl: mockUser.photoUrl,
        role: 'USER'
      }
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Auth Module', () => {
    it('should sync/login user', async () => {
      const res = await request(app)
        .post('/api/auth/sync')
        .set(mockHeaders); // Middleware sets req.user to mockUser

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe(mockUser.email);
    });

    it('should get user profile', async () => {
      const res = await request(app)
        .get('/api/auth/profile')
        .set(mockHeaders);

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe(mockUser.name);
    });
  });

  describe('Artwork Module', () => {
    let artworkId = '';

    it('should create an artwork', async () => {
      const res = await request(app)
        .post('/api/artworks')
        .set(mockHeaders)
        .send({
          title: 'Test Artwork',
          artist: 'Test Artist',
          price: 1000,
          category: 'Abstract',
          tags: ['test']
        });

      if (res.status !== 201) {
          console.error('Create Artwork Error:', res.body);
      }
      expect(res.status).toBe(201);
      artworkId = res.body.data.id;
    });

    it('should list artworks', async () => {
      const res = await request(app)
        .get('/api/artworks')
        .set(mockHeaders);

      expect(res.status).toBe(200);
      expect(res.body.data.data.length).toBeGreaterThan(0); // Note: paginated response structure
    });

    it('should update an artwork', async () => {
      const res = await request(app)
        .put(`/api/artworks/${artworkId}`)
        .set(mockHeaders)
        .send({ price: 2000 });

      expect(res.status).toBe(200);
      expect(res.body.data.price).toBe(2000);
    });
  });

  describe('Contact Module', () => {
    let contactId = '';

    it('should create a contact', async () => {
      const res = await request(app)
        .post('/api/contacts')
        .set(mockHeaders)
        .send({
          name: 'Test Collector',
          type: 'COLLECTOR',
          email: 'collector@test.com'
        });

      if (res.status !== 201) console.error(res.body);
      expect(res.status).toBe(201);
      contactId = res.body.data.id;
    });

    it('should list contacts', async () => {
      const res = await request(app)
        .get('/api/contacts')
        .set(mockHeaders);

      expect(res.status).toBe(200);
      expect(res.body.data.data.length).toBeGreaterThan(0);
    });
  });

  describe('Sales Module', () => {
    let dealId = '';
    let contactId = '';

    beforeAll(async () => {
      // Get a contact ID
      const c = await prisma.contact.findFirst({ where: { userId: mockUser.uid } });
      contactId = c?.id || '';
    });

    it('should create a deal', async () => {
      const res = await request(app)
        .post('/api/sales')
        .set(mockHeaders)
        .send({
          title: 'Big Sale',
          amount: 5000,
          contactId: contactId,
          stage: 'LEAD'
        });

      if (res.status !== 201) console.error(res.body);
      expect(res.status).toBe(201);
      dealId = res.body.data.id;
    });

    it('should update deal stage', async () => {
      const res = await request(app)
        .put(`/api/sales/${dealId}/stage`)
        .set(mockHeaders)
        .send({
          stage: 'QUALIFIED',
          probability: 40
        });

      expect(res.status).toBe(200);
      expect(res.body.data.stage).toBe('QUALIFIED');
    });
  });

  describe('Analytics Module', () => {
    it('should get dashboard metrics', async () => {
      const res = await request(app)
        .get('/api/analytics/dashboard')
        .set(mockHeaders);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('totalArtworks');
      expect(res.body.data).toHaveProperty('totalRevenue');
    });
  });

});
