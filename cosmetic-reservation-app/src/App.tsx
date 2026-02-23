// src/App.tsx - Version simplifiée et moderne
// Force refresh
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import { HomePage as Home } from './features/home/pages/HomePage';
import { CatalogPage } from './features/products/pages/CatalogPage';
import { ReservationPage } from './features/reservations/pages/ReservationPage';
import { LoginPage } from './features/auth/pages/LoginPage';
import { AccessDenied } from './features/auth/pages/AccessDenied';
import { ProtectedRoute } from './features/auth/components/ProtectedRoute';
import { UserRole } from './features/auth/types/auth.types';
import { AdminLayout } from './shared/components/layout/AdminLayout';
import { AdminDashboard, ReservationsListPage, CustomersPage, AnalyticsPage, UsersPage, ProductsPage } from './features/admin/pages';
import { AddReservationPage } from './features/reservations/pages/AddReservationPage';
import { NotificationsPage } from './features/notifications/pages';
import { SettingsPage } from './features/settings/pages';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <AnimatePresence mode="wait">
            <Routes>
              {/* Routes publiques */}
              <Route path="/" element={<Home />} />
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/reserve" element={<ReservationPage />} />
              <Route path="/reserve/:productId" element={<ReservationPage />} />
              <Route path="/add" element={<AddReservationPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/access-denied" element={<AccessDenied />} />

              {/* Routes admin */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="reservations" element={<ReservationsListPage />} />
                <Route path="customers" element={<CustomersPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="add" element={<AddReservationPage />} />
                <Route path="users" element={<UsersPage />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800"
                >
                  <div className="text-center p-8">
                    <div className="text-6xl mb-4">🔍</div>
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">404</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Page non trouvée</p>
                    <a
                      href="/"
                      className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                    >
                      Retour à l'accueil
                    </a>
                  </div>
                </motion.div>
              } />
            </Routes>
          </AnimatePresence>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;