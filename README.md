<div align="center">

# 🖥️ Gerai Jasa — Web Dashboard

**Admin & vendor dashboard for the Gerai Jasa booking platform**
<br/>
Built with React + TypeScript — clean, minimal, data-dense (Linear / Vercel inspired).

<p>
  <img src="https://img.shields.io/badge/status-Selesai-brightgreen?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/license-MIT-1E6F5C?style=for-the-badge" alt="License" />
</p>

</div>

---

## 📖 Overview

The **Gerai Jasa Web Dashboard** is the control center for the platform. It provides two role-based experiences from one codebase: a **Super Admin** dashboard to oversee the whole marketplace, and a **Vendor** dashboard for business owners to manage their services, schedule, and bookings.

---

## 🧱 Tech Stack

| Area | Technology |
|------|------------|
| **Core** | React · TypeScript · Vite |
| **Styling** | Tailwind CSS · shadcn/ui (New York style) |
| **Server State** | TanStack Query |
| **Client State** | Zustand |
| **Forms** | React Hook Form + Zod |
| **Charts** | Recharts |
| **Icons / Dates** | Lucide React · date-fns |

---

## ✨ Features

### 🛡️ Super Admin Dashboard — `/admin/*`
- 📊 **Dashboard** — stats cards (bookings, revenue, vendors, users), booking-trend chart, recent bookings
- 🏪 **Vendors** — management table with search/filter, approve/suspend actions, status badges
- 📋 **Bookings** — all bookings with filters (status, date range, vendor, category)
- 📁 **Categories** — CRUD with icon upload
- 👥 **Users** — user management table

### 🏬 Vendor Dashboard — `/vendor/*`
- 📊 **Dashboard** — today's bookings, monthly revenue, pending confirmations, upcoming bookings
- 📋 **Bookings** — tabs (pending / confirmed / completed / cancelled), confirm/reject actions
- 📅 **Calendar** — booked slots per day
- 🛠️ **Services** — CRUD (name, price, duration, active toggle)
- ⏰ **Schedule** — weekly open/close times per day, day-off toggle
- ⭐ **Reviews** — list with reply feature
- 👤 **Profile** — business info & photo uploads
- 💰 **Payouts** — payout history

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary | Indigo `#6366F1` |
| Background | `#F4F3FF` (light lavender) |
| Sidebar | `#0F0D1A` (dark indigo-black) |
| Font | Inter |
| Style | Clean, minimal, data-dense |

---

## 🗂️ Project Structure

```
src/
├── api/                 # Axios instance + API calls
├── components/
│   ├── ui/              # shadcn/ui components
│   └── layout/          # AppShell, Sidebar
├── features/
│   ├── dashboard/pages/ # Admin pages
│   └── vendors/pages/   # Vendor pages
├── hooks/               # Custom hooks
├── lib/                 # Utils, constants, Zod schemas
├── stores/              # Zustand stores
├── types/               # TypeScript types (models.ts, api.ts)
├── router/              # Router config
├── App.tsx              # Root component
└── main.tsx             # Entry point
```

---

## 🚀 Getting Started

```bash
# Clone
git clone https://github.com/Naufall18/Gerai-Jasa-web.git
cd Gerai-Jasa-web

# Install dependencies
npm install

# Environment
cp .env.example .env
# → set VITE_API_URL to point to your backend

# Development (port 5173)
npm run dev

# Production build + preview
npm run build
npm run preview
```

### Environment Variables

```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_PUSHER_APP_KEY=
VITE_PUSHER_HOST=localhost
VITE_PUSHER_PORT=6001
VITE_MIDTRANS_CLIENT_KEY=
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 🧩 Part of the Gerai Jasa Platform

| Repository | Stack | Role |
|------------|-------|------|
| [Gerai-Jasa-backend](https://github.com/Naufall18/Gerai-Jasa-backend) | Laravel 11 | REST API & booking engine |
| **Gerai-Jasa-web** *(this repo)* | React + TypeScript | Admin & vendor dashboard |
| [Gerai-Jasa-mobile](https://github.com/Naufall18/Gerai-Jasa-mobile) | Flutter | Customer app |

---

## 📄 License

Released under the **MIT License**.

<div align="center">
<br/>
Built by <a href="https://github.com/Naufall18">Naufal Dwi Arifianto</a> · <a href="https://naufall18.github.io/portofolio/">Portfolio</a>
</div>
