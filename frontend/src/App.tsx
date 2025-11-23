import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import ToastContainer from "./components/ToastContainer";
import { ThemeProvider } from "./context/ThemeProvider";
// import UserProvider from "./context/UserProvider";

function App() {
  return (
    <ThemeProvider>
      {/* <UserProvider> */}
      <Router>
        <AppRoutes />
        <ToastContainer />
      </Router>
      {/* </UserProvider> */}
    </ThemeProvider>
  );
}

export default App;
