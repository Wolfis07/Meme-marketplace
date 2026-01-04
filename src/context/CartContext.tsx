import { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Meme } from '../utils/memeUtils';

interface CartContextType {
  cart: Meme[];
  addItem: (meme: Meme) => void;
  removeItem: (id: string) => void;
  decreaseCount: (id: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useLocalStorage<Meme[]>('cart', []);

  const addItem = (meme: Meme) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === meme.id);
      if (existing) {
        return prev.map((item) =>
          item.id === meme.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        );
      }
      return [...prev, { ...meme, quantity: 1 }];
    });
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const decreaseCount = (id: string) => {
    setCart((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: Math.max(0, (item.quantity || 1) - 1) };
        }
        return item;
      }).filter(item => (item.quantity || 0) > 0);
    });
  };

  const clearCart = () => setCart([]);

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 1)), 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + (item.quantity || 1), 0);
  };

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, decreaseCount, clearCart, getTotalPrice, getCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};