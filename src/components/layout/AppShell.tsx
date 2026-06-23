import { Outlet, useRouterState } from '@tanstack/react-router';
import { Sidebar } from './Sidebar';

// Map path prefixes to page titles
const PAGE_TITLES: Record<string, string> = {
  '/admin/dashboard':  'Dashboard Admin',
  '/admin/vendors':    'Manajemen Vendor',
  '/admin/bookings':   'Semua Booking',
  '/admin/categories': 'Kategori',
  '/admin/users':      'Pengguna',
  '/vendor/dashboard': 'Dashboard Vendor',
  '/vendor/bookings':  'Booking Masuk',
  '/vendor/calendar':  'Kalender',
  '/vendor/services':  'Layanan Saya',
  '/vendor/schedule':  'Jadwal Operasional',
  '/vendor/reviews':   'Ulasan Pelanggan',
  '/vendor/profile':   'Profil Usaha',
  '/vendor/payouts':   'Laporan Pendapatan',
};

export function AppShell() {
  const state = useRouterState();
  const path  = state.location.pathname;
  const title = PAGE_TITLES[path] ?? 'Gerai Jasa';

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
          <h1 className="text-base font-semibold text-slate-900">{title}</h1>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="hidden md:inline">Gerai Jasa</span>
            <span>·</span>
            <span>{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
