import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, LogOut, LayoutDashboard, Image } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user.loggedIn) return null;

  return (
    <nav className="bg-white shadow-md p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
           MemePro
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="flex items-center gap-1 hover:text-indigo-600">
            <LayoutDashboard size={20} /> <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <Link to="/memes" className="flex items-center gap-1 hover:text-indigo-600">
            <Image size={20} /> <span className="hidden sm:inline">Memes</span>
          </Link>
          <Link to="/cart" className="relative flex items-center gap-1 hover:text-indigo-600">
            <ShoppingCart size={20} /> 
            {getCartCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {getCartCount()}
              </span>
            )}
          </Link>
          
          <div className="flex items-center gap-4 border-l pl-4 ml-2">
            <span className="font-semibold text-sm">{user.username}</span>
            <button onClick={handleLogout} className="text-gray-500 hover:text-red-500" title="Odhlásit">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};