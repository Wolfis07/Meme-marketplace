import { Link } from 'react-router-dom';

export const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
    <h1 className="text-6xl font-bold text-indigo-600 mb-4">404</h1>
    <p className="text-xl mb-8">Stránka nenalezena.</p>
    <Link to="/dashboard" className="bg-indigo-600 text-white px-6 py-3 rounded-lg">Zpět na Dashboard</Link>
  </div>
);