import { Navigate, useLocation } from "react-router-dom";
import { useGetUserInfo } from "../hooks/useGetUserInfo";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const { data: user, isLoading } = useGetUserInfo();

  // If no token, show public page immediately
  if (!token) {
    return <>{children}</>;
  }

  // If token exists, check if it's valid while loading
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#FFFCEF]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
          </div>
          <p className="text-sm text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, redirect to dashboard
  if (user) {
    const from =
      (location.state as { from?: Location })?.from?.pathname || "/dashboard";
    return <Navigate to={from} replace />;
  }

  // Token exists but invalid/no user - show public page
  return <>{children}</>;
};

export default PublicRoute;
