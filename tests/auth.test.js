const request = require('supertest');
const app = require('../src/app');

describe('auth', () => {
  it('registers a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'a@example.com', password: 'hunter2' });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
  });

  it('logs in an existing user', async () => {
    await request(app)
      .post('/auth/register')
      .send({ email: 'b@example.com', password: 'hunter2' });

    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'b@example.com', password: 'hunter2' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
