import { Link } from '@tanstack/react-router';

const sections = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', to: '/admin/dashboard' },
    ],
  },
  {
    title: 'Management',
    items: [
      { label: 'Vendors', to: '/admin/vendors' },
      { label: 'Bookings', to: '/admin/bookings' },
      { label: 'Categories', to: '/admin/categories' },
      { label: 'Users', to: '/admin/users' },
    ],
  },
  {
    title: 'Vendor',
    items: [
      { label: 'Vendor Dashboard', to: '/vendor/dashboard' },
      { label: 'Booking Masuk', to: '/vendor/bookings' },
      { label: 'Kalender', to: '/vendor/calendar' },
      { label: 'Layanan', to: '/vendor/services' },
      { label: 'Jadwal', to: '/vendor/schedule' },
      { label: 'Ulasan', to: '/vendor/reviews' },
      { label: 'Profil Usaha', to: '/vendor/profile' },
      { label: 'Payouts', to: '/vendor/payouts' },
    ],
  },
];

export function Sidebar() {
  return (
    <aside className="hidden w-72 shrink-0 flex-col border-r border-slate-200 bg-slate-950 px-4 py-6 text-slate-300 lg:flex">
      <div className="mb-10 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-primary text-white">
          B
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
            Bookly
          </p>
          <p className="text-lg font-semibold text-white">Admin / Vendor</p>
        </div>
      </div>

      {sections.map((section) => (
        <div key={section.title} className="mb-8">
          <p className="mb-3 text-xs uppercase tracking-[0.16em] text-slate-700">
            {section.title}
          </p>
          <div className="space-y-1">
            {section.items.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="block rounded-2xl px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-auto rounded-3xl bg-slate-900 p-4 text-sm text-slate-400">
        <p className="font-semibold text-white">Super Admin</p>
        <p className="mt-1">Salma K.</p>
      </div>
    </aside>
  );
}