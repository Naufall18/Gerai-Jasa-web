import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../api/client';
import type { ApiResponse } from '../../../types/api';
import type { Booking } from '../../../types/models';

interface VendorBookingMeta {
  pagination: { current_page: number; per_page: number; total: number };
}

export function useVendorPendingBookings() {
  return useQuery({
    queryKey: ['vendor', 'bookings', 'pending'],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Booking[]> & { meta: VendorBookingMeta }>(
        '/vendor/bookings',
        { params: { status: 'pending', per_page: 5 } }
      );
      return res.data;
    },
    refetchInterval: 30_000, // Poll every 30s for new bookings
  });
}

export function useVendorTodayStats() {
  return useQuery({
    queryKey: ['vendor', 'stats', 'today'],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Booking[]> & { meta: VendorBookingMeta }>(
        '/vendor/bookings',
        { params: { per_page: 100 } }
      );
      const bookings = res.data.data ?? [];
      const today = new Date().toISOString().slice(0, 10);

      const todayBookings = bookings.filter((b) => b.created_at?.slice(0, 10) === today);
      const pendingCount = bookings.filter((b) => b.status === 'pending').length;
      const revenue = bookings
        .filter((b) => b.status === 'completed')
        .reduce((sum, b) => sum + Number(b.total_price), 0);

      return {
        todayCount: todayBookings.length,
        pendingCount,
        revenue,
        totalBookings: bookings.length,
      };
    },
    staleTime: 60_000,
  });
}
