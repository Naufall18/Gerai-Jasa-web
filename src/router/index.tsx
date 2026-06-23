import {
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from '@tanstack/react-router';
import App from '../App';
import { LoginPage } from '../features/auth/LoginPage';
import { AdminDashboardPage } from '../features/dashboard/pages/AdminDashboardPage';
import { AdminVendorsPage } from '../features/dashboard/pages/AdminVendorsPage';
import { AdminBookingsPage } from '../features/dashboard/pages/AdminBookingsPage';
import { AdminCategoriesPage } from '../features/dashboard/pages/AdminCategoriesPage';
import { AdminUsersPage } from '../features/dashboard/pages/AdminUsersPage';
import { VendorDashboardPage } from '../features/vendors/pages/VendorDashboardPage';
import { VendorBookingsPage } from '../features/vendors/pages/VendorBookingsPage';
import { VendorCalendarPage } from '../features/vendors/pages/VendorCalendarPage';
import { VendorServicesPage } from '../features/vendors/pages/VendorServicesPage';
import { VendorSchedulePage } from '../features/vendors/pages/VendorSchedulePage';
import { VendorReviewsPage } from '../features/vendors/pages/VendorReviewsPage';
import { VendorProfilePage } from '../features/vendors/pages/VendorProfilePage';
import { VendorPayoutsPage } from '../features/vendors/pages/VendorPayoutsPage';
import { NotFoundPage } from '../features/dashboard/pages/NotFoundPage';
import { isAuthenticated } from '../lib/auth';

// ── Root ─────────────────────────────────────────────────────────────────────

const rootRoute = createRootRoute({ component: App });

// ── Login (public) ───────────────────────────────────────────────────────────

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'login',
  component: LoginPage,
  beforeLoad: () => {
    if (isAuthenticated()) throw redirect({ to: '/admin/dashboard' });
  },
});

// ── Auth guard helper ─────────────────────────────────────────────────────────

function requireAuth() {
  if (!isAuthenticated()) throw redirect({ to: '/login' });
}

// ── Admin routes ──────────────────────────────────────────────────────────────

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'admin/dashboard',
  component: AdminDashboardPage,
  beforeLoad: requireAuth,
});

const adminVendorsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'admin/vendors',
  component: AdminVendorsPage,
  beforeLoad: requireAuth,
});

const adminBookingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'admin/bookings',
  component: AdminBookingsPage,
  beforeLoad: requireAuth,
});

const adminCategoriesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'admin/categories',
  component: AdminCategoriesPage,
  beforeLoad: requireAuth,
});

const adminUsersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'admin/users',
  component: AdminUsersPage,
  beforeLoad: requireAuth,
});

// ── Vendor routes ─────────────────────────────────────────────────────────────

const vendorDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'vendor/dashboard',
  component: VendorDashboardPage,
  beforeLoad: requireAuth,
});

const vendorBookingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'vendor/bookings',
  component: VendorBookingsPage,
  beforeLoad: requireAuth,
});

const vendorCalendarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'vendor/calendar',
  component: VendorCalendarPage,
  beforeLoad: requireAuth,
});

const vendorServicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'vendor/services',
  component: VendorServicesPage,
  beforeLoad: requireAuth,
});

const vendorScheduleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'vendor/schedule',
  component: VendorSchedulePage,
  beforeLoad: requireAuth,
});

const vendorReviewsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'vendor/reviews',
  component: VendorReviewsPage,
  beforeLoad: requireAuth,
});

const vendorProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'vendor/profile',
  component: VendorProfilePage,
  beforeLoad: requireAuth,
});

const vendorPayoutsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'vendor/payouts',
  component: VendorPayoutsPage,
  beforeLoad: requireAuth,
});

// ── Index redirect ────────────────────────────────────────────────────────────

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: isAuthenticated() ? '/admin/dashboard' : '/login' });
  },
  component: () => null,
});

const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '*',
  component: NotFoundPage,
});

// ── Router ────────────────────────────────────────────────────────────────────

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  adminDashboardRoute,
  adminVendorsRoute,
  adminBookingsRoute,
  adminCategoriesRoute,
  adminUsersRoute,
  vendorDashboardRoute,
  vendorBookingsRoute,
  vendorCalendarRoute,
  vendorServicesRoute,
  vendorScheduleRoute,
  vendorReviewsRoute,
  vendorProfileRoute,
  vendorPayoutsRoute,
  notFoundRoute,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register { router: typeof router }
}
