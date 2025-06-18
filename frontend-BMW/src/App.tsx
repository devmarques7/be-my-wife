import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppThemeProvider } from "./theme/themeProvider";
import AppContextProvider from "./context/AppContext";
import { CartProvider, useCart } from "./context/CartContext";
import Layout from "./layout/Layout";
import PresentsPage from "./pages/PresentsPage";
import CheckoutPage from "./pages/CheckoutPage";
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import Cart from './components/Cart/Cart';
import CartNotification from './components/CartNotification/CartNotification';

const AppContent: React.FC = () => {
  const { toggleCart } = useCart();
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route path="/presents" element={<PresentsPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      <Cart />
      <CartNotification onViewCart={toggleCart} />
    </>
  );
};

function App() {
  return (
    <Router>
      <AppThemeProvider>
        <AppContextProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </AppContextProvider>
      </AppThemeProvider>
    </Router>
  );
}

export default App;
