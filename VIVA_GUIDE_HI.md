# Notespace: Beginner Viva Guide (Hindi / Hinglish)

Notespace ek full-stack notes app hai. React frontend, Express backend aur MongoDB database ke saath kaam karta hai. User account bana kar login kar sakta hai, notes save kar sakta hai, favorites filter kar sakta hai aur notes delete kar sakta hai.

## Project structure

```text
notesapp/
├── app.js                    # Express app aur API routes
├── server.js                 # Local server startup
├── db.js                     # MongoDB connection
├── model/
│   ├── user.model.js
│   └── note.model.js
├── routes/user.route.js      # Registration aur login
├── middlewere/
│   ├── auth.middlewere.js    # JWT authentication
│   └── jwt.secret.js
├── frontend/
│   ├── src/App.jsx           # React screens aur notes UI
│   ├── src/api.js            # Frontend API calls
│   ├── vite.config.js        # Local API proxy
│   └── vercel.json           # Frontend route fallback
├── render.yaml               # Render backend service
└── DEPLOYMENT.md
```

`middlewere` folder ka spelling source code mein isi tarah hai. Backend UI se alag hai: browser MongoDB se seedha connect nahi karta; requests Express API ko bhejta hai.

## Request ka flow

```text
React form → src/api.js → /api endpoint → Express app.js
→ auth middleware (private routes) → Mongoose model → MongoDB
```

Login par backend JWT deta hai. Private notes requests mein frontend token `Authorization` header mein bhejta hai. Backend decoded user ID ke hisaab se notes read/write karta hai, isliye ek user doosre user ke notes access nahi kar sakta.

## Important API routes

- `POST /api/user/register`: password hash karke account banata hai.
- `POST /api/user/login`: credentials verify karke JWT return karta hai.
- `GET /api/notes`: current user ke notes list karta hai.
- `POST /api/notes`: title aur content wala note save karta hai.
- `PATCH /api/notes/:id`: note ko favorite/unfavorite ya update karta hai.
- `DELETE /api/notes/:id`: current user ka note delete karta hai.

`/api/dashboard` ek protected endpoint hai jo session verify karta hai.

## Local setup

1. Project root mein `.env` file banayein. `MONGODB_URI` aur `JWT_SECRET` set karein. `.env` ko Git mein commit na karein.
2. Backend ke liye `npm install` aur `npm run server` chalayein.
3. `frontend/` directory mein `npm install` aur `npm run dev` chalayein.
4. Vite URL browser mein kholein. Development proxy `/api` ko backend port 8080 par forward karta hai.

## Deployment

Backend Render par aur frontend Vercel par deploy hote hain. Render par `MONGODB_URI`, `JWT_SECRET`, aur frontend origin ke liye `FRONTEND_URL` set karein. Vercel frontend par `VITE_API_BASE_URL` ko Render service origin par set karein. Detailed steps [DEPLOYMENT.md](./DEPLOYMENT.md) mein hain.
