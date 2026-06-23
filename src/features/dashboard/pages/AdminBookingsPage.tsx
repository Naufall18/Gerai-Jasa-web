import { useState } from 'react';
import { useAdminBookings } from '../../bookings/hooks/useBookings';
import type { Booking } from '../../../types/models';

type StatusFilter = 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled';

const STATUS_STYLES: Record<string, string> = {
  pending:     'bg-amber-50 text-amber-700',
  confirmed:   'bg-blue-50 text-blue-700',
  in_progress: 'bg-indigo-50 text-indigo-700',
  completed:   'bg-emerald-50 text-emerald-700',
  cancelled:   'bg-red-50 text-red-700',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Menunggu', confirmed: 'Dikonfirmasi',
  in_progress: 'Berlangsung', completed: 'Selesai', cancelled: 'Dibatalkan',
};

function formatRupiah(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

const FILTERS: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: 'Semua' },
  { key: 'pending', label: 'Menunggu' },
  { key: 'confirmed', label: 'Dikonfirmasi' },
  { key: 'completed', label: 'Selesai' },
  { key: 'cancelled', label: 'Dibatalkan' },
];

export function AdminBookingsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');

  const { data, isLoading, isError } = useAdminBookings(
    page,
    statusFilter === 'all' ? undefined : statusFilter
  );

  const bookings: Booking[] = data?.data ?? [];
  const total = (data as any)?.meta?.pagination?.total ?? 0;

  const filtered = search
    ? bookings.filter((b) =>
        b.booking_code.toLowerCase().includes(search.toLowerCase()) ||
        (b as any).customer?.name?.toLowerCase().includes(search.toLowerCase())
      )
    : bookings;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Semua Booking</h1>
        <input
          type="search"
          placeholder="Cari kode atau nama pelanggan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-indigo-400 md:w-72"
        />
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => { setStatusFilter(f.key); setPage(1); }}
            className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
              statusFilter === f.key
                ? 'bg-indigo-600 text-white'
                : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isError && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
          Gagal memuat data booking. Pastikan Anda sudah login.
        </div>
      )}

      {/* Table */}
      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['Kode Booking', 'Pelanggan', 'Vendor', 'Layanan', 'Total', 'Metode', 'Status', 'Tanggal'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left font-semibold text-slate-700 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 8 }).map((__, j) => (
                    <td key={j} className="px-5 py-4">
                      <div className="h-4 animate-pulse rounded bg-slate-100" />
                    </td>
                  ))}
                </tr>
              ))}

              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-400">
                    Tidak ada booking ditemukan.
                  </td>
                </tr>
              )}

              {!isLoading && filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-mono font-bold text-indigo-600">{b.booking_code}</td>
                  <td className="px-5 py-4 text-slate-700">{(b as any).customer?.name ?? '-'}</td>
                  <td className="px-5 py-4 text-slate-600">{(b as any).vendor?.name ?? '-'}</td>
                  <td className="px-5 py-4 text-slate-600">{(b as any).service?.name ?? '-'}</td>
                  <td className="px-5 py-4 font-semibold text-slate-900">{formatRupiah(Number(b.total_price))}</td>
                  <td className="px-5 py-4 uppercase text-slate-500">{b.payment_method}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[b.status] ?? 'bg-slate-100 text-slate-600'}`}>
                      {STATUS_LABELS[b.status] ?? b.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-400 whitespace-nowrap">
                    {new Date(b.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>Total {total} booking</span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-2xl border border-slate-200 px-4 py-1.5 hover:bg-slate-50 disabled:opacity-40"
          >← Prev</button>
          <span className="px-3 py-1.5 font-semibold text-slate-700">Hal. {page}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={bookings.length < 20}
            className="rounded-2xl border border-slate-200 px-4 py-1.5 hover:bg-slate-50 disabled:opacity-40"
          >Next →</button>
        </div>
      </div>
    </div>
  );
}
