import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../api/client';
import type { ApiResponse } from '../../../types/api';
import type { Booking } from '../../../types/models';

function formatRupiah(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

function useVendorPayoutStats() {
  return useQuery({
    queryKey: ['vendor', 'payout-stats'],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Booking[]>>('/vendor/bookings', {
        params: { per_page: 100 },
      });
      const bookings = res.data.data ?? [];

      const completed = bookings.filter((b) => b.status === 'completed');
      const totalGross   = completed.reduce((s, b) => s + Number(b.total_price), 0);
      const totalCommission = completed.reduce((s, b) => s + Number((b as any).commission_amount ?? 0), 0);
      const totalNet     = totalGross - totalCommission;

      // Group by month for payout history
      const byMonth: Record<string, { gross: number; commission: number; count: number }> = {};
      completed.forEach((b) => {
        const month = b.created_at.slice(0, 7); // "yyyy-MM"
        if (!byMonth[month]) byMonth[month] = { gross: 0, commission: 0, count: 0 };
        byMonth[month].gross      += Number(b.total_price);
        byMonth[month].commission += Number((b as any).commission_amount ?? 0);
        byMonth[month].count      += 1;
      });

      const history = Object.entries(byMonth)
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([month, v]) => ({ month, ...v, net: v.gross - v.commission }));

      return { totalGross, totalCommission, totalNet, history, completedCount: completed.length };
    },
  });
}

export function VendorPayoutsPage() {
  const { data: stats, isLoading } = useVendorPayoutStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Laporan Pendapatan</h1>
        <p className="mt-1 text-sm text-slate-500">Rekap pendapatan dari booking yang telah selesai.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { label: 'Total Bruto',      value: isLoading ? '...' : formatRupiah(stats?.totalGross ?? 0),      sub: `${stats?.completedCount ?? 0} booking selesai`, color: 'text-slate-900' },
          { label: 'Komisi Platform',  value: isLoading ? '...' : formatRupiah(stats?.totalCommission ?? 0), sub: 'Dipotong oleh platform', color: 'text-red-600' },
          { label: 'Pendapatan Bersih',value: isLoading ? '...' : formatRupiah(stats?.totalNet ?? 0),        sub: 'Yang Anda terima', color: 'text-emerald-600' },
        ].map((card) => (
          <div key={card.label} className="rounded-3xl border border-slate-200 bg-white p-6">
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className={`mt-2 text-2xl font-bold ${card.color}`}>{card.value}</p>
            <p className="mt-1 text-xs text-slate-400">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Monthly breakdown */}
      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="font-semibold text-slate-900">Riwayat per Bulan</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['Bulan', 'Jumlah Booking', 'Bruto', 'Komisi', 'Bersih'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left font-semibold text-slate-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 5 }).map((__, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 animate-pulse rounded bg-slate-100" />
                    </td>
                  ))}
                </tr>
              ))}
              {!isLoading && (stats?.history?.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-400">
                    Belum ada data pendapatan. Selesaikan booking terlebih dahulu.
                  </td>
                </tr>
              )}
              {!isLoading && stats?.history?.map((row) => {
                const [year, month] = row.month.split('-');
                const label = new Date(Number(year), Number(month) - 1).toLocaleDateString('id-ID', {
                  month: 'long', year: 'numeric',
                });
                return (
                  <tr key={row.month} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900 capitalize">{label}</td>
                    <td className="px-6 py-4 text-slate-600">{row.count} booking</td>
                    <td className="px-6 py-4 text-slate-700">{formatRupiah(row.gross)}</td>
                    <td className="px-6 py-4 text-red-600">- {formatRupiah(row.commission)}</td>
                    <td className="px-6 py-4 font-semibold text-emerald-600">{formatRupiah(row.net)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Withdrawal info */}
      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
        <p className="font-semibold text-amber-800">💡 Tentang Penarikan Dana</p>
        <p className="mt-2 text-sm text-amber-700">
          Fitur penarikan dana otomatis sedang dalam pengembangan. Saat ini pembayaran dilakukan manual oleh admin platform setiap akhir bulan. Hubungi admin jika ada pertanyaan.
        </p>
      </div>
    </div>
  );
}
