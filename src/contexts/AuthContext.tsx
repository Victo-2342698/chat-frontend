import { createContext, useState } from 'react';
import api from '../services/api';

export type AuthContextType = {
  isLoggedIn: boolean;
  token: string;
  pageRedirectAfterLogin: string;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  restoreLogin: () => void;
  setPageRedirectAfterLogin: (path: string) => void;
};

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  token: '',
  pageRedirectAfterLogin: '/',
  login: async () => false,
  logout: () => {},
  restoreLogin: () => {},
  setPageRedirectAfterLogin: () => {},
});

export default function AuthProvider({ children }: any) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState('');
  const [pageRedirectAfterLogin, setPageRedirectAfterLogin] = useState('/');

  // ------------ LOGIN ------------
  async function login(email: string, password: string) {
    try {
      const res = await api.post('/auth/generatetoken', { email, password });

      const token = res.data.token;

      if (!token) return false;

      setIsLoggedIn(true);
      setToken(token);
      saveToken(token);

      return true;
    } catch {
      return false;
    }
  }

  // ------------ COOKIES ------------
  function saveToken(token: string) {
    document.cookie = `token=${token}; path=/; max-age=3600`;
  }

  function loadToken() {
    const match = document.cookie.match(/(^|;\s*)token=([^;]*)/);
    return match ? match[2] : null;
  }

  function restoreLogin() {
    const saved = loadToken();
    if (saved) {
      setToken(saved);
      setIsLoggedIn(true);
    }
  }

  // ------------ LOGOUT ------------
  function logout() {
    setIsLoggedIn(false);
    setToken('');
    document.cookie = 'token=; path=/; max-age=0';
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        token,
        login,
        logout,
        restoreLogin,
        pageRedirectAfterLogin,
        setPageRedirectAfterLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
