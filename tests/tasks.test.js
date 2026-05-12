const request = require('supertest');
const app = require('../src/app');

async function registerAndLogin(email) {
  const res = await request(app)
    .post('/auth/register')
    .send({ email, password: 'hunter2' });
  return res.body.token;
}

describe('tasks', () => {
  it('creates a task for the authenticated user', async () => {
    const token = await registerAndLogin('tasks1@example.com');

    const res = await request(app)
      .post('/tasks')
      .set('Authorization', 'Bearer ' + token)
      .send({ title: 'write tests', description: 'cover the happy path' });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('write tests');
  });

  it('lists tasks', async () => {
    const token = await registerAndLogin('tasks2@example.com');

    const res = await request(app)
      .get('/tasks')
      .set('Authorization', 'Bearer ' + token);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
