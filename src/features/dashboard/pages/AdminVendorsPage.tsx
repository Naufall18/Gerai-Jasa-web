export function AdminVendorsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Semua Vendor</h1>
        <button className="rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600">
          Tambah Vendor
        </button>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Vendor</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Kategori</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Kota</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Rating</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-4 text-sm text-slate-900 font-medium">Salon Cantika</td>
              <td className="px-6 py-4 text-sm text-slate-600">Salon</td>
              <td className="px-6 py-4 text-sm text-slate-600">Jakarta</td>
              <td className="px-6 py-4 text-sm text-slate-600">★★★★★ (4.8)</td>
              <td className="px-6 py-4"><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Active</span></td>
              <td className="px-6 py-4 text-sm">
                <button className="text-primary hover:underline">View</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}