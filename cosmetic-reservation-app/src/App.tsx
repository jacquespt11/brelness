// src/App.tsx - Version simplifiée et moderne
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import Home from './pages/Home';
import CatalogPage from './pages/CatalogPage';
import AddReservation from './pages/AddReservation';
import ReservationPage from './pages/ReservationPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminLayout from './components/layout/AdminLayout';

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
              <Route path="/add" element={<AddReservation />} />

              {/* Routes admin */}
              <Route path="/admin/*" element={
                <AdminLayout>
                  <Routes>
                    <Route index element={<AdminDashboard />} />
                  </Routes>
                </AdminLayout>
              } />

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