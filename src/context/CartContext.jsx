import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useLocalStorage('cart', []);

  const addItem = (meme) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === meme.id);
      if (existing) {
        return prev.map((item) =>
          item.id === meme.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...meme, quantity: 1 }];
    });
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const decreaseCount = (id) => {
    setCart((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: Math.max(0, item.quantity - 1) };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const clearCart = () => setCart([]);

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, decreaseCount, clearCart, getTotalPrice, getCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);