<div align="center">
  <br/>
  <h1>🌐 Gerai Jasa — Web Dashboard</h1>
  <p>
    <strong>React 18 + TypeScript</strong>
    <br/>
    Dashboard Admin & Vendor untuk platform booking multi-vendor
  </p>

  <p>
    <a href="#">
      <img src="https://img.shields.io/badge/status-selesai-brightgreen?style=flat-square&color=%231E6F5C" alt="Status"/>
    </a>
    <a href="https://reactjs.org">
      <img src="https://img.shields.io/badge/React-18-%2361DAFB?style=flat-square&logo=react" alt="React"/>
    </a>
    <a href="https://www.typescriptlang.org">
      <img src="https://img.shields.io/badge/TypeScript-5-%233178C6?style=flat-square&logo=typescript" alt="TypeScript"/>
    </a>
    <a href="https://vitejs.dev">
      <img src="https://img.shields.io/badge/Vite-6-%23646CFF?style=flat-square&logo=vite" alt="Vite"/>
    </a>
    <a href="https://tailwindcss.com">
      <img src="https://img.shields.io/badge/Tailwind-v4-%2306B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind"/>
    </a>
  </p>

  <br/>
</div>

---

## 📋 Daftar Isi

- [Tentang](#-tentang)
- [Tech Stack](#-tech-stack)
- [Fitur Lengkap](#-fitur-lengkap)
- [Struktur](#-struktur)
- [Setup](#-setup)
- [Design System](#-design-system)
- [Scripts](#-scripts)
- [Panduan Role](#-panduan-role)
- [Repositori Terkait](#-repositori-terkait)
- [Lisensi](#-lisensi)

---

## 🎯 Tentang

Web Dashboard untuk **Gerai Jasa** — platform booking multi-vendor. Menyediakan antarmuka untuk **Super Admin** mengelola seluruh platform dan **Vendor** mengelola bisnis mereka.

**✅ Status: Production Ready** — Semua fitur telah diimplementasikan dan siap digunakan.

---

## 🛠️ Tech Stack

| Kategori | Teknologi | Kegunaan |
|----------|-----------|----------|
| **Framework** | React 18 + TypeScript | UI development |
| **Build** | Vite 6 | Fast HMR & bundling |
| **Styling** | Tailwind CSS v4 | Utility-first CSS |
| **Components** | shadcn/ui | Accessible UI library |
| **Server State** | TanStack Query v5 | Data fetching & caching |
| **Client State** | Zustand | Global state management |
| **Form** | React Hook Form + Zod | Form validation |
| **Routing** | React Router v6 | Navigation & guards |
| **Charts** | Recharts | Data visualization |
| **Icons** | Lucide React | Icon library |
| **Dates** | date-fns | Date formatting |
| **HTTP** | Axios | API client |

---

## ✨ Fitur Lengkap

### 🛡️ Super Admin Dashboard

| Fitur | Rute | Status |
|-------|------|--------|
| Dashboard dengan statistik & grafik | `/admin` | ✅ |
| Grafik tren booking (7 hari) | `/admin` | ✅ |
| Manajemen vendor (approve, suspend) | `/admin/vendors` | ✅ |
| Manajemen booking (filter, search) | `/admin/bookings` | ✅ |
| CRUD kategori | `/admin/categories` | ✅ |
| Manajemen user | `/admin/users` | ✅ |

### 🏪 Vendor Dashboard

| Fitur | Rute | Status |
|-------|------|--------|
| Dashboard statistik (hari ini, bulan ini) | `/vendor` | ✅ |
| Daftar booking dengan tab status | `/vendor/bookings` | ✅ |
| Filter booking by status (pending/confirmed/completed/cancelled) | `/vendor/bookings` | ✅ |
| Kalender booking dengan dot indicator | `/vendor/calendar` | ✅ |
| CRUD layanan (nama, harga, durasi, toggle aktif) | `/vendor/services` | ✅ |
| Atur jadwal mingguan (buka/tutup, day off) | `/vendor/schedule` | ✅ |
| Regenerasi slot otomatis saat jadwal berubah | `/vendor/schedule` | ✅ |
| Lihat & balas ulasan pelanggan | `/vendor/reviews` | ✅ |
| Edit profil vendor & upload foto | `/vendor/profile` | ✅ |
| Riwayat payout | `/vendor/payouts` | ✅ |

---

## 📁 Struktur

```
src/
│
├── api/
│   ├── client.ts              # Axios instance + interceptor
│   ├── auth.ts                 # Auth API calls
│   └── ...
│
├── components/
│   ├── ui/                     # shadcn/ui components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Table.tsx
│   │   ├── Dialog.tsx
│   │   └── ...
│   └── layout/
│       ├── AppShell.tsx         # Main layout (sidebar + content)
│       ├── Sidebar.tsx          # Navigation sidebar
│       └── PageHeader.tsx       # Page title + subtitle
│
├── features/
│   ├── dashboard/               # Super Admin
│   │   └── pages/
│   │       ├── DashboardPage.tsx     # Stats + charts
│   │       ├── VendorsPage.tsx       # Vendor management
│   │       ├── BookingsPage.tsx      # All bookings
│   │       ├── CategoriesPage.tsx    # Category CRUD
│   │       └── UsersPage.tsx         # User management
│   │
│   └── vendors/                 # Vendor Panel
│       └── pages/
│           ├── DashboardPage.tsx     # Vendor stats
│           ├── BookingsPage.tsx      # Booking list + filter
│           ├── CalendarPage.tsx      # Calendar view
│           ├── ServicesPage.tsx      # Service CRUD
│           ├── SchedulePage.tsx      # Weekly schedule
│           ├── ReviewsPage.tsx       # Reviews + reply
│           ├── ProfilePage.tsx       # Vendor profile
│           └── PayoutsPage.tsx       # Payout history
│
├── hooks/                       # Custom hooks
│   ├── useAuth.ts               # Auth state
│   ├── useMediaQuery.ts         # Responsive breakpoints
│   └── ...
│
├── stores/                      # Zustand stores
│   ├── authStore.ts
│   └── sidebarStore.ts
│
├── lib/                         # Utilities
│   ├── utils.ts                 # cn() helper
│   ├── constants.ts             # App constants
│   └── schemas/                 # Zod validation schemas
│
├── types/
│   ├── models.ts                # Booking, Vendor, User types
│   └── api.ts                   # API response types
│
├── router/
│   └── index.tsx                # Route config + guards
│
├── App.tsx                      # Root component
├── main.tsx                     # Entry point
└── index.css                    # Tailwind + globals
```

---

## 🚀 Setup

### Prasyarat
- Node.js 20+
- npm 10+

### Instalasi
```bash
# Clone
git clone https://github.com/Naufall18/Gerai-Jasa-web.git
cd Gerai-Jasa-web

# Install dependencies
npm install

# Environment
cp .env.example .env.local

# Development
npm run dev
```

> Dashboard → `http://localhost:5173`

### Environment
```env
# .env.local
VITE_API_URL=http://localhost:8000/api/v1
```

### Build Production
```bash
npm run build      # → dist/
npm run preview    # Preview build
```

---

## 🎨 Design System

### Brand Colors

| Token | Warna | Hex | Penggunaan |
|-------|-------|-----|------------|
| Primary | ![#1E6F5C](https://placehold.co/15x15/1E6F5C/1E6F5C.png) Green | `#1E6F5C` | Tombol, link, header |
| Accent | ![#F2A444](https://placehold.co/15x15/F2A444/F2A444.png) Amber | `#F2A444` | Badge, highlight |
| Background | ![#FBFAF7](https://placehold.co/15x15/FBFAF7/FBFAF7.png) Cream | `#FBFAF7` | Halaman |
| Surface | ![#FFFFFF](https://placehold.co/15x15/FFFFFF/FFFFFF.png) White | `#FFFFFF` | Kartu, modal |
| Text | ![#14241F](https://placehold.co/15x15/14241F/14241F.png) Dark | `#14241F` | Teks utama |

### Component Design
- **Cards** — Background putih, border subtle, border radius 16px
- **Buttons** — Primary green, hover darker, disabled state
- **Badges** — Status dengan warna: amber (pending), blue (confirmed), green (completed), red (cancelled)
- **Sidebar** — Dark background (`#0F0D1A`), active state highlight
- **Tables** — Clean, minimal, dengan search & filter

---

## 📜 Scripts

| Command | Deskripsi |
|---------|-----------|
| `npm run dev` | Start development server (port 5173) |
| `npm run build` | Build untuk production |
| `npm run preview` | Preview production build |
| `npm run lint` | Jalankan ESLint |
| `npm run type-check` | TypeScript type checking |

---

## 👥 Panduan Role

### Super Admin (email/password login)
| Email | Password | Akses |
|-------|----------|-------|
| `admin@geraijasa.id` | `password` | Semua halaman `/admin/*` |

### Vendor (email/password login)
| Email | Akses |
|-------|-------|
| (sesuai data seed) | Halaman `/vendor/*` |

---

## 📦 Repositori Terkait

| Repositori | Link | Status |
|-----------|------|--------|
| Monorepo Utama | [Gerai-Jasa](https://github.com/Naufall18/Gerai-Jasa) | 🔒 Private |
| Backend API | [Gerai-Jasa-backend](https://github.com/Naufall18/Gerai-Jasa-backend) | ✅ Public |
| Mobile App | [Gerai-Jasa-mobile](https://github.com/Naufall18/Gerai-Jasa-mobile) | ✅ Public |

---

## 👨‍💻 Pengembang

**Naufall18** — [GitHub](https://github.com/Naufall18)

---

## 📄 Lisensi

**MIT License** — Copyright © 2026 Naufall18

<div align="center">
  <br/>
  <sub>Dibangun dengan ❤️ untuk ekosistem digital Indonesia</sub>
  <br/>
  <br/>
</div>
