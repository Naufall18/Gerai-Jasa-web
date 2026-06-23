import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import apiClient from '../../api/client';
import { setToken } from '../../lib/auth';

const schema = z.object({
  email:    z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});
type FormData = z.infer<typeof schema>;

export function LoginPage() {
  const [serverError, setServerError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setServerError('');
    try {
      const res = await apiClient.post<{
        success: boolean;
        data: { token: string; user: { role: string; name: string } };
        message: string;
      }>('/auth/login', data);

      if (res.data.success) {
        const { token, user } = res.data.data;
        setToken(token, user.role);
        // Redirect based on role
        window.location.href = user.role === 'vendor' ? '/vendor/dashboard' : '/admin/dashboard';
      } else {
        setServerError(res.data.message || 'Login gagal.');
      }
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Email atau password salah.');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-600 text-2xl font-bold text-white shadow-lg">
            G
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Gerai Jasa Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Masuk sebagai Admin atau Vendor</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
              <input
                {...register('email')}
                type="email"
                autoComplete="email"
                placeholder="admin@geraijasa.id"
                className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition
                  focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100
                  ${errors.email ? 'border-red-400' : 'border-slate-200'}`}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
              <input
                {...register('password')}
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition
                  focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100
                  ${errors.password ? 'border-red-400' : 'border-slate-200'}`}
              />
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>

            {/* Server error */}
            {serverError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {serverError}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 transition"
            >
              {isSubmitting ? 'Masuk...' : 'Masuk ke Dashboard'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            Hanya untuk Admin & Vendor. Pelanggan menggunakan aplikasi mobile.
          </p>
        </div>
      </div>
    </div>
  );
}
