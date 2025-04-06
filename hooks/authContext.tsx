"use client";
import { ReactNode, createContext, useContext } from "react";
import useAuth from "./use-Auth";
import { UserType } from "./use-Auth";
interface AuthContextType {
  isLoggedIn: boolean;
  user: UserType|null;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setUser:(userData:any)=>void;
  login: (userData: any) => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  logout: () => void;
}
interface AuthProviderProps {
  children: ReactNode;
}
const AuthContext = createContext<AuthContextType | null>(null);
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
export const useAuthContext = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuthContext must be used inside AuthProvider");
    return context;
  };