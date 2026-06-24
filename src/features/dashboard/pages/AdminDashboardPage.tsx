import type { ReactNode } from 'react';
import { useAdminDashboardStats } from '../hooks/useAdminStats';
import type { Booking } from '../../../types/models';

const STATUS_STYLES: Record<string, string> = {
  pending:     'bg-amber-50 text-amber-700',
  confirmed:   'bg-blue-50 text-blue-700',
  in_progress: 'bg-indigo-50 text-indigo-700',
  completed:   'bg-emerald-50 text-emerald-700',
  cancelled:   'bg-red-50 text-red-700',
};

function formatRupiah(n: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
  }).format(n);
}

/* ── inline line icons (stroke) ── */
const Icon = {
  calendar: <path d="M8 2v3M16 2v3M3 9h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />,
  wallet:   <path d="M3 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v0M3 7v10a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-3m0-4v4m0-4h-4a2 2 0 0 0 0 4h4" />,
  store:    <path d="M4 9V5h16v4M4 9l-1 0a1 1 0 0 0 1 1 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 1 1 0 0 0 1-1l-1 0M5 12v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7" />,
  bell:     <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6M10 21a2 2 0 0 0 4 0" />,
};

function SkeletonCard() {
  return <div className="h-32 animate-pulse gj-card bg-slate-100" />;
}

export function AdminDashboardPage() {
  const { data: stats, isLoading } = useAdminDashboardStats();
  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      {/* ── Hero ── */}
      <div className="gj-card relative overflow-hidden bg-gradient-to-br from-[#1e6f5c] to-[#14463b] p-7 text-white">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute right-24 -bottom-16 h-40 w-40 rounded-[4px_60px_60px_60px] bg-amber-400/10" />
        <p className="relative text-sm text-white/60">{today}</p>
        <h1 className="relative mt-1 font-heading text-2xl font-bold">Selamat datang kembali 👋</h1>
        <p className="relative mt-1 max-w-lg text-sm text-white/75">
          Ringkasan aktivitas Gerai Jasa hari ini. Pantau booking, vendor, dan pendapatan dalam satu tempat.
        </p>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard label="Total Booking" value={String(stats?.totalBookings ?? 0)}
              icon={Icon.calendar} tint="#e7f1ed" accent="#1e6f5c" />
            <StatCard label="Pendapatan (Selesai)" value={formatRupiah(stats?.revenue ?? 0)}
              icon={Icon.wallet} tint="#fdf3e2" accent="#d98a2b" />
            <StatCard label="Vendor Aktif" value={String(stats?.totalVendors ?? 0)}
              icon={Icon.store} tint="#e8f6ee" accent="#178a54" />
            <StatCard label="Booking Baru" value={String(stats?.recentBookings?.length ?? 0)}
              icon={Icon.bell} tint="#e4f0ef" accent="#1e6e68" />
          </>
        )}
      </div>

      {/* ── Recent Bookings ── */}
      <div className="gj-card border border-slate-200 bg-white p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-slate-900">Booking Terbaru</h2>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        ) : stats?.recentBookings?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7">{Icon.calendar}</svg>
            </div>
            <p className="font-medium text-slate-600">Belum ada booking</p>
            <p className="mt-1 text-sm text-slate-400">Booking yang masuk akan muncul di sini.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left">
                  {['Kode', 'Status', 'Metode', 'Total', 'Tanggal'].map((h) => (
                    <th key={h} className="pb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats?.recentBookings?.map((b: Booking) => (
                  <tr key={b.id} className="transition hover:bg-slate-50">
                    <td className="py-3 font-mono font-bold text-indigo-600">{b.booking_code}</td>
                    <td className="py-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[b.status] ?? 'bg-slate-50 text-slate-600'}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 uppercase text-slate-600">{b.payment_method}</td>
                    <td className="py-3 font-semibold text-slate-900">{formatRupiah(Number(b.total_price))}</td>
                    <td className="py-3 text-slate-500">
                      {new Date(b.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, tint, accent }: {
  label: string; value: string; icon: ReactNode; tint: string; accent: string;
}) {
  return (
    <div className="gj-card relative overflow-hidden border border-slate-200 bg-white p-5">
      {/* decorative tinted blob */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full" style={{ background: tint, opacity: 0.5 }} />
      <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl" style={{ background: tint }}>
        <svg viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">{icon}</svg>
      </div>
      <p className="relative mt-4 font-heading text-2xl font-bold text-slate-900">{value}</p>
      <p className="relative mt-1 text-sm text-slate-500">{label}</p>
    </div>
  );
}
