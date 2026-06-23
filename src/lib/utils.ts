export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Extract a human-readable error message from an axios error (or anything).
 * Falls back through Laravel's `message`, the first validation error, then a default.
 */
export function getErrorMessage(error: unknown, fallback = 'Terjadi kesalahan. Coba lagi.'): string {
  const res = (error as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } })?.response;
  if (res?.data?.errors) {
    const first = Object.values(res.data.errors)[0];
    if (Array.isArray(first) && first[0]) return first[0];
  }
  if (res?.data?.message) return res.data.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}