/**
 * Simple auth helpers for the web dashboard.
 * Token stored in sessionStorage (safer than localStorage for SPAs).
 * For production, migrate to httpOnly cookie via /sanctum/csrf-cookie pattern.
 */

const TOKEN_KEY = 'gj_auth_token';
const ROLE_KEY  = 'gj_auth_role';

export function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY) ?? localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string, role: string): void {
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(ROLE_KEY, role);
  // Migrate old localStorage token away
  localStorage.removeItem('authToken');
}

export function clearToken(): void {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(ROLE_KEY);
  localStorage.removeItem('authToken');
}

export function getRole(): string | null {
  return sessionStorage.getItem(ROLE_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
