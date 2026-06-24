/**
 * Badge status booking yang konsisten di seluruh aplikasi.
 * Satu sumber kebenaran untuk label + warna (Pine & Amber).
 */
const STATUS: Record<string, { label: string; cls: string; dot: string }> = {
  pending:     { label: 'Menunggu',    cls: 'bg-amber-50 text-amber-700',     dot: 'bg-amber-400' },
  confirmed:   { label: 'Dikonfirmasi', cls: 'bg-blue-50 text-blue-700',       dot: 'bg-blue-500' },
  in_progress: { label: 'Berlangsung',  cls: 'bg-indigo-50 text-indigo-700',   dot: 'bg-indigo-500' },
  completed:   { label: 'Selesai',      cls: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
  cancelled:   { label: 'Dibatalkan',   cls: 'bg-red-50 text-red-700',         dot: 'bg-red-500' },
};

export function StatusBadge({ status, dot = false }: { status: string; dot?: boolean }) {
  const s = STATUS[status] ?? { label: status, cls: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${s.cls}`}>
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />}
      {s.label}
    </span>
  );
}
