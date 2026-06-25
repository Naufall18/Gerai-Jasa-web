import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../api/client';
import { PageHeader } from '../../../components/layout/PageHeader';
import type { ApiResponse } from '../../../types/api';

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  vendor_reply: string | null;
  replied_at: string | null;
  created_at: string;
  customer: { name: string; avatar_url: string | null };
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < rating ? 'text-amber-400' : 'text-slate-200'}>★</span>
      ))}
    </div>
  );
}

function useVendorProfile() {
  return useQuery({
    queryKey: ['vendor', 'profile'],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<{ vendor?: { id: string } }>>('/auth/me');
      return res.data.data?.vendor?.id;
    },
    staleTime: Infinity,
  });
}

function useVendorReviews(vendorId?: string) {
  return useQuery({
    queryKey: ['vendor', 'reviews', vendorId],
    enabled: !!vendorId,
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Review[]>>(`/vendors/${vendorId}/reviews`);
      return res.data.data ?? [];
    },
  });
}

function useReplyMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reply }: { id: string; reply: string }) =>
      apiClient.patch(`/vendor/reviews/${id}/reply`, { reply }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vendor', 'reviews'] }),
  });
}

export function VendorReviewsPage() {
  const { data: vendorId } = useVendorProfile();
  const { data: reviews = [], isLoading, isError } = useVendorReviews(vendorId);
  const replyMutation = useReplyMutation();
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ulasan Pelanggan"
        subtitle="Tanggapi ulasan untuk membangun kepercayaan pelanggan."
        actions={reviews.length > 0 && (
          <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2">
            <span className="font-heading text-2xl font-bold text-amber-600">{avgRating.toFixed(1)}</span>
            <div>
              <StarRating rating={Math.round(avgRating)} />
              <p className="text-xs text-slate-500">{reviews.length} ulasan</p>
            </div>
          </div>
        )}
      />

      {isError && (
        <div className="gj-card border border-red-200 bg-red-50 p-6 text-red-700">
          Gagal memuat ulasan.
        </div>
      )}

      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 gj-card gj-skeleton" />
          ))}
        </div>
      )}

      {!isLoading && reviews.length === 0 && (
        <div className="gj-card border border-slate-200 bg-white p-12 text-center text-slate-400">
          <p className="text-4xl">⭐</p>
          <p className="mt-4 font-medium">Belum ada ulasan</p>
          <p className="mt-1 text-sm">Ulasan dari pelanggan akan muncul di sini setelah booking selesai.</p>
        </div>
      )}

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="gj-card border border-slate-200 bg-white p-6">
            {/* Customer info & rating */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-600">
                  {review.customer.name[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{review.customer.name}</p>
                  <p className="text-xs text-slate-400">
                    {new Date(review.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <StarRating rating={review.rating} />
            </div>

            {/* Comment */}
            {review.comment && (
              <p className="mt-4 text-slate-700 leading-relaxed">{review.comment}</p>
            )}

            {/* Existing reply */}
            {review.vendor_reply && (
              <div className="mt-4 rounded-2xl bg-indigo-50 border border-indigo-100 p-4">
                <p className="mb-1 text-xs font-semibold text-indigo-600">Balasan Anda:</p>
                <p className="text-sm text-slate-700">{review.vendor_reply}</p>
              </div>
            )}

            {/* Reply form */}
            {!review.vendor_reply && (
              <div className="mt-4">
                {replyingId === review.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Tulis balasan Anda..."
                      rows={3}
                      className="w-full rounded-2xl border border-slate-200 p-3 text-sm outline-none focus:border-indigo-400 resize-none"
                    />
                    <div className="flex gap-2">
                      <button
                        disabled={!replyText.trim() || replyMutation.isPending}
                        onClick={async () => {
                          await replyMutation.mutateAsync({ id: review.id, reply: replyText });
                          setReplyingId(null);
                          setReplyText('');
                        }}
                        className="rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                      >
                        {replyMutation.isPending ? 'Mengirim...' : 'Kirim Balasan'}
                      </button>
                      <button
                        onClick={() => { setReplyingId(null); setReplyText(''); }}
                        className="rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setReplyingId(review.id)}
                    className="text-sm font-medium text-indigo-600 hover:underline"
                  >
                    Balas ulasan →
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
