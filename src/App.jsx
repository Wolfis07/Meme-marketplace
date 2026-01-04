import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Stránky
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Memes } from './pages/Memes';
import { MemeDetail } from './pages/MemeDetail';
import { Cart } from './pages/Cart';
import { NotFound } from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Veřejná trasa - Login */}
            <Route path="/login" element={<Login />} />

            {/* Chráněné trasy (musíš být přihlášen) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/memes" element={<Memes />} />
              <Route path="/memes/:id" element={<MemeDetail />} />
              <Route path="/cart" element={<Cart />} />
            </Route>

            {/* 404 - Stránka nenalezena */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;