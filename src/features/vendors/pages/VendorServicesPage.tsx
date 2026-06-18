export function VendorServicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Layanan Saya</h1>
        <button className="rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600">
          Tambah Layanan
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <h3 className="font-semibold text-slate-900">Potong Rambut</h3>
          <p className="mt-2 text-2xl font-bold text-slate-900">Rp 50,000</p>
          <p className="mt-1 text-sm text-slate-600">Durasi: 30 menit</p>
          <div className="mt-4 flex gap-2">
            <button className="text-sm text-primary hover:underline">Edit</button>
            <button className="text-sm text-red-500 hover:underline">Hapus</button>
          </div>
        </div>
      </div>
    </div>
  );
}