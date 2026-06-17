export function VendorSchedulePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Jadwal Operasional</h1>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4">
        {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map((day) => (
          <div key={day} className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-b-0">
            <p className="w-20 font-medium text-slate-900">{day}</p>
            <div className="flex gap-2">
              <input type="time" className="rounded-lg border border-slate-300 px-3 py-2" defaultValue="08:00" />
              <span className="text-slate-600">-</span>
              <input type="time" className="rounded-lg border border-slate-300 px-3 py-2" defaultValue="18:00" />
            </div>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm text-slate-600">Tutup</span>
            </label>
          </div>
        ))}
      </div>

      <button className="rounded-2xl bg-primary px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-600">
        Simpan
      </button>
    </div>
  );
}