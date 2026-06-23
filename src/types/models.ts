export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: 'admin' | 'vendor' | 'customer';
  avatar_url?: string;
  fcm_token?: string;
  is_active: boolean;
  created_at?: string;
  // Relation (loaded when /auth/me returns vendor)
  vendor?: Vendor;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon_url?: string;
  description?: string;
  is_active: boolean;
  sort_order?: number;
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
  lat?: number;
  lng?: number;
  status: 'pending' | 'active' | 'suspended';
  commission_rate?: number;
  rating_avg: number;
  rating_count: number;
  is_featured?: boolean;
  meta?: Record<string, unknown>;
  created_at?: string;
  // Eager-loaded relations
  category?: Category;
  services?: Service[];
  photos?: VendorPhoto[];
  schedules?: Schedule[];
}

export interface VendorPhoto {
  id: string;
  vendor_id: string;
  url: string;
  caption?: string;
}

export interface Service {
  id: string;
  vendor_id: string;
  name: string;
  description?: string;
  price: number;
  duration_minutes: number;
  max_advance_days?: number;
  is_active: boolean;
}

export interface Schedule {
  id: string;
  vendor_id: string;
  day_of_week: number; // 0=Sun … 6=Sat
  open_time: string;   // "HH:mm:ss"
  close_time: string;
  is_closed: boolean;
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

export interface Booking {
  id: string;
  booking_code: string;
  customer_id: string;
  vendor_id: string;
  service_id?: string;
  time_slot_id?: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  total_price: number;
  commission_amount?: number;
  payment_method: 'cod' | 'midtrans' | 'xendit';
  notes?: string;
  special_requests?: string;
  cancellation_reason?: string;
  confirmed_at?: string;
  completed_at?: string;
  cancelled_at?: string;
  created_at: string;
  updated_at: string;
  // Eager-loaded relations
  customer?: User;
  vendor?: Vendor;
  service?: Service;
  time_slot?: TimeSlot;
  payment?: Payment;
}

export interface Payment {
  id: string;
  booking_id: string;
  gateway: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  gateway_ref?: string;
  paid_at?: string;
  created_at: string;
}

export interface Review {
  id: string;
  booking_id: string;
  vendor_id: string;
  customer_id: string;
  service_id?: string;
  rating: number;
  comment?: string;
  vendor_reply?: string;
  replied_at?: string;
  is_visible?: boolean;
  created_at: string;
  customer?: Pick<User, 'id' | 'name' | 'avatar_url'>;
}
