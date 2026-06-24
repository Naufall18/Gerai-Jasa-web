import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../api/client';
import type { ApiResponse } from '../../../types/api';
import type { Vendor, Booking, Category } from '../../../types/models';

// ── Vendors ──────────────────────────────────────────────────────────────────

interface VendorListMeta {
  pagination: { current_page: number; per_page: number; total: number };
}

export function useAdminVendors(page = 1, status?: string) {
  return useQuery({
    queryKey: ['admin', 'vendors', page, status],
    queryFn: async () => {
      const params: Record<string, unknown> = { page, per_page: 20 };
      if (status) params.status = status;
      const res = await apiClient.get<ApiResponse<Vendor[]> & { meta: VendorListMeta }>(
        '/vendors',
        { params }
      );
      return res.data;
    },
  });
}

// ── Categories ───────────────────────────────────────────────────────────────

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Category[]>>('/categories');
      return res.data.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

// ── Dashboard Stats (derived from bookings) ──────────────────────────────────

export function useAdminDashboardStats() {
  return useQuery({
    queryKey: ['admin', 'dashboard-stats'],
    queryFn: async () => {
      const [bookingsRes, vendorsRes] = await Promise.all([
        apiClient.get<ApiResponse<Booking[]> & { meta: VendorListMeta }>(
          '/vendor/bookings',
          { params: { per_page: 100 } }
        ),
        apiClient.get<ApiResponse<Vendor[]> & { meta: VendorListMeta }>(
          '/vendors',
          { params: { per_page: 1 } }
        ),
      ]);

      const bookings = bookingsRes.data.data ?? [];
      const totalBookings = bookingsRes.data.meta?.pagination?.total ?? bookings.length;
      const totalVendors = vendorsRes.data.meta?.pagination?.total ?? 0;
      const revenue = bookings
        .filter((b) => b.status === 'completed')
        .reduce((sum, b) => sum + Number(b.total_price), 0);

      return { totalBookings, totalVendors, revenue, recentBookings: bookings.slice(0, 10) };
    },
    staleTime: 60_000,
  });
}
