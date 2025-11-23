import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
// import { useUserAuth } from "../hooks/useUserAuth";
// import PublicRoute from "./PublicRoute";
// import ProtectedRoute from "./ProtectedRoute";
// import LoadingSpinner from "../components/LoadingSpinner";

// Lazy load components to trigger Suspense
const LandingPage = lazy(() => import("../pages/LandingPage"));
const Dashboard = lazy(() => import("../pages/Home/Dashboard"));
const InterviewPrep = lazy(() => import("../pages/InterviewPrep"));
const NotFound = lazy(() => import("../pages/NotFound"));

const AppRoutes = () => {
  // useUserAuth();

  return (
    // <Suspense fallback={<LoadingSpinner />}>
    <Routes>
      {/* Public (unauthenticated) */}
      {/* <Route element={<PublicRoute />}> */}
      {/* </Route> */}

      {/* Protected (authenticated) */}
      {/* <Route element={<ProtectedRoute />}> */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/interview-prep/:sessionId" element={<InterviewPrep />} />
      {/* </Route> */}

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
    // </Suspense>
  );
};

export default AppRoutes;
