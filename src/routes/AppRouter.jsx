import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Components
import ProtectedRoute from "./ProtectedRoute";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";

// Website Pages
import Home from "../pages/website/Home";
import Shop from "../pages/website/Shop";
import About from "../pages/website/About";
import Contact from "../pages/website/Contact";
import ProductDetail from "../pages/website/ProductDetail"; // Updated
import Cart from "../pages/website/Cart"; // New
import Checkout from "../pages/website/Checkout"; // New (was BillingDetailsForm)
import Profile from "../pages/website/Profile";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import NotFound from "../components/common/NotFound";

// Auth Pages
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";

// Admin Dashboard Components
import AdminLayout from "../components/admin/AdminLayout";
import AdminOverview from "../pages/admin/Overview";
import AdminProducts from "../pages/admin/Products";
import AdminOrders from "../pages/admin/Orders";
import AdminInventory from "../pages/admin/Inventory";
import AdminCustomers from "../pages/admin/Customers";
import AdminDiscounts from "../pages/admin/Discounts";
import AdminAnalytics from "../pages/admin/Analytics";
import AdminSettings from "../pages/admin/Settings";
import AdminContacts from "../pages/admin/Contacts";
import AdminNewsletter from "../pages/admin/Newsletter";

import Layout from "../Layout";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Protected Admin Routes */}
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout />
                </ProtectedRoute>
              } 
            >
              <Route index element={<AdminOverview />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="inventory" element={<AdminInventory />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="discounts" element={<AdminDiscounts />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="contacts" element={<AdminContacts />} />
              <Route path="newsletter" element={<AdminNewsletter />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Route>

            {/* Public Website Routes wrapped in Layout */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              
              {/* Protected Customer Routes */}
              <Route 
                path="/checkout" 
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
            </Route>
            
            {/* Auth Routes */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRouter;
