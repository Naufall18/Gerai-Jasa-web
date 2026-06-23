import { useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import apiClient from '../../../api/client';
import type { ApiResponse } from '../../../types/api';

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

export function VendorProfilePage() {
  const { data: vendor, isLoading } = useMyProfile();
  const [saved, setSaved] = [false, (_: boolean) => {}];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
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

  async function onSubmit(data: FormData) {
    // PATCH /vendor/profile needs backend endpoint
    alert(
      'Endpoint PATCH /api/v1/vendor/profile belum tersedia di backend.\n\n' +
      'Data yang akan disimpan:\n' +
      JSON.stringify(data, null, 2)
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-2xl bg-slate-100" />
        <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center">
        <p className="text-lg font-semibold text-amber-800">Akun ini belum terhubung ke profil vendor.</p>
        <p className="mt-2 text-sm text-amber-700">Login sebagai vendor untuk mengelola profil usaha.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Profil Usaha</h1>
          <p className="mt-1 text-sm text-slate-500">
            Slug: <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">{vendor.slug}</code>
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-5">
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
          </div>

          {/* Address & City */}
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
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting || !isDirty}
            className="rounded-2xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
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

        <p className="text-xs text-amber-700 rounded-2xl bg-amber-50 border border-amber-100 px-4 py-3">
          ⚠️ Endpoint <code className="font-mono">PATCH /api/v1/vendor/profile</code> perlu ditambahkan ke backend untuk menyimpan perubahan profil.
        </p>
      </form>
    </div>
  );
}
