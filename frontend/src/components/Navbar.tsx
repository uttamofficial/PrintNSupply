import { ShoppingCart, Sparkles, Package, Menu, X, Home, Phone, User, Upload } from 'lucide-react';
import { Link } from './Link';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { useCart } from './CartContext';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();
  const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCartDropdownOpen(false);
      }
    }
    
    function handleScroll() {
      setIsScrolled(window.scrollY > 20);
    }

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-2xl shadow-xl border-b border-blue-200/50' 
          : 'bg-gradient-to-r from-white/95 via-blue-50/95 to-white/95 backdrop-blur-xl shadow-lg border-b border-blue-200/30'
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-15 md:h-16">
            {/* Left Section - Mobile Menu Button */}
            <div className="flex items-center">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-blue-600 hover:bg-blue-50/80 rounded-xl transition-all duration-300 hover:scale-105 group"
                aria-label="Toggle menu"
              >
                <div className="relative w-6 h-6">
                  <Menu className={`w-6 h-6 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`} />
                  <X className={`w-6 h-6 absolute top-0 left-0 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} />
                </div>
              </button>

              {/* Logo */}
              <Link href="/" className="group flex items-center gap-2 sm:gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur-sm opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg sm:text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 group-hover:from-sky-600 group-hover:via-blue-600 group-hover:to-sky-600 transition-all duration-300">
                    PrintNSupply
                  </span>
                  <span className="text-xs text-gray-500 -mt-1 hidden sm:block">Print & Stationery</span>
                </div>
              </Link>
            </div>

            {/* Center Section - Desktop Navigation */}
            <div className="hidden md:flex items-center justify-center flex-1">
              <div className="flex items-center space-x-1">
                {[
                  { href: '/stationery', label: 'Stationery', icon: Package },
                  { href: '/upload', label: 'Upload PDF', icon: Upload },
                  { href: '/contact', label: 'Contact', icon: Phone }
                ].map((item) => (
                  <Link 
                    key={item.href}
                    href={item.href} 
                    className="group relative px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-300"
                  >
                    <span className="flex items-center gap-2">
                      {item.icon && <item.icon className="w-4 h-4" />}
                      {item.label}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Side Actions - Fixed Layout */}
            <div className="flex items-center justify-end space-x-2 sm:space-x-3 min-w-[200px]">
              {/* Cart Button */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsCartDropdownOpen(!isCartDropdownOpen)} 
                  className="relative p-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 text-blue-700 rounded-xl hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 transition-all duration-300 transform hover:scale-105 shadow-sm group" 
                  aria-label="Shopping Cart"
                >
                  <ShoppingCart className="w-5 h-5 group-hover:text-blue-600 transition-colors duration-300" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-pulse">
                      {cartCount}
                    </span>
                  )}
                </button>

                {/* Cart Dropdown */}
                {isCartDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-blue-200/50 overflow-hidden z-50 animate-[fadeIn_0.2s_ease-in]">
                    <div className="p-2.5 border-b border-blue-100/50">
                      <h3 className="text-xs font-semibold text-gray-800 flex items-center gap-1.5">
                        <ShoppingCart className="w-3 h-3 text-blue-600" />
                        Shopping Cart
                        {cartCount > 0 && <span className="ml-auto bg-blue-600 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">{cartCount} items</span>}
                      </h3>
                    </div>
                    <div className="p-1.5">
                      <Link href="/checkout" onClick={() => setIsCartDropdownOpen(false)} className="flex items-center gap-2 px-2 py-2 hover:bg-blue-50/50 rounded-lg transition-colors duration-200">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                          <ShoppingCart className="w-3 h-3 text-white" />
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-gray-700">View Cart</span>
                          <p className="text-[9px] text-gray-500">Checkout your items</p>
                        </div>
                      </Link>
                      <SignedIn>
                        <Link href="/orders" onClick={() => setIsCartDropdownOpen(false)} className="flex items-center gap-2 px-2 py-2 hover:bg-blue-50/50 rounded-lg transition-colors duration-200">
                          <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                            <Package className="w-3 h-3 text-white" />
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-gray-700">Order History</span>
                            <p className="text-[9px] text-gray-500">Track your orders</p>
                          </div>
                        </Link>
                      </SignedIn>
                    </div>
                  </div>
                )}
              </div>

              {/* Auth Section - Fixed Width Container */}
              <div className="w-[120px] flex justify-center">
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                      <User className="w-4 h-4" />
                      Sign In
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <UserButton 
                    appearance={{
                      elements: { 
                        avatarBox: "w-9 h-9 rounded-xl border-2 border-blue-400 shadow-lg hover:border-sky-500 transition-all duration-300 hover:scale-105" 
                      }
                    }} 
                  />
                </SignedIn>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-gradient-to-br from-white via-blue-50/50 to-indigo-50/50 backdrop-blur-2xl shadow-2xl z-50 transform transition-all duration-500 ease-in-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-6 border-b border-blue-200/50 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur-sm opacity-30"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">PrintNSupply</span>
                <p className="text-xs text-gray-500 -mt-1">Print & Stationery</p>
              </div>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-600 hover:bg-white/80 rounded-xl transition-all duration-300 hover:scale-105" aria-label="Close menu">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className="flex-1 overflow-y-auto py-6">
            {/* Quick Actions */}
            <div className="px-6 mb-6">
              <div className="grid grid-cols-2 gap-3">
                <Link href="/stationery" onClick={() => setIsMobileMenuOpen(false)} className="group flex flex-col items-center p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-200/50 hover:bg-white hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-700 text-sm">Stationery</span>
                </Link>
                <Link href="/upload" onClick={() => setIsMobileMenuOpen(false)} className="group flex flex-col items-center p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-200/50 hover:bg-white hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                    <Upload className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-700 text-sm">Upload PDF</span>
                </Link>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="px-6 space-y-2">
              {[
                { href: '/', label: 'Home', icon: Home, color: 'from-blue-500 to-indigo-500' },
                { href: '/contact', label: 'Contact Us', icon: Phone, color: 'from-purple-500 to-pink-500' },
                { href: '/checkout', label: 'Shopping Cart', icon: ShoppingCart, color: 'from-orange-500 to-red-500', badge: cartCount }
              ].map((item) => (
                <Link 
                  key={item.href}
                  href={item.href} 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-white/80 hover:shadow-lg transition-all duration-300"
                >
                  <div className={`w-10 h-10 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-gray-700">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">{item.badge}</span>
                    )}
                  </div>
                </Link>
              ))}
              
              <SignedIn>
                <Link href="/orders" onClick={() => setIsMobileMenuOpen(false)} className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-white/80 hover:shadow-lg transition-all duration-300">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-700">Order History</span>
                </Link>
              </SignedIn>
            </div>
          </div>

          {/* Mobile Footer */}
          <div className="p-6 border-t border-blue-200/50 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-xl">
            <SignedOut>
              <SignInButton mode="modal">
                <button onClick={() => setIsMobileMenuOpen(false)} className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                  <User className="w-5 h-5" />
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center justify-center p-3">
                <UserButton 
                  appearance={{
                    elements: { 
                      avatarBox: "w-12 h-12 rounded-2xl border-2 border-blue-400 shadow-lg hover:border-sky-500 transition-all duration-300 hover:scale-105" 
                    }
                  }} 
                />
              </div>
            </SignedIn>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-gradient-to-br from-black/20 via-blue-900/10 to-black/20 backdrop-blur-sm z-40 md:hidden animate-[fadeIn_0.3s_ease-in]" 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
      )}
    </>
  );
}
