import { createContext, useContext, useEffect, useState } from "react";
import { login as apiLogin, register as apiRegister, me as apiMe } from "../api/auth";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (token) {
        try {
          const { data } = await apiMe();
          setUser(data);
        } catch {
          localStorage.removeItem("token");
          setToken("");
        }
      }
      setLoading(false);
    };
    init();
  }, [token]);

  const login = async (email, password) => {
    const { data } = await apiLogin({ email, password });
    localStorage.setItem("token", data.token);
    setToken(data.token);
    const meRes = await apiMe();
    setUser(meRes.data);
  };

  const register = async (name, email, password) => {
    const { data } = await apiRegister({ name, email, password });
    localStorage.setItem("token", data.token);
    setToken(data.token);
    const meRes = await apiMe();
    setUser(meRes.data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
