# Deployment

Deploy the backend to Render and the frontend to Vercel as separate services.

## Backend on Render

1. Connect the repository in Render and create a Blueprint using `render.yaml`. If the repository root is the `notesapp` folder, use that as the Blueprint root; otherwise point Render to this folder.
2. Set `MONGODB_URI` to the MongoDB Atlas connection string in the Render environment. Configure Atlas Network Access to allow connections from Render.
3. After the frontend is deployed, set `FRONTEND_URL` to its exact origin, such as `https://your-notes-app.vercel.app`. Add any preview origins you want to allow as comma-separated values.
4. Deploy. The health endpoint is `/api`; the API listens on Render's `PORT`.

The Blueprint generates `JWT_SECRET`. Keep it private and do not commit `.env` or production credentials.

## Frontend on Vercel

1. Create a Vercel project using the same repository, with **Root Directory** set to `notesapp/frontend` (or `frontend` if `notesapp` is the repository root).
2. Set `VITE_API_BASE_URL` to the Render service origin without a trailing slash (for example, `https://notesapp-api.onrender.com`).
3. Build with `npm run build`; Vercel's Vite preset uses `dist` as the output directory.

The frontend's `vercel.json` sends client-side routes back to `index.html`. The Vite development server proxies `/api` to the local backend on port 8080.
