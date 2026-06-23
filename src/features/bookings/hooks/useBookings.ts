import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../api/client';
import type { ApiResponse } from '../../../types/api';
import type { Booking } from '../../../types/models';

interface BookingListMeta {
  pagination: { current_page: number; per_page: number; total: number };
}

export function useAdminBookings(page = 1, status?: string) {
  return useQuery({
    queryKey: ['admin', 'bookings', page, status],
    queryFn: async () => {
      const params: Record<string, unknown> = { page };
      if (status) params.status = status;
      const res = await apiClient.get<ApiResponse<Booking[]> & { meta: BookingListMeta }>(
        '/bookings',
        { params }
      );
      return res.data;
    },
  });
}

export function useVendorBookings(page = 1, status?: string) {
  return useQuery({
    queryKey: ['vendor', 'bookings', page, status],
    queryFn: async () => {
      const params: Record<string, unknown> = { page };
      if (status) params.status = status;
      const res = await apiClient.get<ApiResponse<Booking[]> & { meta: BookingListMeta }>(
        '/vendor/bookings',
        { params }
      );
      return res.data;
    },
  });
}

export function useConfirmBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.patch(`/vendor/bookings/${id}/confirm`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['vendor', 'bookings'] });
    },
  });
}

export function useCompleteBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.patch(`/vendor/bookings/${id}/complete`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['vendor', 'bookings'] });
    },
  });
}
