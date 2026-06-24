import type { ReactNode } from 'react';
import { useVendorTodayStats, useVendorPendingBookings } from '../hooks/useVendorDashboard';

function formatRupiah(amount: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
}

const Icon = {
  calendar: <path d="M8 2v3M16 2v3M3 9h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />,
  clock:    <path d="M12 7v5l3 2M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z" />,
  layers:   <path d="m12 3 9 5-9 5-9-5 9-5ZM3 13l9 5 9-5M3 17l9 5 9-5" />,
  wallet:   <path d="M3 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v0M3 7v10a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-3m0-4v4m0-4h-4a2 2 0 0 0 0 4h4" />,
};

export function VendorDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useVendorTodayStats();
  const { data: pendingData, isLoading: pendingLoading } = useVendorPendingBookings();

  const pendingBookings = pendingData?.data ?? [];
  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      {/* ── Hero ── */}
      <div className="gj-card relative overflow-hidden bg-gradient-to-br from-[#1e6f5c] to-[#14463b] p-7 text-white">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute right-24 -bottom-16 h-40 w-40 rounded-[4px_60px_60px_60px] bg-amber-400/10" />
        <p className="relative text-sm text-white/60">{today}</p>
        <h1 className="relative mt-1 font-heading text-2xl font-bold">Dashboard Vendor</h1>
        {stats && stats.pendingCount > 0 ? (
          <p className="relative mt-1 text-sm text-white/80">
            Anda punya <strong className="text-amber-400">{stats.pendingCount}</strong> booking menunggu konfirmasi.
          </p>
        ) : (
          <p className="relative mt-1 text-sm text-white/75">Kelola booking, layanan, dan jadwal usaha Anda.</p>
        )}
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Booking Hari Ini" value={statsLoading ? '…' : String(stats?.todayCount ?? 0)}
          icon={Icon.calendar} tint="#e7f1ed" accent="#1e6f5c" />
        <StatCard label="Konfirmasi Ditunggu" value={statsLoading ? '…' : String(stats?.pendingCount ?? 0)}
          icon={Icon.clock} tint="#fdf3e2" accent="#d98a2b" highlight={Boolean(stats && stats.pendingCount > 0)} />
        <StatCard label="Total Booking" value={statsLoading ? '…' : String(stats?.totalBookings ?? 0)}
          icon={Icon.layers} tint="#e4f0ef" accent="#1e6e68" />
        <StatCard label="Pendapatan (Selesai)" value={statsLoading ? '…' : formatRupiah(stats?.revenue ?? 0)}
          icon={Icon.wallet} tint="#e8f6ee" accent="#178a54" />
      </div>

      {/* ── Pending preview ── */}
      {pendingBookings.length > 0 && (
        <div className="gj-card border border-slate-200 bg-white p-6">
          <h3 className="mb-4 font-heading text-lg font-bold text-slate-900">Booking Menunggu Konfirmasi</h3>
          <div className="space-y-3">
            {pendingLoading ? (
              <div className="h-16 rounded-2xl gj-skeleton" />
            ) : (
              pendingBookings.slice(0, 3).map((b) => (
                <div key={b.id} className="flex items-center justify-between rounded-2xl border border-slate-100 p-4 transition hover:border-slate-200 hover:bg-slate-50">
                  <div>
                    <p className="font-mono font-bold text-indigo-600">{b.booking_code}</p>
                    <p className="text-sm text-slate-500">{formatRupiah(Number(b.total_price))}</p>
                  </div>
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                    Menunggu
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, tint, accent, highlight = false }: {
  label: string; value: string; icon: ReactNode; tint: string; accent: string; highlight?: boolean;
}) {
  return (
    <div className={`gj-card relative overflow-hidden border bg-white p-5 ${highlight ? 'border-amber-200 ring-1 ring-amber-200' : 'border-slate-200'}`}>
      <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full" style={{ background: tint, opacity: 0.5 }} />
      <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl" style={{ background: tint }}>
        <svg viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">{icon}</svg>
      </div>
      <p className="relative mt-4 font-heading text-2xl font-bold text-slate-900">{value}</p>
      <p className="relative mt-1 text-sm text-slate-500">{label}</p>
    </div>
  );
}
