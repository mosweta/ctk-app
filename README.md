# Christ the King Catholic Parish — Official Website

A modern, highly optimized, and secure full-stack web application built for Christ the King Catholic Parish in Embakasi, Nairobi. 

**Live Site:** [christthekingembakasi.top](https://christthekingembakasi.top)

**Lighthouse - desktop score:** <img width="721" height="91" alt="image" src="https://github.com/user-attachments/assets/eea68095-deba-4ec5-807f-b098a00b8b0a" />

**Lighthouse - mobile score:** <img width="721" height="92" alt="image" src="https://github.com/user-attachments/assets/ccecffb2-e44b-4976-840e-d9b1af60179b" />

*Note: Mobile performance scores reflect a simulated slow 4G connection and budget device CPU. The site is fully optimized with WebP images and code-splitting to ensure fast delivery on all devices.*

## 🏆 Performance & Audits
This project was built with security and accessibility as first-class citizens.
*   **SEO:** 100/100 (Lighthouse)
*   **Accessibility:** 100/100 (Lighthouse)
*   **Best Practices:** 100/100 (Lighthouse)
*   **Desktop Performance:** 96/100 (Lighthouse)

## 🏗️ Architecture
The application is decoupled into multiple layers to ensure speed, security, and scalability:
1.  **Frontend (Client):** React + Vite, hosted on Cloudflare Workers.
2.  **Backend (API):** Node.js + Express, hosted on Render.
3.  **Database & Auth:** Supabase (PostgreSQL).
4.  **Caching Layer:** Upstash Redis (Serverless). 
5.  **Email Delivery:** Resend.

### Security First Approach
Unlike standard AI-generated prototypes, this codebase was explicitly hardened:
*   **Row Level Security (RLS):** The Supabase database is fully locked down. Public users can only `SELECT` published data. `INSERT`/`UPDATE`/`DELETE` operations are restricted to `authenticated` admins or the `service_role` backend.
*   **Secure File Uploads:** Browsers are **never** allowed to upload directly to Supabase Storage. All images are sent via `FormData` to the Express backend, validated with `multer` (size & MIME type), and uploaded securely using the `service_role` key.
*   **XSS Protection:** Rich text from the bulletin editor is sanitized on the backend using `sanitize-html` before hitting the database, and again on the frontend using `DOMPurify`.
*   **Rate Limiting & CAPTCHA:** Public forms (Contact) are protected by `express-rate-limit` and Google reCAPTCHA v2.

### Performance & Scalability
This application was architected to handle high-traffic spikes (e.g., 3,000+ concurrent parishioners during parish events) on a low-cost infrastructure:
*   **Redis Caching:** High-traffic read endpoints (Events, Bulletins, Gallery) are cached in Upstash Redis for 6 hours. This reduces database load by 99%, serving JSON payloads in ~2ms instead of hitting Supabase on every request.
*   **Cache Busting:** Admin mutations (Create/Update/Delete) automatically clear the relevant Redis cache keys. This ensures the public site updates instantly without waiting for the TTL to expire.
*   **Frontend Code Splitting:** The React bundle is split using `React.lazy()`. Public visitors never download the Admin Dashboard code.
*   **Image Optimization:** All assets are converted to WebP and aggressively compressed (reducing the initial payload from ~40MB to ~1.5MB).

## 🚀 Key Features
*   **Public Website:** Dynamic Mass times, Parish History, Clergy directory, Photo Gallery, and a full interactive Events Calendar.
*   **Daily Readings:** Integrates with the Evangelizo API to serve the Catholic Mass readings of the day, cached in Supabase for 6 hours to prevent API rate limits.
*   **Parish Bulletins:** A custom rich-text editor (Tiptap) that allows the parish secretary to draft structured weekly bulletins with complex mass animation tables. Includes bilingual support (English/Kiswahili).
*   **Admin Dashboard:** A secure, authenticated portal for managing events, bulletins, staff, and livestreams without touching a single line of code.
*   **Dark Mode:** Full theme support (Light/Dark/System) using semantic CSS variables and Tailwind CSS.

## 💻 Tech Stack
*   **Frontend:** React 19, Vite, Tailwind CSS v4, Framer Motion, Lucide Icons, Tiptap.
*   **Backend:** Node.js, Express, Joi (validation), Multer (uploads), Resend (email).
*   **Infrastructure:** Cloudflare, Render, Supabase.
*   **Tooling:** ESLint, Prettier, Repomix.

## 🛠️ Local Development

### Prerequisites
*   Node.js (v20+)
*   A Supabase Project
*   A Resend Account (for contact forms)

### 1. Clone the repository
```bash
git clone https://github.com/mosweta/ctk-app.git
cd ctk-app
```
### 2. Setup the Backend
```bash
cd backend
npm install
cp .env.example .env
# Fill in your Supabase keys, Resend API key, and reCAPTCHA secret in .env
npm run dev
```
### 3. Setup the Frontend
```bash
# In a new terminal, from the root directory
npm install
cp .env.example .env
# Fill in VITE_API_URL, VITE_SUPABASE_URL, etc.
npm run dev
```

## 📦 Deployment
- Frontend: Built via npm run build and deployed to Cloudflare Workers (npx wrangler deploy).

- Backend: Automatically deploys to Render on push to the main branch.

