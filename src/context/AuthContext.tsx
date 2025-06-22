  import { useLogout } from "../hooks/useAuth"; // ✅ adjust the path if different
import {
  useState,
  createContext,
  useContext,
  type ReactNode,
  useEffect,
} from "react";
import type { LoginResponse } from "../types/auth";
import { User } from "@/types/user";
import { getProfile } from "@/api/auth";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  checkRole: (role: string | string[]) => boolean;
  logout: () => void; // ✅ add this

}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const userData = await getProfile();
        setIsAuthenticated(!!userData);
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const checkRole = (role: string | string[]) => {
    if (!user) return false;
    return Array.isArray(role) ? role.includes(user.role) : user.role === role;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    // Optional: logoutApi().catch()...
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        setUser,
        checkRole,
        logout,
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
