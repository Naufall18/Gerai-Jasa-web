import { Link, useRouterState } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../api/client';
import { clearToken, getRole } from '../../lib/auth';
import type { ApiResponse } from '../../types/api';
import type { User } from '../../types/models';

// Fetch current user for sidebar display
function useCurrentUser() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<User>>('/auth/me');
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

const ADMIN_SECTIONS = [
  {
    title: 'Overview',
    items: [
      { label: '📊 Dashboard',  to: '/admin/dashboard' },
    ],
  },
  {
    title: 'Manajemen',
    items: [
      { label: '🏪 Vendor',     to: '/admin/vendors' },
      { label: '📅 Booking',    to: '/admin/bookings' },
      { label: '🗂️ Kategori',   to: '/admin/categories' },
      { label: '👥 Pengguna',   to: '/admin/users' },
    ],
  },
];

const VENDOR_SECTIONS = [
  {
    title: 'Vendor',
    items: [
      { label: '📊 Dashboard',    to: '/vendor/dashboard' },
      { label: '📅 Booking Masuk', to: '/vendor/bookings' },
      { label: '🗓️ Kalender',     to: '/vendor/calendar' },
      { label: '🛎️ Layanan',      to: '/vendor/services' },
      { label: '⏰ Jadwal',        to: '/vendor/schedule' },
      { label: '⭐ Ulasan',        to: '/vendor/reviews' },
      { label: '🏪 Profil Usaha',  to: '/vendor/profile' },
      { label: '💰 Pendapatan',    to: '/vendor/payouts' },
    ],
  },
];

export function Sidebar() {
  const { data: user } = useCurrentUser();
  const role = user?.role ?? getRole() ?? 'admin';
  const sections = role === 'vendor' ? VENDOR_SECTIONS : ADMIN_SECTIONS;

  const state = useRouterState();
  const currentPath = state.location.pathname;

  function handleLogout() {
    clearToken();
    window.location.href = '/login';
  }

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-950 px-4 py-6 text-slate-300 lg:flex">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-3 px-1">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white font-bold text-lg shadow">
          G
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500">Gerai Jasa</p>
          <p className="text-sm font-semibold text-white capitalize">{role === 'vendor' ? 'Vendor Panel' : 'Admin Panel'}</p>
        </div>
      </div>

      {/* Nav sections */}
      <nav className="flex-1 space-y-6 overflow-y-auto">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = currentPath === item.to || currentPath.startsWith(item.to + '/');
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center rounded-xl px-3 py-2 text-sm transition-all ${
                      isActive
                        ? 'bg-indigo-600 font-semibold text-white shadow-sm'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="mt-4 rounded-2xl bg-slate-900 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-700 text-sm font-bold text-white">
            {user?.name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{user?.name ?? 'Loading...'}</p>
            <p className="truncate text-xs text-slate-500">{user?.email ?? ''}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-3 w-full rounded-xl py-1.5 text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-red-400 transition"
        >
          Keluar →
        </button>
      </div>
    </aside>
  );
}
