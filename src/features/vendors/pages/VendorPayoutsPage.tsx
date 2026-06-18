export function VendorPayoutsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Penarikan Dana</h1>

      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-500">Saldo Tersedia</p>
        <p className="mt-2 text-3xl font-bold text-slate-900">Rp 2.5M</p>
        <button className="mt-4 rounded-2xl bg-primary px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-600">
          Tarik Dana
        </button>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Tanggal</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Jumlah</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-4 text-sm text-slate-600">10 Jun 2026</td>
              <td className="px-6 py-4 text-sm font-semibold text-slate-900">Rp 1.5M</td>
              <td className="px-6 py-4"><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Completed</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}