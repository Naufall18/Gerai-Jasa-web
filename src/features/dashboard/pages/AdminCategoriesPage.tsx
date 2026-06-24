import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useCategories } from '../hooks/useAdminStats';
import apiClient from '../../../api/client';
import { getErrorMessage } from '../../../lib/utils';
import type { Category } from '../../../types/models';

// Simple icon map fallback if no icon_url
const ICON_MAP: Record<string, string> = {
  salon: '💇', bengkel: '⚙️', klinik: '⚕️', spa: '🛁',
  gym: '🏋️', laundry: '🫧', default: '🏪',
};

function getCategoryIcon(name: string, iconUrl?: string) {
  if (iconUrl) return <img src={iconUrl} alt={name} className="h-8 w-8 object-contain" />;
  const key = name.toLowerCase();
  const emoji = ICON_MAP[key] ?? ICON_MAP.default;
  return <span className="text-3xl">{emoji}</span>;
}

interface CategoryForm {
  name: string;
  description: string;
  icon_url: string;
}

function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CategoryForm) => apiClient.post('/admin/categories', payload),
    onSuccess: () => {
      toast.success('Kategori berhasil ditambahkan.');
      qc.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });
}

export function AdminCategoriesPage() {
  const { data: categories = [], isLoading, isError } = useCategories();
  const createMutation = useCreateCategory();
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CategoryForm>();

  function onSubmit(data: CategoryForm) {
    createMutation.mutate(data, {
      onSuccess: () => { reset(); setShowForm(false); },
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Kategori Layanan</h1>
        <button
          className="rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          onClick={() => setShowForm(true)}
        >
          + Tambah Kategori
        </button>
      </div>

      {isError && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
          Gagal memuat kategori.
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-3xl bg-slate-100" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.length === 0 && (
            <p className="col-span-3 py-10 text-center text-slate-400">
              Belum ada kategori. Jalankan seeder terlebih dahulu.
            </p>
          )}
          {(categories as Category[]).map((cat) => (
            <div
              key={cat.id}
              className={`rounded-3xl border p-6 transition ${
                cat.is_active
                  ? 'border-slate-200 bg-white'
                  : 'border-dashed border-slate-200 bg-slate-50 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>{getCategoryIcon(cat.name, cat.icon_url)}</div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    cat.is_active
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {cat.is_active ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">{cat.name}</h3>
              {cat.description && (
                <p className="mt-1 text-sm text-slate-500 line-clamp-2">{cat.description}</p>
              )}
              <p className="mt-2 font-mono text-xs text-slate-400">{cat.slug}</p>
            </div>
          ))}
        </div>
      )}

      {/* Add category modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Tambah Kategori Baru</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Nama Kategori *</label>
                <input
                  {...register('name', { required: 'Wajib diisi' })}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-indigo-400"
                  placeholder="cth. Barbershop"
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Deskripsi</label>
                <input
                  {...register('description')}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-indigo-400"
                  placeholder="Deskripsi singkat kategori"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">URL Ikon (opsional)</label>
                <input
                  {...register('icon_url')}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-indigo-400"
                  placeholder="https://..."
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="rounded-2xl bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {createMutation.isPending ? 'Menyimpan...' : 'Simpan'}
                </button>
                <button
                  type="button"
                  onClick={() => { reset(); setShowForm(false); }}
                  className="rounded-2xl border border-slate-200 px-6 py-2 text-sm text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
