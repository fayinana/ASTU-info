import { useState, createContext, useContext, type ReactNode } from "react";
import type { LoginResponse } from "../types/auth";
// import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: LoginResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: LoginResponse | null) => void;
  checkRole: (role: string | string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<LoginResponse | null>(() =>
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")!)
      : null
  );
  const [isLoading, setIsLoading] = useState(false);

  const checkRole = (role: string | string[]) => {
    if (!user) return false;

    if (Array.isArray(role)) {
      return role.includes(user.role);
    }

    return user.role === role;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        setUser,
        checkRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
