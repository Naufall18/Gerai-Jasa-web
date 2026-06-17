export function VendorProfilePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Profil Usaha</h1>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Nama Usaha</label>
          <input type="text" defaultValue="Salon Cantika" className="w-full rounded-2xl border border-slate-300 px-4 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Deskripsi</label>
          <textarea className="w-full rounded-2xl border border-slate-300 px-4 py-2" rows={4} defaultValue="Salon modern dengan pelayanan terbaik di kelasnya" />
        </div>
        <button className="rounded-2xl bg-primary px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-600">
          Simpan
        </button>
      </div>
    </div>
  );
}