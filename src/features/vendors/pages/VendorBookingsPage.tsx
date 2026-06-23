import { useState } from 'react';
import { useVendorBookings, useConfirmBooking, useCompleteBooking } from '../../bookings/hooks/useBookings';
import type { Booking } from '../../../types/models';

type StatusFilter = 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled';

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  pending:   { label: 'Menunggu',   cls: 'bg-amber-50 text-amber-700' },
  confirmed: { label: 'Dikonfirmasi', cls: 'bg-blue-50 text-blue-700' },
  completed: { label: 'Selesai',    cls: 'bg-emerald-50 text-emerald-700' },
  cancelled: { label: 'Dibatalkan', cls: 'bg-red-50 text-red-700' },
  in_progress: { label: 'Berlangsung', cls: 'bg-indigo-50 text-indigo-700' },
};

function formatRupiah(amount: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
}

export function VendorBookingsPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const { data, isLoading, isError } = useVendorBookings(
    1,
    statusFilter === 'all' ? undefined : statusFilter
  );
  const confirmMutation = useConfirmBooking();
  const completeMutation = useCompleteBooking();

  const bookings: Booking[] = data?.data ?? [];

  const filters: { key: StatusFilter; label: string }[] = [
    { key: 'all',       label: 'Semua' },
    { key: 'pending',   label: 'Menunggu' },
    { key: 'confirmed', label: 'Dikonfirmasi' },
    { key: 'completed', label: 'Selesai' },
    { key: 'cancelled', label: 'Dibatalkan' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Booking Masuk</h1>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setStatusFilter(f.key)}
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

      {/* Loading */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-3xl bg-slate-100" />
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
          Gagal memuat booking. Pastikan Anda sudah login sebagai vendor.
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && bookings.length === 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500">
          Tidak ada booking untuk filter ini.
        </div>
      )}

      {/* Booking List */}
      {!isLoading && bookings.length > 0 && (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const statusInfo = STATUS_LABELS[booking.status] ?? { label: booking.status, cls: 'bg-slate-50 text-slate-700' };
            return (
              <div
                key={booking.id}
                className="rounded-3xl border border-slate-200 bg-white p-6"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <p className="font-mono text-sm font-bold text-indigo-600">
                        {booking.booking_code}
                      </p>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusInfo.cls}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                    <p className="font-semibold text-slate-900">
                      {/* @ts-ignore — relations loaded from API */}
                      {(booking as any).customer?.name ?? 'Pelanggan'}
                    </p>
                    <p className="text-sm text-slate-500">
                      {/* @ts-ignore */}
                      {(booking as any).service?.name ?? '-'} &bull;{' '}
                      {/* @ts-ignore */}
                      {(booking as any).time_slot?.slot_date ?? ''}{' '}
                      {/* @ts-ignore */}
                      {(booking as any).time_slot?.slot_time ?? ''}
                    </p>
                    <p className="text-sm font-semibold text-slate-900">
                      {formatRupiah(Number(booking.total_price))}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {booking.status === 'pending' && (
                      <button
                        onClick={() => confirmMutation.mutate(booking.id)}
                        disabled={confirmMutation.isPending}
                        className="rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                      >
                        {confirmMutation.isPending ? 'Proses...' : 'Konfirmasi'}
                      </button>
                    )}
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => completeMutation.mutate(booking.id)}
                        disabled={completeMutation.isPending}
                        className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                      >
                        {completeMutation.isPending ? 'Proses...' : 'Selesai'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination info */}
      {data?.meta?.pagination && (
        <p className="text-sm text-slate-400 text-right">
          Menampilkan {bookings.length} dari {data.meta.pagination.total} booking
        </p>
      )}
    </div>
  );
}
