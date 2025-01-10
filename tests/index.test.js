import request from 'supertest';
import server from '../server.js';

describe('Crypto API', () => {
  describe('GET /', () => {
    it('should return 200 OK', async () => {
      const res = await request(server).get('/');
      expect(res.status).toBe(200);
    });
  });

  // Test the /GET stats route
  describe('/GET stats', () => {
    it('should get the latest stats', async () => {
      const res = await request(server).get('/stats');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body).toHaveProperty('price');
      expect(res.body).toHaveProperty('marketCap');
      expect(res.body).toHaveProperty('24hChange');
    });
  });

  // Test the /GET deviation route
  describe('/GET deviation', () => {
    it('should get the deviation', async () => {
      const res = await request(server).get('/deviation');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body).toHaveProperty('deviation');
    });
  });
});
