export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'vendor' | 'customer';
  avatar_url?: string;
  is_active: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon_url?: string;
  description?: string;
  is_active: boolean;
}

export interface Vendor {
  id: string;
  user_id: string;
  category_id: string;
  name: string;
  slug: string;
  description?: string;
  address?: string;
  city?: string;
  status: 'pending' | 'active' | 'suspended';
  rating_avg: number;
  rating_count: number;
  meta?: Record<string, unknown>;
}

export interface Service {
  id: string;
  vendor_id: string;
  name: string;
  description?: string;
  price: number;
  duration_minutes: number;
  is_active: boolean;
}

export interface Booking {
  id: string;
  booking_code: string;
  customer_id: string;
  vendor_id: string;
  service_id: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  total_price: number;
  payment_method: 'cod' | 'midtrans' | 'xendit';
  confirmed_at?: string;
  completed_at?: string;
  cancelled_at?: string;
  created_at: string;
  updated_at: string;
}

export interface TimeSlot {
  id: string;
  vendor_id: string;
  service_id?: string;
  slot_date: string;
  slot_time: string;
  capacity: number;
  booked_count: number;
  is_available: boolean;
}