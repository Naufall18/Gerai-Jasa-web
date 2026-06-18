export function AdminBookingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Semua Booking</h1>

      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Booking Code</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Customer</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Vendor</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Tanggal</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Total</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-4 text-sm font-medium text-slate-900">BK-001234</td>
              <td className="px-6 py-4 text-sm text-slate-600">Budi Santoso</td>
              <td className="px-6 py-4 text-sm text-slate-600">Salon Cantika</td>
              <td className="px-6 py-4 text-sm text-slate-600">16 Jun 2026</td>
              <td className="px-6 py-4 text-sm font-semibold text-slate-900">Rp 150,000</td>
              <td className="px-6 py-4"><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Completed</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}