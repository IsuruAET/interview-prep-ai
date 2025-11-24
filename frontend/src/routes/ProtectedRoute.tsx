import { Navigate, useLocation } from "react-router-dom";
import { useGetUserInfo } from "../hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const { data: user, isLoading, error } = useGetUserInfo();

  // If no token, redirect immediately
  if (!token) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // Show loader while checking authentication
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#FFFCEF]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
          </div>
          <p className="text-sm text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // If error or no user, token is invalid - redirect to root
  if (error || !user) {
    localStorage.removeItem("token");
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // User is authenticated, render protected route
  return <>{children}</>;
};

export default ProtectedRoute;
