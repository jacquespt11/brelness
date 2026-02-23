// src/app/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/core/contexts';
import { ROUTES } from '@/shared/constants/routes';

// Public pages
import { CatalogPage } from '@/features/products/pages';
import { HomePage } from '@/features/home/pages';
import { ReservationPage, AddReservationPage } from '@/features/reservations/pages';
import { LoginPage, AccessDenied } from '@/features/auth/pages';

// Admin pages
import {
    AdminDashboard,
    ReservationsListPage,
    CustomersPage,
    AnalyticsPage,
    UsersPage,
    ProductsPage,
} from '@/features/admin/pages';

// Other pages
import { NotificationsPage } from '@/features/notifications/pages';
import { SettingsPage } from '@/features/settings/pages';

// Auth
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { UserRole } from '@/features/auth/types/auth.types';

// Layouts
import { MainLayout, AdminLayout } from '@/shared/components/layout';

// Error Boundary
import ErrorBoundary from './ErrorBoundary';

/**
 * Main App Component
 * Root component with routing and theme provider
 */
function App() {
    return (
        <ThemeProvider>
            <Router>
                <ErrorBoundary>
                    <Routes>
                        {/* Public Routes */}
                        <Route element={<MainLayout />}>
                            <Route path={ROUTES.HOME} element={<HomePage />} />
                            <Route path={ROUTES.CATALOG} element={<CatalogPage />} />
                            <Route path={ROUTES.RESERVATION} element={<ReservationPage />} />
                            <Route path="/reserve/:productId" element={<HomePage />} />
                        </Route>

                        {/* Special Routes */}
                        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                        <Route path="/access-denied" element={<AccessDenied />} />

                        {/* Admin Routes */}
                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
                                    <AdminLayout />
                                </ProtectedRoute>
                            }
                        >
                            <Route index element={<AdminDashboard />} />
                            <Route path="reservations" element={<ReservationsListPage />} />
                            <Route path="products" element={<ProductsPage />} />
                            <Route path="customers" element={<CustomersPage />} />
                            <Route path="analytics" element={<AnalyticsPage />} />
                            <Route path="notifications" element={<NotificationsPage />} />
                            <Route path="settings" element={<SettingsPage />} />
                            <Route path="users" element={<UsersPage />} />
                            <Route path="add" element={<AddReservationPage />} />
                        </Route>

                        {/* Compatibility Route */}
                        <Route path={ROUTES.ADD_RESERVATION} element={<AddReservationPage />} />

                        {/* 404 */}
                        <Route
                            path="*"
                            element={
                                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
                                    <div className="text-center p-8">
                                        <div className="text-6xl mb-4">🔍</div>
                                        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
                                            404
                                        </h1>
                                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                                            Page non trouvée
                                        </p>
                                        <a
                                            href={ROUTES.HOME}
                                            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                                        >
                                            Retour à l'accueil
                                        </a>
                                    </div>
                                </div>
                            }
                        />
                    </Routes>
                </ErrorBoundary>
            </Router>
        </ThemeProvider>
    );
}

export default App;
