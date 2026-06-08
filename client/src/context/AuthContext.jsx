import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/api";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("user");
    if (t) setToken(t);
    if (u) {
      try { setUser(JSON.parse(u)); } catch {}
    }
    if (t) {
      api.get("/auth/me")
        .then((res) => {
          const fresh = res.data?.data || res.data?.user || res.data;
          if (fresh) {
            setUser(fresh);
            localStorage.setItem("user", JSON.stringify(fresh));
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const persist = (tok, usr) => {
    localStorage.setItem("token", tok);
    localStorage.setItem("user", JSON.stringify(usr));
    setToken(tok);
    setUser(usr);
  };

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const tok = res.data?.token || res.data?.data?.token;
    const usr = res.data?.user || res.data?.data?.user;
    if (!tok || !usr) throw new Error("Invalid login response");
    persist(tok, usr);
    return usr;
  };

  const register = async (data) => {
    const res = await api.post("/auth/register", data);
    const tok = res.data?.token || res.data?.data?.token;
    const usr = res.data?.user || res.data?.data?.user;
    if (tok && usr) persist(tok, usr);
    return usr || {};
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token,
    hasRole: (...roles) => !!user && roles.includes(user.role),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
