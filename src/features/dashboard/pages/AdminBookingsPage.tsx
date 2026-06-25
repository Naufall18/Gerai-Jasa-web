import { useState } from 'react';
import { useAdminBookings } from '../../bookings/hooks/useBookings';
import { PageHeader } from '../../../components/layout/PageHeader';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import type { Booking } from '../../../types/models';

type StatusFilter = 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled';

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
  const total = data?.meta?.pagination?.total ?? 0;

  const filtered = search
    ? bookings.filter((b) =>
        b.booking_code.toLowerCase().includes(search.toLowerCase()) ||
        b.customer?.name?.toLowerCase().includes(search.toLowerCase())
      )
    : bookings;

  return (
    <div>
      <PageHeader
        title="Semua Booking"
        subtitle={`${total} transaksi tercatat`}
        actions={
          <input
            type="search"
            placeholder="Cari kode atau pelanggan…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-indigo-400 sm:w-72"
          />
        }
      />

      {/* Filter tabs */}
      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => { setStatusFilter(f.key); setPage(1); }}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              statusFilter === f.key
                ? 'bg-indigo-600 text-white'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isError && (
        <div className="gj-card border border-red-200 bg-red-50 p-6 text-red-700">
          Gagal memuat data booking. Pastikan Anda sudah login.
        </div>
      )}

      {/* Desktop: tabel */}
      <div className="gj-card hidden border border-slate-200 bg-white overflow-hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50/60">
              <tr>
                {['Kode Booking', 'Pelanggan', 'Vendor', 'Layanan', 'Total', 'Metode', 'Status', 'Tanggal'].map((h) => (
                  <th key={h} className="whitespace-nowrap px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 8 }).map((__, j) => (
                    <td key={j} className="px-5 py-4">
                      <div className="h-4 rounded gj-skeleton" />
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
                  <td className="px-5 py-4 text-slate-700">{b.customer?.name ?? '-'}</td>
                  <td className="px-5 py-4 text-slate-600">{b.vendor?.name ?? '-'}</td>
                  <td className="px-5 py-4 text-slate-600">{b.service?.name ?? '-'}</td>
                  <td className="px-5 py-4 font-semibold text-slate-900">{formatRupiah(Number(b.total_price))}</td>
                  <td className="px-5 py-4 uppercase text-slate-500">{b.payment_method}</td>
                  <td className="px-5 py-4"><StatusBadge status={b.status} dot /></td>
                  <td className="px-5 py-4 text-slate-400 whitespace-nowrap">
                    {new Date(b.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile: daftar kartu */}
      <div className="space-y-3 md:hidden">
        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="gj-card border border-slate-200 bg-white p-4">
              <div className="h-20 rounded gj-skeleton" />
            </div>
          ))}

        {!isLoading && filtered.length === 0 && (
          <div className="gj-card border border-slate-200 bg-white p-8 text-center text-slate-400">
            Tidak ada booking ditemukan.
          </div>
        )}

        {!isLoading &&
          filtered.map((b) => (
            <div key={b.id} className="gj-card border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono text-sm font-bold text-indigo-600">{b.booking_code}</span>
                <StatusBadge status={b.status} dot />
              </div>
              <p className="mt-2 font-semibold text-slate-900">{b.customer?.name ?? '-'}</p>
              <p className="text-sm text-slate-500">
                {b.vendor?.name ?? '-'}
                {b.service?.name ? ` · ${b.service.name}` : ''}
              </p>
              <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs">
                <span className="font-semibold text-slate-900">{formatRupiah(Number(b.total_price))}</span>
                <span className="uppercase text-slate-400">{b.payment_method}</span>
                <span className="text-slate-400">
                  {new Date(b.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          ))}
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
