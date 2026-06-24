import { useState } from 'react';
import { Outlet, useRouterState } from '@tanstack/react-router';
import { Sidebar, SidebarBody } from './Sidebar';
import { Icons } from '../ui/icons';

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
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-64 bg-slate-950 shadow-xl">
            <SidebarBody onNavigate={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur md:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDrawerOpen(true)}
              className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              aria-label="Buka menu"
            >
              <Icons.menu className="h-5 w-5" />
            </button>
            <h1 className="font-heading text-lg font-bold text-slate-900">{title}</h1>
          </div>
          <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex">
            <span className="font-medium text-slate-500">Gerai Jasa</span>
            <span>·</span>
            <span>{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </header>

        {/* Page content — fade-in re-triggers per route via key */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div key={path} className="gj-fade-in mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
