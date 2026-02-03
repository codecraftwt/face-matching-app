# Deploy Backend to Vercel

Deploy this Node.js + Express + MongoDB backend to Vercel so the React Native app can use it from anywhere (no PC IP or firewall).

## 1. Prerequisites

- [Vercel account](https://vercel.com/signup)
- MongoDB Atlas URI (already in your `.env` as `MONGO_URI`)
- [Vercel CLI](https://vercel.com/docs/cli) (optional): `npm i -g vercel`

## 2. Deploy from the `backend` folder

**Option A – Deploy with Vercel CLI**

```bash
cd backend
vercel
```

Follow the prompts (link to existing project or create new). When asked for env vars, add `MONGO_URI` (or add it in the dashboard later).

**Option B – Deploy from Git (recommended)**

1. Push the repo to GitHub (if not already).
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import your repository.
4. Set **Root Directory** to `backend` (important).
5. Add **Environment Variable**: `MONGO_URI` = your MongoDB connection string (e.g. from `.env`).
6. Deploy.

## 3. Set environment variable on Vercel

In the Vercel project: **Settings** → **Environment Variables**:

| Name      | Value                    | Environments |
|-----------|--------------------------|--------------|
| MONGO_URI | `mongodb+srv://...`      | Production, Preview |

Use the same value as in your local `backend/.env`.

## 4. Get your backend URL

After deploy, Vercel gives you a URL like:

- `https://face-attendance-backend-xxx.vercel.app`

Test it:

```bash
curl https://YOUR_VERCEL_URL.vercel.app/health
```

You should see: `{"ok":true,"db":"connected"}` (once MongoDB is connected).

## 5. Point the React Native app to Vercel

In the app, open **`src/config/api.ts`** and set the backend URL to your Vercel URL:

```ts
const PHYSICAL_DEVICE_BACKEND_URL = 'https://face-attendance-backend-xxx.vercel.app';
```

Use your real Vercel URL (no trailing slash). Remove or comment the old local IP URL.

Rebuild/run the app. Registration, attendance, and export will use the Vercel backend and MongoDB.

## API base URL summary

| Environment        | API base URL |
|--------------------|--------------|
| Local (emulator)   | `http://10.0.2.2:3000` (Android) or `http://localhost:3000` (iOS) |
| Physical device    | Your Vercel URL, e.g. `https://your-project.vercel.app` |
| Or local PC        | `http://YOUR_PC_IP:3000` (same Wi‑Fi + firewall rule) |

## Troubleshooting

- **502 / timeout:** Check Vercel function logs; ensure `MONGO_URI` is set and MongoDB Atlas allows connections from anywhere (or add Vercel IPs if you restrict).
- **CORS:** The backend already uses `cors()`; no change needed for the app.
- **Cold start:** First request after idle can be slower; later requests are fast.
