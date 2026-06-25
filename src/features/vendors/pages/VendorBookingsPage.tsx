import { useState } from 'react';
import { useVendorBookings, useConfirmBooking, useCompleteBooking } from '../../bookings/hooks/useBookings';
import { PageHeader } from '../../../components/layout/PageHeader';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import type { Booking } from '../../../types/models';

type StatusFilter = 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled';

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
      <PageHeader
        title="Booking Masuk"
        subtitle="Konfirmasi dan selesaikan pesanan pelanggan Anda."
      />

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
            <div key={i} className="h-28 gj-card gj-skeleton" />
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="gj-card border border-red-200 bg-red-50 p-6 text-red-700">
          Gagal memuat booking. Pastikan Anda sudah login sebagai vendor.
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && bookings.length === 0 && (
        <div className="gj-card border border-slate-200 bg-white p-12 text-center text-slate-500">
          Tidak ada booking untuk filter ini.
        </div>
      )}

      {/* Booking List */}
      {!isLoading && bookings.length > 0 && (
        <div className="space-y-4">
          {bookings.map((booking) => {
            return (
              <div
                key={booking.id}
                className="gj-card border border-slate-200 bg-white p-6"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <p className="font-mono text-sm font-bold text-indigo-600">
                        {booking.booking_code}
                      </p>
                      <StatusBadge status={booking.status} dot />
                    </div>
                    <p className="font-semibold text-slate-900">
                      {booking.customer?.name ?? 'Pelanggan'}
                    </p>
                    <p className="text-sm text-slate-500">
                      {booking.service?.name ?? '-'} &bull;{' '}
                      {booking.time_slot?.slot_date ?? ''}{' '}
                      {booking.time_slot?.slot_time ?? ''}
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
