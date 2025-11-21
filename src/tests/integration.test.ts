import request from 'supertest';
import app from '../app';
import prisma from '../utils/prisma';

// Mock headers for development mode
const mockHeaders = {
  'Authorization': 'Bearer mock-token',
  'x-mock-user': 'true'
};

describe('Integration Tests', () => {

  beforeAll(async () => {
    // Clean DB before tests
    await prisma.activity.deleteMany();
    await prisma.salesDeal.deleteMany();
    await prisma.contact.deleteMany();
    await prisma.artwork.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Auth Module', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .set(mockHeaders)
        .send({
          email: 'test@example.com',
          name: 'Test Artist',
          photoUrl: 'https://example.com/photo.jpg'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('test@example.com');
    });

    it('should get user profile', async () => {
      const res = await request(app)
        .get('/api/auth/profile')
        .set(mockHeaders);

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe('Test Artist');
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

      expect(res.status).toBe(201);
      artworkId = res.body.data.id;
    });

    it('should list artworks', async () => {
      const res = await request(app)
        .get('/api/artworks')
        .set(mockHeaders);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
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

      expect(res.status).toBe(201);
      contactId = res.body.data.id;
    });

    it('should list contacts', async () => {
      const res = await request(app)
        .get('/api/contacts')
        .set(mockHeaders);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('Sales Module', () => {
    let dealId = '';
    let contactId = '';

    beforeAll(async () => {
      // Get a contact ID
      const c = await prisma.contact.findFirst();
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
