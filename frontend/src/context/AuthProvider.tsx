import { useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { setTokenExpirationHandler } from "../utils/axioInstance";
import { AuthContext } from "./AuthContext";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    queryClient.removeQueries({ queryKey: ["user"] });
    if (window.location.pathname !== "/") {
      navigate("/", { replace: true });
    }
  }, [queryClient, navigate]);

  // Register the logout handler with axios interceptor
  useEffect(() => {
    setTokenExpirationHandler(handleLogout);
  }, [handleLogout]);

  return (
    <AuthContext.Provider value={{ handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
