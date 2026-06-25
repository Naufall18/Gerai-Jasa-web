import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import apiClient from '../../../api/client';
import type { ApiResponse } from '../../../types/api';
import { getErrorMessage } from '../../../lib/utils';
import { PageHeader } from '../../../components/layout/PageHeader';

interface VendorProfile {
  id: string;
  name: string;
  slug: string;
  description?: string;
  address?: string;
  city?: string;
  phone?: string;
}

const schema = z.object({
  name:        z.string().min(3, 'Minimal 3 karakter'),
  description: z.string().optional(),
  address:     z.string().optional(),
  city:        z.string().optional(),
});
type FormData = z.infer<typeof schema>;

function useMyProfile() {
  return useQuery({
    queryKey: ['vendor', 'my-profile'],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<any>>('/auth/me');
      return (res.data.data as any)?.vendor as VendorProfile | undefined;
    },
    staleTime: 60_000,
  });
}

function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: FormData) => apiClient.patch('/vendor/profile', payload),
    onSuccess: () => {
      toast.success('Profil berhasil disimpan.');
      qc.invalidateQueries({ queryKey: ['vendor', 'my-profile'] });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });
}

export function VendorProfilePage() {
  const { data: vendor, isLoading } = useMyProfile();
  const updateMutation = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  // Populate form when vendor data loads
  useEffect(() => {
    if (vendor) {
      reset({
        name:        vendor.name ?? '',
        description: vendor.description ?? '',
        address:     vendor.address ?? '',
        city:        vendor.city ?? '',
      });
    }
  }, [vendor, reset]);

  function onSubmit(data: FormData) {
    updateMutation.mutate(data, { onSuccess: () => reset(data) });
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 rounded-2xl gj-skeleton" />
        <div className="gj-card border border-slate-200 bg-white p-6 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 rounded-2xl gj-skeleton" />
          ))}
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="gj-card border border-amber-200 bg-amber-50 p-8 text-center">
        <p className="text-lg font-semibold text-amber-800">Akun ini belum terhubung ke profil vendor.</p>
        <p className="mt-2 text-sm text-amber-700">Login sebagai vendor untuk mengelola profil usaha.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profil Usaha"
        subtitle="Informasi yang dilihat pelanggan saat menemukan usaha Anda."
        actions={
          <span className="rounded-full bg-slate-100 px-3 py-1 font-mono text-xs text-slate-500">/{vendor.slug}</span>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Section: Identitas Usaha */}
        <section className="gj-card border border-slate-200 bg-white p-6">
          <div className="mb-5">
            <h2 className="font-heading text-base font-bold text-slate-900">Identitas Usaha</h2>
            <p className="mt-0.5 text-sm text-slate-500">Nama & deskripsi yang tampil di halaman vendor.</p>
          </div>
          <div className="space-y-5">
            {/* Nama Usaha */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Nama Usaha <span className="text-red-500">*</span>
              </label>
              <input
                {...register('name')}
                className={`w-full rounded-2xl border px-4 py-2.5 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 ${errors.name ? 'border-red-400' : 'border-slate-200'}`}
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>

            {/* Deskripsi */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Deskripsi</label>
              <textarea
                {...register('description')}
                rows={4}
                placeholder="Ceritakan tentang usaha Anda..."
                className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 resize-none"
              />
              <p className="mt-1 text-xs text-slate-400">Deskripsi singkat membantu pelanggan mengenal usaha Anda.</p>
            </div>
          </div>
        </section>

        {/* Section: Lokasi */}
        <section className="gj-card border border-slate-200 bg-white p-6">
          <div className="mb-5">
            <h2 className="font-heading text-base font-bold text-slate-900">Lokasi</h2>
            <p className="mt-0.5 text-sm text-slate-500">Alamat usaha agar mudah ditemukan pelanggan.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Alamat</label>
              <input
                {...register('address')}
                placeholder="Jl. Contoh No. 1, Jakarta Selatan"
                className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Kota</label>
              <input
                {...register('city')}
                placeholder="Jakarta"
                className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>
        </section>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={updateMutation.isPending || !isDirty}
            className="rounded-2xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            {updateMutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
          {isDirty && (
            <button
              type="button"
              onClick={() => reset()}
              className="rounded-2xl border border-slate-200 px-6 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
            >
              Reset
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
