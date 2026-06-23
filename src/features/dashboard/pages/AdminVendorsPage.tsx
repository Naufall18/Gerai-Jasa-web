import { useState } from 'react';
import { useAdminVendors } from '../hooks/useAdminStats';
import type { Vendor } from '../../../types/models';

const STATUS_STYLES: Record<string, string> = {
  active:    'bg-emerald-50 text-emerald-700',
  pending:   'bg-amber-50 text-amber-700',
  suspended: 'bg-red-50 text-red-700',
};

export function AdminVendorsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading, isError } = useAdminVendors(page);
  const vendors: Vendor[] = data?.data ?? [];
  const total = (data as any)?.meta?.pagination?.total ?? 0;

  const filtered = search
    ? vendors.filter(
        (v) =>
          v.name.toLowerCase().includes(search.toLowerCase()) ||
          v.city?.toLowerCase().includes(search.toLowerCase())
      )
    : vendors;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Semua Vendor</h1>
        <input
          type="search"
          placeholder="Cari vendor atau kota..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-indigo-400 md:w-72"
        />
      </div>

      {isError && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
          Gagal memuat data vendor.
        </div>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {['Vendor', 'Kota', 'Rating', 'Status', 'Komisi'].map((h) => (
                <th key={h} className="px-6 py-3 text-left font-semibold text-slate-700">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 5 }).map((__, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 animate-pulse rounded bg-slate-100" />
                    </td>
                  ))}
                </tr>
              ))}
            {!isLoading && filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-slate-400">
                  Tidak ada vendor ditemukan.
                </td>
              </tr>
            )}
            {!isLoading &&
              filtered.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">{vendor.name}</p>
                    <p className="text-xs text-slate-400">{vendor.slug}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{vendor.city ?? '-'}</td>
                  <td className="px-6 py-4 text-slate-600">
                    ⭐ {Number(vendor.rating_avg ?? 0).toFixed(1)}{' '}
                    <span className="text-xs text-slate-400">({vendor.rating_count ?? 0})</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        STATUS_STYLES[vendor.status] ?? 'bg-slate-50 text-slate-600'
                      }`}
                    >
                      {vendor.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {vendor.meta ? JSON.stringify(vendor.meta).slice(0, 20) : '-'}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total > 20 && (
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>Total {total} vendor</span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-2xl border border-slate-200 px-4 py-1 hover:bg-slate-50 disabled:opacity-40"
            >
              ← Prev
            </button>
            <span className="px-3 py-1 font-semibold text-slate-700">Hal. {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={vendors.length < 20}
              className="rounded-2xl border border-slate-200 px-4 py-1 hover:bg-slate-50 disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
