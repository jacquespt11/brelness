// src/App.jsx
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import AddReservation from './pages/AddReservation';
import type { Reservation } from './types/reservation';
import AdminDashboard from './pages/AdminDashboard';
import AdminLayout from './components/layout/AdminLayout';


/**
 * Composant principal de l'application
 * Gère le routing et l'état global des réservations
 */
function App() {
  // État global pour stocker toutes les réservations
  const [reservations, setReservations] = useState<Reservation[]>([]);

  /**
   * Ajoute une nouvelle réservation à la liste
   * @param {Object} reservation - La réservation à ajouter
   */
  const addReservation = (reservation: Reservation) => {
    setReservations(prev => [...prev, reservation]);
  };

  /**
   * Supprime une réservation par son ID
   * @param {number} id - L'ID de la réservation à supprimer
   */
  const deleteReservation = (id: number) => {
    setReservations(prev => prev.filter(res => res.id !== id));
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Home />} />
          <Route
            path="/add"
            element={
              <AddReservation
                onAddReservation={addReservation}
              />
            }
          />

          {/* Routes admin avec layout spécifique */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="reservations" element={<div>Gestion des réservations</div>} />
            <Route path="products" element={<div>Gestion des produits</div>} />
            <Route path="customers" element={<div>Gestion des clients</div>} />
            <Route path="analytics" element={<div>Analytiques</div>} />
            <Route path="settings" element={<div>Paramètres</div>} />
          </Route>

          {/* Redirection pour les routes non trouvées */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>

  );
}

export default App;