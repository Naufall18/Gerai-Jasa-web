import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import apiClient from '../../../api/client';
import type { ApiResponse } from '../../../types/api';
import { getErrorMessage } from '../../../lib/utils';
import { PageHeader } from '../../../components/layout/PageHeader';

interface Schedule {
  id?: string;
  day_of_week: number; // 0=Sun … 6=Sat
  open_time: string;   // "HH:mm:ss"
  close_time: string;
  is_closed: boolean;
}

const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const ORDERED_DAYS = [1, 2, 3, 4, 5, 6, 0]; // Mon → Sun display

const DEFAULT_SCHEDULES: Schedule[] = ORDERED_DAYS.map((dow) => ({
  day_of_week: dow,
  open_time: '08:00:00',
  close_time: '17:00:00',
  is_closed: dow === 0, // Sunday closed by default
}));

function useVendorSlug() {
  return useQuery({
    queryKey: ['vendor', 'my-slug'],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<any>>('/auth/me');
      return (res.data.data as any)?.vendor?.slug as string | undefined;
    },
    staleTime: Infinity,
  });
}

function useSchedules(vendorSlug?: string) {
  return useQuery({
    queryKey: ['vendor', 'schedules', vendorSlug],
    enabled: !!vendorSlug,
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<any>>(`/vendors/${vendorSlug}`);
      const raw: Schedule[] = (res.data.data as any)?.schedules ?? [];
      // Merge with defaults for missing days
      const byDow = Object.fromEntries(raw.map((s) => [s.day_of_week, s]));
      return ORDERED_DAYS.map((dow) => byDow[dow] ?? DEFAULT_SCHEDULES.find((d) => d.day_of_week === dow)!);
    },
  });
}

function useUpdateSchedules() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (schedules: Schedule[]) =>
      apiClient.patch('/vendor/schedules', {
        schedules: schedules.map((s) => ({
          day_of_week: s.day_of_week,
          open_time: s.open_time,
          close_time: s.close_time,
          is_closed: s.is_closed,
        })),
      }),
    onSuccess: () => {
      toast.success('Jadwal berhasil disimpan.');
      qc.invalidateQueries({ queryKey: ['vendor', 'schedules'] });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });
}

export function VendorSchedulePage() {
  const { data: vendorSlug } = useVendorSlug();
  const { data: schedules = DEFAULT_SCHEDULES, isLoading } = useSchedules(vendorSlug);
  const [local, setLocal] = useState<Schedule[] | null>(null);
  const updateMutation = useUpdateSchedules();

  const display = local ?? schedules;

  function update(dow: number, patch: Partial<Schedule>) {
    setLocal((prev) =>
      (prev ?? schedules).map((s) => (s.day_of_week === dow ? { ...s, ...patch } : s))
    );
  }

  function handleSave() {
    updateMutation.mutate(display, { onSuccess: () => setLocal(null) });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Jadwal Operasional"
        subtitle="Atur hari & jam buka. Slot booking dibuat otomatis dari jadwal ini."
      />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      ) : (
        <div className="gj-card border border-slate-200 bg-white divide-y divide-slate-100">
          {display.map((schedule) => (
            <div
              key={schedule.day_of_week}
              className={`flex flex-col gap-3 p-5 md:flex-row md:items-center ${schedule.is_closed ? 'opacity-50' : ''}`}
            >
              {/* Day name */}
              <div className="w-24 font-semibold text-slate-800">
                {DAYS[schedule.day_of_week]}
              </div>

              {/* Time inputs */}
              <div className="flex flex-1 items-center gap-3">
                <input
                  type="time"
                  value={schedule.open_time.slice(0, 5)}
                  disabled={schedule.is_closed}
                  onChange={(e) => update(schedule.day_of_week, { open_time: e.target.value + ':00' })}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 disabled:bg-slate-50 disabled:text-slate-300"
                />
                <span className="text-slate-400">–</span>
                <input
                  type="time"
                  value={schedule.close_time.slice(0, 5)}
                  disabled={schedule.is_closed}
                  onChange={(e) => update(schedule.day_of_week, { close_time: e.target.value + ':00' })}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 disabled:bg-slate-50 disabled:text-slate-300"
                />
              </div>

              {/* Closed toggle */}
              <label className="flex cursor-pointer items-center gap-2">
                <div
                  onClick={() => update(schedule.day_of_week, { is_closed: !schedule.is_closed })}
                  className={`relative h-6 w-11 rounded-full transition ${schedule.is_closed ? 'bg-red-400' : 'bg-emerald-400'}`}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${schedule.is_closed ? 'left-0.5' : 'left-[22px]'}`} />
                </div>
                <span className="text-sm text-slate-600">{schedule.is_closed ? 'Tutup' : 'Buka'}</span>
              </label>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={isLoading || updateMutation.isPending}
          className="rounded-2xl bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {updateMutation.isPending ? 'Menyimpan...' : 'Simpan Jadwal'}
        </button>
        {local && (
          <button
            onClick={() => setLocal(null)}
            className="rounded-2xl border border-slate-200 px-6 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
