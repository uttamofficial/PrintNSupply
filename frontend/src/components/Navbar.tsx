import { ShoppingCart, Sparkles, Package, Menu, X, Home, Phone } from 'lucide-react';
import { Link } from './Link';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { useCart } from './CartContext';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();
  const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCartDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl z-50 border-b border-blue-200 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link href="/" className="group flex items-center gap-2">
              <div className="relative">
                <Sparkles className="w-8 h-8 text-blue-600 group-hover:text-sky-500 transition-colors duration-300" />
              </div>
              <span className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 group-hover:from-sky-600 group-hover:via-blue-600 group-hover:to-sky-600 transition-all duration-300">
                PrintNSupply
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="/stationery" className="relative text-base font-semibold text-gray-700 hover:text-blue-600 transition-colors duration-300 group">
                <span>Stationery</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-sky-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link href="/upload" className="relative text-base font-semibold text-gray-700 hover:text-blue-600 transition-colors duration-300 group">
                <span>Upload PDF</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-sky-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link href="/contact" className="relative text-base font-semibold text-gray-700 hover:text-blue-600 transition-colors duration-300 group">
                <span>Contact Us</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-sky-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="hidden sm:block px-4 sm:px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-md">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton appearance={{elements: {avatarBox: "w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-blue-400 shadow-md hover:border-sky-500 transition-all duration-300"}}} />
              </SignedIn>
              
              <div className="hidden md:block relative" ref={dropdownRef}>
                <button onClick={() => setIsCartDropdownOpen(!isCartDropdownOpen)} className="relative p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-full hover:bg-blue-100 transition-all duration-300 transform hover:scale-110 shadow-md group" aria-label="Shopping Cart">
                  <ShoppingCart className="w-6 h-6 group-hover:text-blue-600 transition-colors duration-300" />
                  {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-extrabold rounded-full px-2 py-1 shadow-md">{cartCount}</span>}
                </button>

                {isCartDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-blue-200 overflow-hidden z-50 animate-[fadeIn_0.2s_ease-in]">
                    <Link href="/checkout" onClick={() => setIsCartDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors duration-200 border-b border-blue-100">
                      <ShoppingCart className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-gray-700">Cart</span>
                      {cartCount > 0 && <span className="ml-auto bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{cartCount}</span>}
                    </Link>
                    <SignedIn>
                      <Link href="/orders" onClick={() => setIsCartDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors duration-200">
                        <Package className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-gray-700">Order History</span>
                      </Link>
                    </SignedIn>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">PrintNSupply</span>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-600 hover:bg-white rounded-lg transition-colors" aria-label="Close menu">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            {/* Stationery and Upload PDF in a single row */}
            <div className="grid grid-cols-2 gap-2 px-3 mb-2">
              <Link href="/stationery" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-semibold border border-gray-200 rounded-lg bg-white">
                Stationery
              </Link>
              <Link href="/upload" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-semibold border border-gray-200 rounded-lg bg-white">
                Upload PDF
              </Link>
            </div>
            
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center px-6 py-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-semibold border-b border-gray-100">
              <Home className="w-5 h-5 mr-3 text-blue-600" />
              Home
            </Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center px-6 py-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-semibold border-b border-gray-100">
              <Phone className="w-5 h-5 mr-3 text-blue-600" />
              Contact Us
            </Link>
            <Link href="/checkout" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center px-6 py-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-semibold border-b border-gray-100">
              <ShoppingCart className="w-5 h-5 mr-3 text-blue-600" />Cart{cartCount > 0 && <span className="ml-auto bg-blue-600 text-white text-xs font-bold rounded-full px-2 py-1">{cartCount}</span>}
            </Link>
            <SignedIn>
              <Link href="/orders" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center px-6 py-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-semibold border-b border-gray-100">
                <Package className="w-5 h-5 mr-3 text-blue-600" />Order History
              </Link>
            </SignedIn>
          </div>

          <div className="p-4 border-t border-blue-200 bg-gray-50">
            <SignedOut>
              <SignInButton mode="modal">
                <button onClick={() => setIsMobileMenuOpen(false)} className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md">Sign In</button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center justify-center p-2">
                <UserButton appearance={{elements: {avatarBox: "w-12 h-12 rounded-full border-2 border-blue-400"}}} />
              </div>
            </SignedIn>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />}
    </>
  );
}
