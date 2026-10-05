# Vercel Deployment Guide

## Quick Deploy

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite for frontend

2. **Configure Environment Variables** in Vercel Dashboard:
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.vercel`

3. **Deploy**
   - Click Deploy
   - Vercel will build frontend (Vite) and deploy Python API as serverless functions

## Required Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SECRET_KEY` | Yes | Django secret key |
| `DEBUG` | No | Set to `False` in production |
| `DATABASE_URL` | Yes | PostgreSQL connection string (Vercel Postgres, Neon, Supabase) |
| `VERCEL_URL` | Auto | Set automatically by Vercel |
| `CUSTOM_DOMAINS` | No | Comma-separated custom domains |

## Database Setup

**Option 1: Vercel Postgres (Recommended)**
1. In Vercel Dashboard → Storage → Create Database → Postgres
2. Copy `DATABASE_URL` to environment variables

**Option 2: Neon / Supabase / Railway**
1. Create PostgreSQL database
2. Get connection string
2. Add as `DATABASE_URL`

## Post-Deploy Commands

After first deploy, run migrations:
```bash
# In Vercel CLI or GitHub Actions
vercel exec -- python manage.py migrate
vercel exec -- python manage.py collectstatic --noinput
vercel exec -- python manage.py createsuperuser
```

## Local Development

```bash
# Frontend
cd kyrgyzstan-travel
npm run dev

# Backend (requires PostgreSQL)
cd backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your settings
python manage.py migrate
python manage.py runserver
```

## Project Structure

```
tour_site_kg/
├── api/                    # Vercel serverless functions (Python)
│   ├── index.py           # WSGI entry point
│   └── requirements.txt
├── backend/               # Django project
│   ├── config/
│   │   ├── settings.py          # Local dev settings
│   │   └── settings_vercel.py   # Vercel production settings
│   └── apps/
├── kyrgyzstan-travel/     # Frontend (Vite + React)
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── vercel.json            # Vercel configuration
├── .env.vercel            # Environment variables template
└── docker-compose.yml     # Local Docker development
```

## Vercel Configuration (vercel.json)

- Frontend: Vite build → `kyrgyzstan-travel/dist`
- API: Python serverless functions in `/api`
- Rewrites: `/api/*` → Python functions, `/*` → `index.html` (SPA)

## Database Migrations on Vercel

Use Vercel CLI or GitHub Actions:

```bash
# Run migrations
vercel exec -- python manage.py migrate

# Collect static files
vercel exec -- python manage.py collectstatic --noinput

# Create superuser
vercel exec -- python manage.py createsuperuser
```

## Custom Domain

1. Add domain in Vercel Dashboard → Settings → Domains
2. Add domain to `CUSTOM_DOMAINS` env var (comma-separated)
3. Update DNS records as instructed by Vercel

## Troubleshooting

**API 404**: Check `vercel.json` rewrites and `/api` function routes
**Database connection**: Verify `DATABASE_URL` format and SSL mode
**CORS errors**: Check `CORS_ALLOWED_ORIGINS` includes your Vercel domain
**Static files**: Run `collectstatic` after deploy