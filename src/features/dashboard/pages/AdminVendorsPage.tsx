import { useState } from 'react';
import { useAdminVendors } from '../hooks/useAdminStats';
import { PageHeader } from '../../../components/layout/PageHeader';
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
  const total = data?.meta?.pagination?.total ?? 0;

  const filtered = search
    ? vendors.filter(
        (v) =>
          v.name.toLowerCase().includes(search.toLowerCase()) ||
          v.city?.toLowerCase().includes(search.toLowerCase())
      )
    : vendors;

  return (
    <div>
      <PageHeader
        title="Manajemen Vendor"
        subtitle={`${total || vendors.length} vendor terdaftar di platform`}
        actions={
          <input
            type="search"
            placeholder="Cari vendor atau kota…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-indigo-400 sm:w-72"
          />
        }
      />

      {isError && (
        <div className="gj-card border border-red-200 bg-red-50 p-6 text-red-700">
          Gagal memuat data vendor.
        </div>
      )}

      {/* Desktop: tabel */}
      <div className="gj-card hidden border border-slate-200 bg-white overflow-hidden md:block">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50/60">
            <tr>
              {['Vendor', 'Kota', 'Rating', 'Status', 'Komisi'].map((h) => (
                <th key={h} className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 5 }).map((__, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 rounded gj-skeleton" />
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
                <tr key={vendor.id} className="transition hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-sm font-bold text-indigo-700">
                        {vendor.name?.[0]?.toUpperCase() ?? '?'}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{vendor.name}</p>
                        <p className="text-xs text-slate-400">{vendor.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{vendor.city ?? '-'}</td>
                  <td className="px-6 py-4 text-slate-600">
                    <span className="font-medium text-amber-600">★</span> {Number(vendor.rating_avg ?? 0).toFixed(1)}{' '}
                    <span className="text-xs text-slate-400">({vendor.rating_count ?? 0})</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[vendor.status] ?? 'bg-slate-50 text-slate-600'}`}>
                      {vendor.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {vendor.commission_rate != null ? `${Number(vendor.commission_rate)}%` : '-'}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Mobile: daftar kartu */}
      <div className="space-y-3 md:hidden">
        {isLoading &&
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="gj-card border border-slate-200 bg-white p-4">
              <div className="h-16 rounded gj-skeleton" />
            </div>
          ))}

        {!isLoading && filtered.length === 0 && (
          <div className="gj-card border border-slate-200 bg-white p-8 text-center text-slate-400">
            Tidak ada vendor ditemukan.
          </div>
        )}

        {!isLoading &&
          filtered.map((vendor) => (
            <div key={vendor.id} className="gj-card border border-slate-200 bg-white p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-sm font-bold text-indigo-700">
                  {vendor.name?.[0]?.toUpperCase() ?? '?'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">{vendor.name}</p>
                      <p className="truncate text-xs text-slate-400">{vendor.slug}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[vendor.status] ?? 'bg-slate-50 text-slate-600'}`}>
                      {vendor.status}
                    </span>
                  </div>
                  <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                    <span>{vendor.city ?? '-'}</span>
                    <span>
                      <span className="font-medium text-amber-600">★</span> {Number(vendor.rating_avg ?? 0).toFixed(1)}{' '}
                      <span className="text-slate-400">({vendor.rating_count ?? 0})</span>
                    </span>
                    <span>Komisi {vendor.commission_rate != null ? `${Number(vendor.commission_rate)}%` : '-'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
