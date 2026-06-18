export function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-500">Total Bookings</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">1,234</p>
          <p className="mt-1 text-xs text-emerald-600">+12% vs last month</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-500">Total Revenue</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">Rp 45.2M</p>
          <p className="mt-1 text-xs text-emerald-600">+8% vs last month</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-500">Active Vendors</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">312</p>
          <p className="mt-1 text-xs text-amber-600">3 pending approval</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-500">New Users</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">567</p>
          <p className="mt-1 text-xs text-emerald-600">+24% vs last month</p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-900">Recent Bookings</h2>
        <table className="mt-6 w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="pb-3 text-left text-sm font-semibold text-slate-700">Booking Code</th>
              <th className="pb-3 text-left text-sm font-semibold text-slate-700">Customer</th>
              <th className="pb-3 text-left text-sm font-semibold text-slate-700">Vendor</th>
              <th className="pb-3 text-left text-sm font-semibold text-slate-700">Status</th>
              <th className="pb-3 text-left text-sm font-semibold text-slate-700">Amount</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            <tr className="border-b border-slate-100">
              <td className="py-3 text-slate-900">BK-001234</td>
              <td className="py-3 text-slate-600">Budi Santoso</td>
              <td className="py-3 text-slate-600">Salon Cantika</td>
              <td className="py-3"><span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">Completed</span></td>
              <td className="py-3 font-semibold text-slate-900">Rp 150,000</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}