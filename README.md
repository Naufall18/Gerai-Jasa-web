# Gerai Jasa Web Dashboard

React 18 + TypeScript admin & vendor dashboard untuk **Gerai Jasa** — platform booking multi-vendor (salon, klinik, bengkel) untuk pasar Indonesia.

**Desain:** Pine & Amber (#1E6F5C primary, #F2A444 accent)

---

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS v4** (styling)
- **shadcn/ui** (component library)
- **TanStack Query** (server state)
- **Zustand** (client state)
- **React Hook Form** + **Zod** (form validation)
- **React Router** (routing)
- **Recharts** (charts)
- **Lucide React** (icons)
- **date-fns** (date utilities)

---

## Fitur

### Super Admin Dashboard (`/admin/*`)
- **Dashboard** — Statistik (total booking, revenue, vendor, user), grafik tren booking
- **Vendors** — Tabel vendor dengan search/filter, approve/suspend
- **Bookings** — Semua booking dengan filter status, vendor, kategori
- **Categories** — CRUD kategori
- **Users** — Manajemen user

### Vendor Dashboard (`/vendor/*`)
- **Dashboard** — Booking hari ini, revenue bulanan, pending confirmations
- **Bookings** — List booking dengan tab (pending/confirmed/completed/cancelled), filter status
- **Calendar** — Kalender booking dengan date range, dot indikator per status
- **Services** — CRUD layanan (nama, harga, durasi, active toggle)
- **Schedule** — Form jadwal mingguan (open/close time, day off)
- **Reviews** — List ulasan dengan fitur balas
- **Profile** — Edit profil, upload foto bisnis
- **Payouts** — Riwayat payout

---

## Struktur Folder

```
src/
├── api/                        # Axios instance + interceptor
├── components/
│   ├── ui/                     # shadcn/ui (Button, Card, Badge, dll)
│   └── layout/                 # AppShell, Sidebar
├── features/
│   ├── dashboard/pages/        # Halaman admin
│   │   ├── DashboardPage.tsx
│   │   ├── VendorsPage.tsx
│   │   ├── BookingsPage.tsx
│   │   ├── CategoriesPage.tsx
│   │   └── UsersPage.tsx
│   └── vendors/pages/          # Halaman vendor
│       ├── DashboardPage.tsx
│       ├── BookingsPage.tsx
│       ├── CalendarPage.tsx
│       ├── ServicesPage.tsx
│       ├── SchedulePage.tsx
│       ├── ReviewsPage.tsx
│       ├── ProfilePage.tsx
│       └── PayoutsPage.tsx
├── hooks/                      # Custom hooks
├── lib/                        # Utility, constants, Zod schemas
├── stores/                     # Zustand stores
├── types/                      # TypeScript types
├── router/                     # React Router config
├── App.tsx
├── main.tsx
└── index.css                   # Tailwind + custom styles
```

---

## Setup

```bash
git clone https://github.com/Naufall18/Gerai-Jasa-web.git
cd Gerai-Jasa-web

npm install
cp .env.example .env

# Atur VITE_API_URL ke backend API
npm run dev        # http://localhost:5173
npm run build      # Production build
npm run preview    # Preview build
```

### Environment Variables

```env
VITE_API_URL=http://localhost:8000/api/v1
```

---

## Scripts

| Command | Deskripsi |
|---------|-----------|
| `npm run dev` | Dev server (port 5173) |
| `npm run build` | Build production |
| `npm run preview` | Preview build |
| `npm run lint` | ESLint |

---

## Deployment (Vercel)

Hubungkan repo `Gerai-Jasa-web` ke Vercel:

1. Import repo di [vercel.com](https://vercel.com)
2. Set `VITE_API_URL` ke production backend URL
3. Deploy — Vercel auto-detect Vite

Atau via CLI:
```bash
npm i -g vercel
vercel --prod
```

---

## Repositori Terkait

- **Backend API**: [Gerai-Jasa-backend](https://github.com/Naufall18/Gerai-Jasa-backend)
- **Mobile App**: [Gerai-Jasa-mobile](https://github.com/Naufall18/Gerai-Jasa-mobile)
- **Fullstack**: [Gerai-Jasa](https://github.com/Naufall18/Gerai-Jasa)

---

## Lisensi

MIT
