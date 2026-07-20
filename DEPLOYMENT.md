# Deploying GrapeTask LMS Frontend (Vercel)

The frontend is a Next.js app — a perfect fit for **Vercel**. Deploy the backend first
(see the backend repo's `DEPLOYMENT.md`) so you have its public URL.

## Steps

1. Go to https://vercel.com → sign in with GitHub → **Add New… → Project** →
   import `GrapeTask_LMS_Frontend`. Vercel auto-detects Next.js (Framework: Next.js,
   Build: `next build`, Output: `.next`) — leave the defaults.

2. **Environment Variable** (Project → Settings → Environment Variables, or during import):
   - `NEXT_PUBLIC_API_URL` = your backend REST base, ending in `/api`, e.g.
     `https://grapetask-backend-production.up.railway.app/api`
   Add it for **Production** (and Preview/Development if you want).

3. Click **Deploy**. You'll get a URL like `https://grapetask-lms-frontend.vercel.app`.

4. **Wire CORS back:** copy the Vercel URL into the backend's `FRONTEND_URL` env var on Railway
   (no trailing slash) and redeploy the backend, so the browser can call the API.

5. Open the Vercel URL → `/login` → sign in with a seeded account
   (`admin@grapetask.com` / `Password123!`) or register.

## Redeploys
Push to `main` → Vercel auto-builds and redeploys. Changing `NEXT_PUBLIC_API_URL` needs a redeploy
(env vars are baked in at build time).

## Notes
- `NEXT_PUBLIC_API_URL` must be reachable over HTTPS from the browser. Both the Railway backend and
  the Vercel frontend are HTTPS, so mixed-content is not an issue.
- Uploaded images (thumbnails/avatars) load directly from the backend's `/uploads/...` URLs.
