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
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/stationery" element={<StationeryPage />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cart" element={<CartPage />} />

        {/* Protected Routes */}
        <Route path="/upload" element={
          <ProtectedRoute>
            <PrintPage />
          </ProtectedRoute>
        } />
        
        <Route path="/checkout" element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        } />
        
        <Route path="/payment" element={
          <ProtectedRoute>
            <PaymentPage />
          </ProtectedRoute>
        } />
        
        <Route path="/order-success" element={
          <ProtectedRoute>
            <OrderSuccessPage />
          </ProtectedRoute>
        } />
        
        <Route path="/orders" element={
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;