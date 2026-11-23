# Notespace

Notespace is a React notes app with an Express and MongoDB backend. Users can register and sign in, create notes, favorite them, filter favorites, and delete notes.

## Run locally

Requirements: Node.js and MongoDB.

1. Create a `.env` file in this directory with `MONGODB_URI=<your MongoDB connection string>` and `JWT_SECRET=<a long random secret>`. The older `mongourl` variable remains supported for local setup.
2. In this directory, run `npm install` and `npm run server`.
3. In `frontend/`, run `npm install` and `npm run dev`.
4. Open the local URL printed by Vite.

The Vite dev server forwards `/api` requests to the backend at `http://localhost:8080`.

## API

- `POST /api/user/register` and `POST /api/user/login`
- `GET /api/dashboard`
- `GET` and `POST /api/notes`
- `PATCH /api/notes/:id` (edit note fields or toggle `favorite`)
- `DELETE /api/notes/:id`

Notes are scoped to the authenticated user. Send the JWT in the `Authorization` header.

## Deployment

Deploy the backend to Render and the frontend to Vercel. See [DEPLOYMENT.md](./DEPLOYMENT.md) for environment variables and setup.
