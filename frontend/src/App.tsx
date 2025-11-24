import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import ToastContainer from "./components/ToastContainer";
import { ThemeProvider } from "./context/ThemeProvider";
import { QueryProvider } from "./providers/QueryProvider";
import { AuthProvider } from "./context/AuthProvider";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <ThemeProvider>
          <Router>
            <AuthProvider>
              <AppRoutes />
              <ToastContainer />
            </AuthProvider>
          </Router>
        </ThemeProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
}

export default App;
