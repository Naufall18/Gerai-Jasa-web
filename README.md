# Gerai Jasa Web Dashboard

React 18 + TypeScript admin & vendor dashboard for **Gerai Jasa** — a multi-vendor booking platform for the Indonesian market.

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS v4** (styling)
- **shadcn/ui** (component library, New York style)
- **TanStack Query** (server state management)
- **Zustand** (client state management)
- **React Hook Form** + **Zod** (form validation)
- **React Router** (routing)
- **Recharts** (charts & analytics)
- **Lucide React** (icons)
- **date-fns** (date utilities)

## Features

### Super Admin Dashboard (`/admin/*`)
- 📊 **Dashboard** — Stats cards (bookings, revenue, vendors, users), booking trend chart, recent bookings table
- 🏪 **Vendors** — Vendor management table with search/filter, approve/suspend actions, status badges
- 📋 **Bookings** — All bookings with filters (status, date range, vendor, category)
- 📁 **Categories** — CRUD categories with icon upload
- 👥 **Users** — User management table

### Vendor Dashboard (`/vendor/*`)
- 📊 **Dashboard** — Today's bookings, monthly revenue, pending confirmations, upcoming bookings
- 📋 **Bookings** — Booking list with tabs (pending/confirmed/completed/cancelled), confirm/reject actions
- 📅 **Calendar** — Calendar view showing booked slots per day
- 🛠️ **Services** — CRUD services (name, price, duration, active toggle)
- ⏰ **Schedule** — Weekly schedule form (open/close time per day, day off toggle)
- ⭐ **Reviews** — List reviews with reply feature
- 👤 **Profile** — Edit vendor profile, upload photos, business info
- 💰 **Payouts** — Payout history table

## Design System

- **Primary**: Indigo `#6366F1`
- **Background**: `#F4F3FF` (light lavender)
- **Sidebar**: `#0F0D1A` (dark indigo-black)
- **Font**: Inter
- **Style**: Clean, minimal, data-dense (Linear/Vercel inspired)

## Folder Structure

```
src/
├── api/                        # Axios instance + API calls
├── components/
│   ├── ui/                     # shadcn/ui components (Button, Card, Badge, Input, Label)
│   └── layout/                 # AppShell, Sidebar
├── features/
│   ├── dashboard/pages/        # Admin pages (Dashboard, Vendors, Bookings, Categories, Users)
│   └── vendors/pages/          # Vendor pages (Dashboard, Bookings, Calendar, Services, etc.)
├── hooks/                      # Global custom hooks
├── lib/                        # Utils, constants, Zod schemas
├── stores/                     # Zustand stores
├── types/                      # TypeScript types (models.ts, api.ts)
├── router/                     # React Router config
├── App.tsx                     # Root component
├── main.tsx                    # Entry point
└── index.css                   # Tailwind CSS imports
```

## Setup

```bash
# Clone
git clone https://github.com/Naufall18/geraijasa-web.git
cd geraijasa-web

# Install dependencies
npm install

# Environment
cp .env.example .env
# Configure VITE_API_URL to point to your backend

# Development
npm run dev

# Build
npm run build

# Preview production build
npm run preview
```

## Environment Variables

```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_PUSHER_APP_KEY=
VITE_PUSHER_HOST=localhost
VITE_PUSHER_PORT=6001
VITE_MIDTRANS_CLIENT_KEY=
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (port 5173) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Related Repositories

- **Backend API**: [geraijasa-backend](https://github.com/Naufall18/geraijasa-backend) — Laravel 11 REST API
- **Mobile App**: [geraijasa-mobile](https://github.com/Naufall18/geraijasa-mobile) — Flutter 3.x (Customer App)

## License

MIT