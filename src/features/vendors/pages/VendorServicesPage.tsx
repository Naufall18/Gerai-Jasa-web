import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import apiClient from '../../../api/client';
import type { ApiResponse } from '../../../types/api';
import type { Service } from '../../../types/models';

// Temporary: fetch vendor's services via /auth/me + vendor relation
// Full admin-scoped service CRUD needs a dedicated endpoint
function useVendorServices(vendorId?: string) {
  return useQuery({
    queryKey: ['vendor', 'services', vendorId],
    enabled: !!vendorId,
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<{ services?: Service[] }>>(`/vendors/${vendorId}`);
      return ((res.data.data as any)?.services ?? []) as Service[];
    },
  });
}

function useVendorId() {
  return useQuery({
    queryKey: ['vendor', 'my-id'],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<any>>('/auth/me');
      return (res.data.data as any)?.vendor?.slug as string | undefined;
    },
    staleTime: Infinity,
  });
}

function formatRupiah(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

interface ServiceForm {
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
}

export function VendorServicesPage() {
  const { data: vendorSlug } = useVendorId();
  const { data: services = [], isLoading } = useVendorServices(vendorSlug);
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ServiceForm>();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Layanan Saya</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          {showForm ? '✕ Tutup' : '+ Tambah Layanan'}
        </button>
      </div>

      {/* Add service form */}
      {showForm && (
        <form
          className="rounded-3xl border border-indigo-100 bg-indigo-50 p-6 space-y-4"
          onSubmit={handleSubmit((data) => {
            // POST /vendor/services needs backend endpoint
            alert(`Endpoint POST /vendor/services belum tersedia di backend.\nData: ${JSON.stringify(data, null, 2)}`);
            reset();
            setShowForm(false);
          })}
        >
          <h3 className="font-semibold text-indigo-800">Tambah Layanan Baru</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Nama Layanan *</label>
              <input
                {...register('name', { required: 'Wajib diisi' })}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-indigo-400"
                placeholder="cth. Potong Rambut"
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Harga (Rp) *</label>
              <input
                type="number"
                {...register('price', { required: 'Wajib diisi', min: { value: 0, message: 'Minimal 0' } })}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-indigo-400"
                placeholder="50000"
              />
              {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Durasi (menit) *</label>
              <input
                type="number"
                {...register('duration_minutes', { required: 'Wajib diisi', min: { value: 15, message: 'Minimal 15' } })}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-indigo-400"
                placeholder="30"
              />
              {errors.duration_minutes && <p className="mt-1 text-xs text-red-500">{errors.duration_minutes.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Deskripsi</label>
              <input
                {...register('description')}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-indigo-400"
                placeholder="Deskripsi singkat layanan"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="rounded-2xl bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
              Simpan
            </button>
            <button type="button" onClick={() => { reset(); setShowForm(false); }}
              className="rounded-2xl border border-slate-200 px-6 py-2 text-sm text-slate-600 hover:bg-slate-50">
              Batal
            </button>
          </div>
          <p className="text-xs text-indigo-600">
            ⚠️ Endpoint <code className="font-mono">POST /vendor/services</code> perlu ditambahkan ke backend untuk menyimpan layanan baru.
          </p>
        </form>
      )}

      {/* Services grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-3xl bg-slate-100" />
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-400">
          <p className="text-4xl">🛎️</p>
          <p className="mt-4 font-medium">Belum ada layanan</p>
          <p className="mt-1 text-sm">Tambahkan layanan agar pelanggan bisa melakukan booking.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {services.map((service) => (
            <div key={service.id} className={`rounded-3xl border p-6 ${service.is_active ? 'border-slate-200 bg-white' : 'border-dashed border-slate-200 bg-slate-50 opacity-60'}`}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">{service.name}</h3>
                  {service.description && (
                    <p className="mt-1 text-sm text-slate-500">{service.description}</p>
                  )}
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${service.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  {service.is_active ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-xl font-bold text-slate-900">{formatRupiah(service.price)}</p>
                  <p className="text-xs text-slate-400">⏱ {service.duration_minutes} menit</p>
                </div>
                <div className="flex gap-3">
                  <button className="text-sm font-medium text-indigo-600 hover:underline">Edit</button>
                  <button className="text-sm font-medium text-red-500 hover:underline">Hapus</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
