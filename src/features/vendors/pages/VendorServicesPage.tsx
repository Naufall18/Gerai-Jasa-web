import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import apiClient from '../../../api/client';
import type { ApiResponse } from '../../../types/api';
import type { Service } from '../../../types/models';
import { getErrorMessage } from '../../../lib/utils';
import { PageHeader } from '../../../components/layout/PageHeader';

function useServices() {
  return useQuery({
    queryKey: ['vendor', 'services'],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Service[]>>('/vendor/services');
      return res.data.data ?? [];
    },
  });
}

function useCreateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ServiceForm) => apiClient.post('/vendor/services', payload),
    onSuccess: () => {
      toast.success('Layanan berhasil ditambahkan.');
      qc.invalidateQueries({ queryKey: ['vendor', 'services'] });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });
}

function useUpdateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ServiceForm> & { is_active?: boolean } }) =>
      apiClient.patch(`/vendor/services/${id}`, payload),
    onSuccess: () => {
      toast.success('Layanan berhasil diperbarui.');
      qc.invalidateQueries({ queryKey: ['vendor', 'services'] });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });
}

function useDeleteService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/vendor/services/${id}`),
    onSuccess: () => {
      toast.success('Layanan dihapus.');
      qc.invalidateQueries({ queryKey: ['vendor', 'services'] });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
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
  const { data: services = [], isLoading, isError } = useServices();
  const createMutation = useCreateService();
  const updateMutation = useUpdateService();
  const deleteMutation = useDeleteService();

  // null = closed, 'new' = create, Service = edit
  const [editing, setEditing] = useState<Service | 'new' | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ServiceForm>();

  // Sync form values when opening the modal
  useEffect(() => {
    if (editing === 'new') {
      reset({ name: '', description: '', price: 0, duration_minutes: 30 });
    } else if (editing) {
      reset({
        name: editing.name,
        description: editing.description ?? '',
        price: editing.price,
        duration_minutes: editing.duration_minutes,
      });
    }
  }, [editing, reset]);

  function onSubmit(data: ServiceForm) {
    const payload: ServiceForm = {
      ...data,
      price: Number(data.price),
      duration_minutes: Number(data.duration_minutes),
    };
    if (editing === 'new') {
      createMutation.mutate(payload, { onSuccess: () => setEditing(null) });
    } else if (editing) {
      updateMutation.mutate({ id: editing.id, payload }, { onSuccess: () => setEditing(null) });
    }
  }

  function handleDelete(service: Service) {
    if (window.confirm(`Hapus layanan "${service.name}"? Tindakan ini tidak bisa dibatalkan.`)) {
      deleteMutation.mutate(service.id);
    }
  }

  function handleToggleActive(service: Service) {
    updateMutation.mutate({ id: service.id, payload: { is_active: !service.is_active } });
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Layanan Saya"
        subtitle="Kelola daftar layanan yang bisa dipesan pelanggan."
        actions={
          <button
            onClick={() => setEditing('new')}
            className="rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.98]"
          >
            + Tambah Layanan
          </button>
        }
      />

      {/* Services grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse gj-card bg-slate-100" />
          ))}
        </div>
      ) : isError ? (
        <div className="gj-card border border-red-200 bg-red-50 p-6 text-red-700">
          Gagal memuat layanan. Pastikan Anda login sebagai vendor.
        </div>
      ) : services.length === 0 ? (
        <div className="gj-card border border-slate-200 bg-white p-12 text-center text-slate-400">
          <p className="text-4xl">🛎️</p>
          <p className="mt-4 font-medium">Belum ada layanan</p>
          <p className="mt-1 text-sm">Tambahkan layanan agar pelanggan bisa melakukan booking.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {services.map((service) => (
            <div key={service.id} className={`gj-card border p-6 ${service.is_active ? 'border-slate-200 bg-white' : 'border-dashed border-slate-200 bg-slate-50 opacity-60'}`}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">{service.name}</h3>
                  {service.description && (
                    <p className="mt-1 text-sm text-slate-500">{service.description}</p>
                  )}
                </div>
                <button
                  onClick={() => handleToggleActive(service)}
                  disabled={updateMutation.isPending}
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold transition hover:opacity-80 disabled:opacity-50 ${service.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}
                  title="Klik untuk ubah status"
                >
                  {service.is_active ? 'Aktif' : 'Nonaktif'}
                </button>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-xl font-bold text-slate-900">{formatRupiah(service.price)}</p>
                  <p className="text-xs text-slate-400">⏱ {service.duration_minutes} menit</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setEditing(service)}
                    className="text-sm font-medium text-indigo-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(service)}
                    disabled={deleteMutation.isPending}
                    className="text-sm font-medium text-red-500 hover:underline disabled:opacity-50"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-lg gj-card bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                {editing === 'new' ? 'Tambah Layanan Baru' : 'Edit Layanan'}
              </h3>
              <button onClick={() => setEditing(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-slate-700">Nama Layanan *</label>
                  <input
                    {...register('name', { required: 'Wajib diisi' })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-indigo-400"
                    placeholder="cth. Potong Rambut"
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Harga (Rp) *</label>
                  <input
                    type="number"
                    {...register('price', { required: 'Wajib diisi', min: { value: 0, message: 'Minimal 0' } })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-indigo-400"
                    placeholder="50000"
                  />
                  {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price.message}</p>}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Durasi (menit) *</label>
                  <input
                    type="number"
                    {...register('duration_minutes', { required: 'Wajib diisi', min: { value: 15, message: 'Minimal 15' } })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-indigo-400"
                    placeholder="30"
                  />
                  {errors.duration_minutes && <p className="mt-1 text-xs text-red-500">{errors.duration_minutes.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-slate-700">Deskripsi</label>
                  <input
                    {...register('description')}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-indigo-400"
                    placeholder="Deskripsi singkat layanan"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-2xl bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(null)}
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
