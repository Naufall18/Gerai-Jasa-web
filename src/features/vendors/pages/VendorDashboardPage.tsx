import { useVendorTodayStats, useVendorPendingBookings } from '../hooks/useVendorDashboard';

function formatRupiah(amount: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
}

export function VendorDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useVendorTodayStats();
  const { data: pendingData, isLoading: pendingLoading } = useVendorPendingBookings();

  const pendingBookings = pendingData?.data ?? [];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white">
        <p className="text-sm opacity-90">Selamat datang kembali,</p>
        <h2 className="mt-2 text-3xl font-bold">Dashboard Vendor</h2>
        {stats && stats.pendingCount > 0 && (
          <p className="mt-2 opacity-90">
            Anda punya <strong>{stats.pendingCount}</strong> booking menunggu konfirmasi
          </p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Booking Hari Ini"
          value={statsLoading ? '...' : String(stats?.todayCount ?? 0)}
        />
        <StatCard
          label="Konfirmasi Ditunggu"
          value={statsLoading ? '...' : String(stats?.pendingCount ?? 0)}
          highlight={Boolean(stats && stats.pendingCount > 0)}
        />
        <StatCard
          label="Total Booking"
          value={statsLoading ? '...' : String(stats?.totalBookings ?? 0)}
        />
        <StatCard
          label="Pendapatan (Completed)"
          value={statsLoading ? '...' : formatRupiah(stats?.revenue ?? 0)}
        />
      </div>

      {/* Pending Bookings Preview */}
      {pendingBookings.length > 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Booking Menunggu Konfirmasi</h3>
          <div className="space-y-3">
            {pendingLoading ? (
              <div className="h-16 animate-pulse rounded-2xl bg-slate-100" />
            ) : (
              pendingBookings.slice(0, 3).map((b) => (
                <div key={b.id} className="flex items-center justify-between rounded-2xl border border-slate-100 p-4">
                  <div>
                    <p className="font-semibold text-slate-900">{b.booking_code}</p>
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

function StatCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-3xl border p-6 ${
        highlight ? 'border-amber-200 bg-amber-50' : 'border-slate-200 bg-white'
      }`}
    >
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${highlight ? 'text-amber-700' : 'text-slate-900'}`}>
        {value}
      </p>
    </div>
  );
}
