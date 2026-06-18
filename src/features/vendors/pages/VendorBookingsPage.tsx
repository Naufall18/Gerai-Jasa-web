export function VendorBookingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Booking Masuk</h1>

      <div className="flex gap-2">
        <button className="rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-white">Semua</button>
        <button className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Menunggu</button>
        <button className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Dikonfirmasi</button>
      </div>

      <div className="space-y-4">
        <div className="rounded-3xl border-l-4 border-l-primary border border-slate-200 bg-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold text-slate-900">Budi Santoso</p>
              <p className="mt-1 text-sm text-slate-600">Potong Rambut + Styling - 16 Jun 2026, 14:00</p>
              <p className="mt-2 text-sm text-slate-600">Rp 150,000</p>
            </div>
            <div className="flex gap-2">
              <button className="rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600">Konfirmasi</button>
              <button className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Tolak</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}