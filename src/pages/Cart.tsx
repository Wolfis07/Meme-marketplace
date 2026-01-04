import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Cart = () => {
  const { cart, removeItem, decreaseCount, addItem, clearCart, getTotalPrice } = useCart();

  if (cart.length === 0) return <div className="text-center mt-20"><h2 className="text-2xl font-bold mb-4">Prázdný košík 🛒</h2><Link to="/memes" className="text-indigo-600 hover:underline">Jít nakupovat</Link></div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Košík</h1>
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {cart.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4 border-b">
            <img src={item.url} className="w-16 h-16 object-cover rounded" />
            <div className="flex-grow">
              <h3 className="font-bold">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.price} Kč/ks</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => decreaseCount(item.id)} className="p-1 bg-gray-100 rounded"><Minus size={16}/></button>
              <span className="font-bold w-6 text-center">{item.quantity}</span>
              <button onClick={() => addItem(item)} className="p-1 bg-gray-100 rounded"><Plus size={16}/></button>
            </div>
            <div className="font-bold w-20 text-right">{(item.price || 0) * (item.quantity || 1)} Kč</div>
            <button onClick={() => removeItem(item.id)} className="text-red-500"><Trash2 size={20}/></button>
          </div>
        ))}
        <div className="bg-gray-50 p-6 flex justify-between items-center">
           <button onClick={clearCart} className="text-red-600 text-sm">Vyprázdnit</button>
           <div className="text-xl">Celkem: <span className="font-bold">{getTotalPrice()} Kč</span></div>
        </div>
      </div>
    </div>
  );
};