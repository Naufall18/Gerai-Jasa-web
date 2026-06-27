import { Link, useRouterState } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../api/client';
import { clearToken, getRole } from '../../lib/auth';
import { Icons, type IconName } from '../ui/icons';
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

type NavItem = { icon: IconName; label: string; to: string };
type NavSection = { title: string; items: NavItem[] };

const ADMIN_SECTIONS: NavSection[] = [
  { title: 'Overview', items: [{ icon: 'dashboard', label: 'Dashboard', to: '/admin/dashboard' }] },
  {
    title: 'Manajemen',
    items: [
      { icon: 'store', label: 'Vendor', to: '/admin/vendors' },
      { icon: 'calendar', label: 'Booking', to: '/admin/bookings' },
      { icon: 'category', label: 'Kategori', to: '/admin/categories' },
      { icon: 'users', label: 'Pengguna', to: '/admin/users' },
    ],
  },
];

const VENDOR_SECTIONS: NavSection[] = [
  {
    title: 'Vendor',
    items: [
      { icon: 'dashboard', label: 'Dashboard', to: '/vendor/dashboard' },
      { icon: 'bell', label: 'Booking Masuk', to: '/vendor/bookings' },
      { icon: 'calendar', label: 'Kalender', to: '/vendor/calendar' },
      { icon: 'category', label: 'Layanan', to: '/vendor/services' },
      { icon: 'clock', label: 'Jadwal', to: '/vendor/schedule' },
      { icon: 'star', label: 'Ulasan', to: '/vendor/reviews' },
      { icon: 'store', label: 'Profil Usaha', to: '/vendor/profile' },
      { icon: 'wallet', label: 'Pendapatan', to: '/vendor/payouts' },
    ],
  },
];

/** Isi sidebar — dipakai oleh aside desktop maupun drawer mobile. */
export function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
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
    <div className="flex h-full flex-col px-4 py-6 text-slate-300">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-3 px-1">
        <img src="/gerai-jasa-logo.svg" alt="Gerai Jasa" className="h-10 w-10 rounded-xl shadow ring-2 ring-amber-400/30" />
        <div>
          <p className="font-heading text-sm font-bold tracking-tight text-white">Gerai Jasa</p>
          <p className="text-[11px] uppercase tracking-widest text-amber-400/80">
            {role === 'vendor' ? 'Vendor Panel' : 'Admin Panel'}
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-6 overflow-y-auto">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = currentPath === item.to || currentPath.startsWith(item.to + '/');
                const IconCmp = Icons[item.icon];
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={onNavigate}
                    className={`flex items-center gap-3 rounded-xl border-l-2 px-3 py-2.5 text-sm transition-all ${
                      isActive
                        ? 'border-amber-400 bg-indigo-600 font-semibold text-white shadow-sm'
                        : 'border-transparent text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <IconCmp className="h-[18px] w-[18px] shrink-0" />
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
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white">
            {user?.name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{user?.name ?? 'Memuat…'}</p>
            <p className="truncate text-xs text-slate-500">{user?.email ?? ''}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-2 text-xs font-medium text-slate-400 transition hover:bg-slate-800 hover:text-red-400"
        >
          <Icons.logout className="h-4 w-4" /> Keluar
        </button>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 bg-slate-950 lg:block">
      <SidebarBody />
    </aside>
  );
}
