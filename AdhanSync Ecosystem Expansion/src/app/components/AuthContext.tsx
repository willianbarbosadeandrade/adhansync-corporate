import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { authApi } from "../services/api";
import type { PlanTier, SessionUser } from "../types/domain";
import { ApiError } from "@/lib/errors";

interface AuthContextType {
  user: SessionUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const planRank: Record<PlanTier, number> = {
  personal: 0,
  professional: 1,
  enterprise: 2,
};

const AuthContext = createContext<AuthContextType | null>(null);

export function hasPlanAccess(userPlan: PlanTier, requiredPlan?: PlanTier): boolean {
  if (!requiredPlan) return true;
  return planRank[userPlan] >= planRank[requiredPlan];
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = async () => {
    try {
      const session = await authApi.getSession();
      setUser(session.user);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setUser(null);
        return;
      }
      throw error;
    }
  };

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      try {
        await refreshSession();
      } catch {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    void bootstrap();

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (email: string, password: string): Promise<string | null> => {
    try {
      const session = await authApi.login({ email, password });
      setUser(session.user);
      return null;
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) return "Invalid credentials.";
        if (error.status === 429) return "Too many attempts. Try again in a few minutes.";
        return error.message;
      }
      return "Unable to sign in right now.";
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
    }
  };

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      refreshSession,
    }),
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
