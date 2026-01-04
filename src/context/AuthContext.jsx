import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Ukládáme user objekt do localStorage, jak chce zadání
  const [user, setUser] = useLocalStorage('user', { username: '', loggedIn: false });

  const login = (username) => {
    setUser({ username, loggedIn: true });
  };

  const logout = () => {
    setUser({ username: '', loggedIn: false });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);