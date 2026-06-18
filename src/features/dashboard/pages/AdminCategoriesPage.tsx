export function AdminCategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Kategori</h1>
        <button className="rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600">
          Tambah Kategori
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="text-3xl">💇</div>
          <h3 className="mt-3 font-semibold text-slate-900">Salon</h3>
          <p className="mt-1 text-sm text-slate-600">245 vendors</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="text-3xl">⚙️</div>
          <h3 className="mt-3 font-semibold text-slate-900">Bengkel</h3>
          <p className="mt-1 text-sm text-slate-600">156 vendors</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="text-3xl">⚕️</div>
          <h3 className="mt-3 font-semibold text-slate-900">Klinik</h3>
          <p className="mt-1 text-sm text-slate-600">89 vendors</p>
        </div>
      </div>
    </div>
  );
}