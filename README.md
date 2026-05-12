# taskflow-api

A small Node.js/Express REST API for managing tasks.

## Getting started

```
npm install
cp .env.example .env
npm run dev
```

The server listens on `PORT` (default 3000).

## Endpoints

- `POST /auth/register` — create a user
- `POST /auth/login` — log in, returns a JWT
- `GET /tasks` — list tasks
- `POST /tasks` — create a task
- `PUT /tasks/:id` — update a task
- `DELETE /tasks/:id` — delete a task
