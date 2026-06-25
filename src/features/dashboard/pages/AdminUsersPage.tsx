import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useState } from 'react';
import apiClient from '../../../api/client';
import { PageHeader } from '../../../components/layout/PageHeader';
import type { ApiResponse } from '../../../types/api';
import type { User } from '../../../types/models';

const ROLE_STYLES: Record<string, string> = {
  admin:    'bg-amber-50 text-amber-700',
  vendor:   'bg-indigo-50 text-indigo-700',
  customer: 'bg-slate-100 text-slate-600',
};

interface UsersMeta {
  pagination: { current_page: number; per_page: number; total: number; last_page: number };
}

function useUsers(page: number, search: string, role: string) {
  return useQuery({
    queryKey: ['admin', 'users', page, search, role],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const params: Record<string, unknown> = { page };
      if (search) params.search = search;
      if (role) params.role = role;
      const res = await apiClient.get<ApiResponse<User[]> & { meta: UsersMeta }>('/admin/users', { params });
      return res.data;
    },
  });
}

const ROLE_FILTERS = [
  { key: '', label: 'Semua' },
  { key: 'admin', label: 'Admin' },
  { key: 'vendor', label: 'Vendor' },
  { key: 'customer', label: 'Pelanggan' },
];

export function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');

  const { data, isLoading, isError } = useUsers(page, search, role);
  const users: User[] = data?.data ?? [];
  const total = data?.meta?.pagination?.total ?? 0;
  const lastPage = data?.meta?.pagination?.last_page ?? 1;

  return (
    <div>
      <PageHeader
        title="Pengguna"
        subtitle={`${total} akun terdaftar di Gerai Jasa`}
        actions={
          <input
            type="search"
            placeholder="Cari nama, email, telepon…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-indigo-400 sm:w-72"
          />
        }
      />

      {/* Role filter */}
      <div className="mb-5 flex flex-wrap gap-2">
        {ROLE_FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => { setRole(f.key); setPage(1); }}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              role === f.key ? 'bg-indigo-600 text-white' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isError && (
        <div className="gj-card border border-red-200 bg-red-50 p-6 text-red-700">
          Gagal memuat data pengguna. Pastikan Anda login sebagai admin.
        </div>
      )}

      {/* Desktop: tabel */}
      <div className="gj-card hidden border border-slate-200 bg-white overflow-hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50/60">
              <tr>
                {['Nama', 'Kontak', 'Role', 'Status', 'Bergabung'].map((h) => (
                  <th key={h} className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 5 }).map((__, j) => (
                    <td key={j} className="px-6 py-4"><div className="h-4 rounded gj-skeleton" /></td>
                  ))}
                </tr>
              ))}

              {!isLoading && users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-14 text-center">
                    <p className="font-medium text-slate-600">Tidak ada pengguna</p>
                    <p className="mt-1 text-sm text-slate-400">Coba ubah kata kunci atau filter role.</p>
                  </td>
                </tr>
              )}

              {!isLoading && users.map((user) => (
                <tr key={user.id} className="transition hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-sm font-bold text-indigo-700">
                        {user.name?.[0]?.toUpperCase() ?? '?'}
                      </div>
                      <span className="font-semibold text-slate-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-slate-700">{user.email ?? '-'}</p>
                    <p className="text-xs text-slate-400">{user.phone ?? '-'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${ROLE_STYLES[user.role] ?? 'bg-slate-50 text-slate-600'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${user.is_active ? 'text-emerald-700' : 'text-red-600'}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${user.is_active ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      {user.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
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
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="gj-card border border-slate-200 bg-white p-4">
              <div className="h-14 rounded gj-skeleton" />
            </div>
          ))}

        {!isLoading && users.length === 0 && (
          <div className="gj-card border border-slate-200 bg-white p-8 text-center">
            <p className="font-medium text-slate-600">Tidak ada pengguna</p>
            <p className="mt-1 text-sm text-slate-400">Coba ubah kata kunci atau filter role.</p>
          </div>
        )}

        {!isLoading &&
          users.map((user) => (
            <div key={user.id} className="gj-card border border-slate-200 bg-white p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-sm font-bold text-indigo-700">
                  {user.name?.[0]?.toUpperCase() ?? '?'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate font-semibold text-slate-900">{user.name}</p>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${ROLE_STYLES[user.role] ?? 'bg-slate-50 text-slate-600'}`}>
                      {user.role}
                    </span>
                  </div>
                  <p className="truncate text-sm text-slate-600">{user.email ?? '-'}</p>
                  <p className="text-xs text-slate-400">{user.phone ?? '-'}</p>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className={`inline-flex items-center gap-1.5 font-medium ${user.is_active ? 'text-emerald-700' : 'text-red-600'}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${user.is_active ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      {user.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                    <span className="text-slate-400">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Pagination */}
      {lastPage > 1 && (
        <div className="mt-5 flex items-center justify-between text-sm text-slate-500">
          <span>Halaman {page} dari {lastPage}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-1.5 transition hover:bg-slate-50 disabled:opacity-40"
            >← Sebelumnya</button>
            <button
              onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
              disabled={page >= lastPage}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-1.5 transition hover:bg-slate-50 disabled:opacity-40"
            >Berikutnya →</button>
          </div>
        </div>
      )}
    </div>
  );
}
