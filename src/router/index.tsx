import { RootRoute, Route, Router } from '@tanstack/react-router';
import App from '../App';
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

const rootRoute = new RootRoute({
  component: App,
});

const adminDashboardRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'admin/dashboard',
  component: AdminDashboardPage,
});

const adminVendorsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'admin/vendors',
  component: AdminVendorsPage,
});

const adminBookingsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'admin/bookings',
  component: AdminBookingsPage,
});

const adminCategoriesRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'admin/categories',
  component: AdminCategoriesPage,
});

const adminUsersRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'admin/users',
  component: AdminUsersPage,
});

const vendorDashboardRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'vendor/dashboard',
  component: VendorDashboardPage,
});

const vendorBookingsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'vendor/bookings',
  component: VendorBookingsPage,
});

const vendorCalendarRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'vendor/calendar',
  component: VendorCalendarPage,
});

const vendorServicesRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'vendor/services',
  component: VendorServicesPage,
});

const vendorScheduleRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'vendor/schedule',
  component: VendorSchedulePage,
});

const vendorReviewsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'vendor/reviews',
  component: VendorReviewsPage,
});

const vendorProfileRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'vendor/profile',
  component: VendorProfilePage,
});

const vendorPayoutsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'vendor/payouts',
  component: VendorPayoutsPage,
});

const notFoundRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '*',
  component: NotFoundPage,
});

const routeTree = rootRoute.addChildren([
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

export const router = new Router({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}