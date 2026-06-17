import { Outlet } from '@tanstack/react-router';
import { Sidebar } from './Sidebar';

export function AppShell() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-slate-500">Welcome back</p>
              <h1 className="text-3xl font-semibold text-slate-900">
                Bookly Dashboard
              </h1>
            </div>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}