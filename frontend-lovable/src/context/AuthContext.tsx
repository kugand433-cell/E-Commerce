import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import api from "@/lib/api";
import type { Role, User } from "@/lib/types";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: { name: string; email: string; password: string; role: Role }) => Promise<User>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (...roles: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }
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

  const persist = (tok: string, usr: User) => {
    localStorage.setItem("token", tok);
    localStorage.setItem("user", JSON.stringify(usr));
    setToken(tok);
    setUser(usr);
  };

  const login: AuthContextValue["login"] = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const tok = res.data?.token || res.data?.data?.token;
    const usr = res.data?.user || res.data?.data?.user;
    if (!tok || !usr) throw new Error("Invalid login response");
    persist(tok, usr);
    return usr;
  };

  const register: AuthContextValue["register"] = async (data) => {
    const res = await api.post("/auth/register", data);
    const tok = res.data?.token || res.data?.data?.token;
    const usr = res.data?.user || res.data?.data?.user;
    if (tok && usr) persist(tok, usr);
    return usr || ({} as User);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const value: AuthContextValue = {
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
