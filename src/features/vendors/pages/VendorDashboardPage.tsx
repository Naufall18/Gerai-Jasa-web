export function VendorDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-r from-primary to-indigo-600 p-6 text-white">
        <p className="text-sm opacity-90">Selamat datang,</p>
        <h2 className="mt-2 text-3xl font-bold">Salon Cantika</h2>
        <p className="mt-2 opacity-90">Anda punya 3 booking menunggu konfirmasi</p>
        <button className="mt-4 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-primary hover:bg-slate-100">
          Lihat Sekarang
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-500">Booking Hari Ini</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">5</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-500">Konfirmasi Ditunggu</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">3</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-500">Pendapatan Bulan Ini</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">Rp 5.2M</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-500">Rating Rata-rata</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">4.8 ★</p>
        </div>
      </div>
    </div>
  );
}