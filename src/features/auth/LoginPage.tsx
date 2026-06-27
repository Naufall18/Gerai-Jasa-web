import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
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
    } catch (err) {
      const apiErr = err as AxiosError<{ message?: string }>;
      setServerError(apiErr.response?.data?.message || 'Email atau password salah.');
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* ── Left: branded panel (desktop) ── */}
      <div className="relative hidden w-1/2 overflow-hidden bg-[#14463b] lg:flex lg:flex-col lg:justify-between p-12 text-white">
        {/* decorative shapes */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#1e6f5c] opacity-60 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-96 w-96 rounded-[4px_120px_120px_120px] bg-[#1e6f5c]/40 blur-xl" />
        <div className="pointer-events-none absolute right-16 bottom-24 h-24 w-24 rounded-[4px_28px_28px_28px] border-2 border-amber-400/40" />

        <div className="relative flex items-center gap-3">
          <img src="/gerai-jasa-logo.svg" alt="Gerai Jasa" className="h-11 w-11" />
          <span className="font-heading text-lg font-bold">Gerai Jasa</span>
        </div>

        <div className="relative max-w-md">
          <p className="font-heading text-4xl font-bold leading-tight">
            Kelola bisnis jasa Anda<br />
            <span className="text-amber-400">dalam satu panel.</span>
          </p>
          <p className="mt-4 text-white/70">
            Booking, jadwal, layanan, dan pelanggan — terorganisir rapi untuk admin maupun vendor Gerai Jasa.
          </p>

          <ul className="mt-8 space-y-3 text-sm text-white/85">
            {[
              'Pantau booking masuk secara real-time',
              'Atur layanan & jadwal operasional',
              'Laporan pendapatan yang jelas',
            ].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400/20 text-amber-400">✓</span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/40">© 2026 Gerai Jasa · Marketplace Jasa Lokal</p>
      </div>

      {/* ── Right: form ── */}
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
      <div className="gj-fade-in w-full max-w-sm">
        {/* Logo (mobile only) */}
        <div className="mb-8 text-center lg:text-left">
          <img src="/gerai-jasa-logo.svg" alt="Gerai Jasa" className="mx-auto mb-4 h-14 w-14 lg:mx-0" />
          <h1 className="font-heading text-2xl font-bold text-slate-900">Selamat datang 👋</h1>
          <p className="mt-1 text-sm text-slate-500">Masuk ke panel Admin atau Vendor Anda.</p>
        </div>

        <div>
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
              className="w-full rounded-2xl bg-indigo-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 hover:shadow-indigo-600/30 active:scale-[0.99] disabled:opacity-60"
            >
              {isSubmitting ? 'Masuk...' : 'Masuk ke Dashboard'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400 lg:text-left">
            Hanya untuk Admin &amp; Vendor. Pelanggan menggunakan aplikasi mobile.
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
