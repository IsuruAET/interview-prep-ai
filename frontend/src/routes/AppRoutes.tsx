import { lazy, Suspense } from "react";
import type { ComponentType } from "react";
import { Routes, Route } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import Loader from "../components/Loader/Loader";

// Lazy load components to trigger Suspense
const LandingPage = lazy(() => import("../pages/LandingPage"));
const Dashboard = lazy(() => import("../pages/Home/Dashboard"));
const InterviewPrep = lazy(() => import("../pages/InterviewPrep"));
const InterviewQuestions = lazy(() => import("../pages/InterviewQuestions"));
const CoverLetter = lazy(() => import("../pages/CoverLetter"));
const AboutMe = lazy(() => import("../pages/AboutMe"));
const NotFound = lazy(() => import("../pages/NotFound"));

interface RouteConfig {
  path: string;
  component: ComponentType;
  isProtected: boolean;
}

const routeConfig: RouteConfig[] = [
  { path: "/", component: LandingPage, isProtected: false },
  { path: "/dashboard", component: Dashboard, isProtected: true },
  {
    path: "/interview-prep/:sessionId",
    component: InterviewPrep,
    isProtected: true,
  },
  {
    path: "/interview-questions",
    component: InterviewQuestions,
    isProtected: true,
  },
  { path: "/cover-letter", component: CoverLetter, isProtected: true },
  { path: "/about-me", component: AboutMe, isProtected: true },
];

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {routeConfig.map(({ path, component: Component, isProtected }) => (
          <Route
            key={path}
            path={path}
            element={
              isProtected ? (
                <ProtectedRoute>
                  <Component />
                </ProtectedRoute>
              ) : (
                <PublicRoute>
                  <Component />
                </PublicRoute>
              )
            }
          />
        ))}
        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
