import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppThemeProvider } from "./theme/themeProvider";
import AppContextProvider from "./context/AppContext";
import Layout from "./layout/Layout";
import PresentsPage from "./pages/PresentsPage";
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <Router>
      <AppThemeProvider>
        <AppContextProvider>
          <Routes>
            <Route path="/" element={<Layout />} />
            <Route path="/presents" element={<PresentsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </AppContextProvider>
      </AppThemeProvider>
    </Router>
  );
}

export default App;
