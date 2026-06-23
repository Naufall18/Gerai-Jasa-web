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

function SkeletonCard() {
  return <div className="h-28 animate-pulse rounded-3xl bg-slate-100" />;
}

export function AdminDashboardPage() {
  const { data: stats, isLoading } = useAdminDashboardStats();

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard label="Total Booking" value={String(stats?.totalBookings ?? 0)} />
            <StatCard
              label="Total Revenue (Completed)"
              value={formatRupiah(stats?.revenue ?? 0)}
            />
            <StatCard label="Total Vendor Aktif" value={String(stats?.totalVendors ?? 0)} />
            <StatCard
              label="Booking Baru (Ditampilkan)"
              value={String(stats?.recentBookings?.length ?? 0)}
            />
          </>
        )}
      </div>

      {/* Recent Bookings Table */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <h2 className="mb-6 text-xl font-semibold text-slate-900">Booking Terbaru</h2>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  {['Kode', 'Status', 'Metode', 'Total', 'Tanggal'].map((h) => (
                    <th key={h} className="pb-3 text-left font-semibold text-slate-700">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats?.recentBookings?.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      Belum ada data booking.
                    </td>
                  </tr>
                )}
                {stats?.recentBookings?.map((b: Booking) => (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="py-3 font-mono font-bold text-indigo-600">{b.booking_code}</td>
                    <td className="py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          STATUS_STYLES[b.status] ?? 'bg-slate-50 text-slate-600'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 uppercase text-slate-600">{b.payment_method}</td>
                    <td className="py-3 font-semibold text-slate-900">
                      {formatRupiah(Number(b.total_price))}
                    </td>
                    <td className="py-3 text-slate-500">
                      {new Date(b.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
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

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
