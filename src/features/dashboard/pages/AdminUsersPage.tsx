import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import apiClient from '../../../api/client';
import type { ApiResponse } from '../../../types/api';
import type { User } from '../../../types/models';

const ROLE_STYLES: Record<string, string> = {
  admin:    'bg-violet-50 text-violet-700',
  vendor:   'bg-blue-50 text-blue-700',
  customer: 'bg-slate-50 text-slate-600',
};

function useUsers(page = 1, role?: string) {
  return useQuery({
    queryKey: ['admin', 'users', page, role],
    queryFn: async () => {
      // Note: endpoint /admin/users needs to be added to backend for full implementation
      // For now using /auth/me as base; admin users list requires admin-scoped API
      const res = await apiClient.get<ApiResponse<User> >('/auth/me');
      // Return single user wrapped in array for display
      return { data: [res.data.data], meta: { pagination: { total: 1, current_page: 1, per_page: 20 } } };
    },
  });
}

export function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useUsers();
  const users: User[] = (data?.data ?? []) as User[];

  const filtered = search
    ? users.filter(
        (u) =>
          u.name?.toLowerCase().includes(search.toLowerCase()) ||
          u.email?.toLowerCase().includes(search.toLowerCase())
      )
    : users;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Pengguna</h1>
          <p className="mt-1 text-sm text-slate-500">
            Endpoint <code className="rounded bg-slate-100 px-1 font-mono text-xs">/admin/users</code> perlu ditambahkan ke backend untuk list semua user.
          </p>
        </div>
        <input
          type="search"
          placeholder="Cari nama atau email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-indigo-400 md:w-72"
        />
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {['Nama', 'Email', 'Telepon', 'Role', 'Status'].map((h) => (
                <th key={h} className="px-6 py-3 text-left font-semibold text-slate-700">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading && Array.from({ length: 3 }).map((_, i) => (
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
                <td colSpan={5} className="py-10 text-center text-slate-400">Tidak ada pengguna ditemukan.</td>
              </tr>
            )}
            {!isLoading && filtered.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
                      {user.name?.[0]?.toUpperCase() ?? '?'}
                    </div>
                    <span className="font-medium text-slate-900">{user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">{user.email ?? '-'}</td>
                <td className="px-6 py-4 text-slate-600">{user.phone ?? '-'}</td>
                <td className="px-6 py-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${ROLE_STYLES[user.role] ?? 'bg-slate-50 text-slate-600'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${user.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                    {user.is_active ? 'Aktif' : 'Nonaktif'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
