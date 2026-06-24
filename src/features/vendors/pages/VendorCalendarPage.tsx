import { useState } from 'react';
import {
  addMonths, eachDayOfInterval, endOfMonth, endOfWeek,
  format, isSameDay, isSameMonth, isToday, startOfMonth, startOfWeek, subMonths,
} from 'date-fns';
import { id } from 'date-fns/locale';
import { useVendorBookings } from '../../bookings/hooks/useBookings';
import { PageHeader } from '../../../components/layout/PageHeader';
import type { Booking } from '../../../types/models';

const STATUS_DOT: Record<string, string> = {
  pending:   'bg-amber-400',
  confirmed: 'bg-blue-500',
  completed: 'bg-emerald-500',
  cancelled: 'bg-red-400',
};

export function VendorCalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { data, isLoading } = useVendorBookings(1);
  const bookings: Booking[] = data?.data ?? [];

  // Build a map: "yyyy-MM-dd" → Booking[]
  const bookingsByDate = bookings.reduce<Record<string, Booking[]>>((acc, b) => {
    const slot = (b as any).time_slot;
    if (!slot?.slot_date) return acc;
    const key = slot.slot_date as string;
    acc[key] = [...(acc[key] ?? []), b];
    return acc;
  }, {});

  const monthStart = startOfMonth(currentMonth);
  const monthEnd   = endOfMonth(currentMonth);
  const calStart   = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd     = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const allDays    = eachDayOfInterval({ start: calStart, end: calEnd });

  const selectedKey      = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;
  const selectedBookings = selectedKey ? (bookingsByDate[selectedKey] ?? []) : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kalender Booking"
        subtitle="Lihat sebaran booking Anda per tanggal."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <div className="lg:col-span-2 gj-card border border-slate-200 bg-white p-6">
          {/* Month nav */}
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
              className="rounded-xl p-2 hover:bg-slate-100 text-slate-600"
            >‹</button>
            <h2 className="text-lg font-semibold text-slate-900 capitalize">
              {format(currentMonth, 'MMMM yyyy', { locale: id })}
            </h2>
            <button
              onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
              className="rounded-xl p-2 hover:bg-slate-100 text-slate-600"
            >›</button>
          </div>

          {/* Day headers */}
          <div className="mb-2 grid grid-cols-7 text-center">
            {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((d) => (
              <div key={d} className="py-2 text-xs font-semibold uppercase text-slate-400">{d}</div>
            ))}
          </div>

          {/* Day cells */}
          {isLoading ? (
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 35 }).map((_, i) => (
                <div key={i} className="h-14 rounded-xl gj-skeleton" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {allDays.map((day) => {
                const key       = format(day, 'yyyy-MM-dd');
                const dayEvents = bookingsByDate[key] ?? [];
                const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
                const inMonth    = isSameMonth(day, currentMonth);

                return (
                  <button
                    key={key}
                    onClick={() => setSelectedDate(isSameDay(day, selectedDate ?? new Date(0)) ? null : day)}
                    className={`relative flex flex-col items-center rounded-xl p-1 pt-2 text-sm transition
                      ${!inMonth ? 'opacity-30' : ''}
                      ${isToday(day) ? 'font-bold' : ''}
                      ${isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'hover:bg-slate-50 text-slate-800'
                      }
                    `}
                  >
                    <span>{format(day, 'd')}</span>
                    {/* Event dots */}
                    {dayEvents.length > 0 && (
                      <div className="mt-1 flex gap-0.5 flex-wrap justify-center">
                        {dayEvents.slice(0, 3).map((b) => (
                          <span
                            key={b.id}
                            className={`h-1.5 w-1.5 rounded-full ${
                              isSelected ? 'bg-white' : STATUS_DOT[b.status] ?? 'bg-slate-400'
                            }`}
                          />
                        ))}
                        {dayEvents.length > 3 && (
                          <span className={`text-[9px] leading-none ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                            +{dayEvents.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar — selected day bookings */}
        <div className="gj-card border border-slate-200 bg-white p-6">
          <h3 className="mb-4 font-semibold text-slate-900">
            {selectedDate
              ? format(selectedDate, 'EEEE, d MMMM yyyy', { locale: id })
              : 'Pilih tanggal'}
          </h3>

          {!selectedDate && (
            <p className="text-sm text-slate-400">Klik tanggal di kalender untuk melihat booking.</p>
          )}

          {selectedDate && selectedBookings.length === 0 && (
            <p className="text-sm text-slate-400">Tidak ada booking di tanggal ini.</p>
          )}

          <div className="space-y-3">
            {selectedBookings.map((b) => {
              const slot = (b as any).time_slot;
              return (
                <div key={b.id} className="rounded-2xl border border-slate-100 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-indigo-600">{b.booking_code}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      b.status === 'pending'   ? 'bg-amber-50 text-amber-700' :
                      b.status === 'confirmed' ? 'bg-blue-50 text-blue-700' :
                      b.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                      'bg-red-50 text-red-700'
                    }`}>{b.status}</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {(b as any).customer?.name ?? 'Pelanggan'}
                  </p>
                  <p className="text-xs text-slate-500">
                    {(b as any).service?.name ?? '-'} · {slot?.slot_time?.slice(0, 5) ?? '-'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-slate-500">
        {Object.entries(STATUS_DOT).map(([status, cls]) => (
          <div key={status} className="flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-full ${cls}`} />
            <span className="capitalize">{status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
