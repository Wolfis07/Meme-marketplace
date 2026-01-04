import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from './Navbar';

export const ProtectedRoute = () => {
  const { user } = useAuth();

  if (!user.loggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar />
      <main className="container mx-auto p-4 min-h-screen">
        <Outlet />
      </main>
    </>
  );
};