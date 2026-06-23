import { useCategories } from '../hooks/useAdminStats';
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

export function AdminCategoriesPage() {
  const { data: categories = [], isLoading, isError } = useCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Kategori Layanan</h1>
        <button
          className="rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          onClick={() => alert('Fitur tambah kategori via admin API segera hadir.')}
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
    </div>
  );
}
