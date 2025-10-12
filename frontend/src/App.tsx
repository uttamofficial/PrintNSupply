// App.tsx (Main Application)
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './LandingPage';  // Import the Landing Page component
import StationeryPage from './StationeryPage';  // Import the Stationery Page component
import PrintPage from './PrintPage';
import Navbar from './components/Navbar';  // Import the Navbar that will be used in both pages
import CartPage from './CartPage';
import ContactUs from './ContactUs';
import LoginPage from './LoginPage.tsx';
import PaymentPage from './PaymentPage';
import OrderSuccessPage from './OrderSuccessPage';
import OrdersPage from './OrdersPage';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { RouteLoader } from './components/RouteLoader';

// Admin Components
import AdminLogin from './AdminLogin';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import ProductManagement from './admin/ProductManagement';
import OrderManagement from './admin/OrderManagement';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SignedIn>
        {children}
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

function App() {
  return (
    <Router>
      <RouteLoader />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<><Navbar /><LandingPage /></>} />
        <Route path="/stationery" element={<><Navbar /><StationeryPage /></>} />
        <Route path="/contact" element={<><Navbar /><ContactUs /></>} />
        <Route path="/login" element={<><Navbar /><LoginPage /></>} />
        <Route path="/cart" element={<><Navbar /><CartPage /></>} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="orders" element={<OrderManagement />} />
        </Route>

        {/* Protected Routes */}
        <Route path="/upload" element={
          <ProtectedRoute>
            <><Navbar /><PrintPage /></>
          </ProtectedRoute>
        } />
        
        <Route path="/checkout" element={
          <ProtectedRoute>
            <><Navbar /><CartPage /></>
          </ProtectedRoute>
        } />
        
        <Route path="/payment" element={
          <ProtectedRoute>
            <><Navbar /><PaymentPage /></>
          </ProtectedRoute>
        } />
        
        <Route path="/order-success" element={
          <ProtectedRoute>
            <><Navbar /><OrderSuccessPage /></>
          </ProtectedRoute>
        } />
        
        <Route path="/orders" element={
          <ProtectedRoute>
            <><Navbar /><OrdersPage /></>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;