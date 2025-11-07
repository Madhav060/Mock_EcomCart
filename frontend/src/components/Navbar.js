import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
// Import the selector
import { selectCartItemCount } from '../redux/slices/cartSlice';

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const [userName, setUserName] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // <-- State for mobile menu
  const navigate = useNavigate();
  const location = useLocation();

  // This selector will now get the count from the Redux store
  const cartItemCount = useSelector(selectCartItemCount);

  useEffect(() => {
    // This effect now correctly re-runs when isAuthenticated changes
    if (isAuthenticated) {
      try {
        // === CORRECTION ===
        // Read from 'userInfo' which is set at login
        const storedUser = localStorage.getItem('userInfo'); 
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setUserName(user.name || 'User');
        } else {
          // This case might happen if state is auth'd but local storage is cleared
          setUserName('User');
          console.error('Authenticated but no userInfo found in localStorage.');
        }
      } catch (error) {
        console.error('Invalid user data in localStorage:', error);
        localStorage.removeItem('userInfo'); // Clear corrupted data
        setUserName('User');
      }
    } else {
      setUserName('');
    }
  }, [isAuthenticated, location]);

  // Close mobile menu on navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowDropdown(false);
  }, [location]);

  const handleLogout = () => {
    // === CORRECTION ===
    // Remove the correct item
    localStorage.removeItem('userInfo');
    
    // This part was correct
    setIsAuthenticated(false);
    setShowDropdown(false);
    setIsMobileMenuOpen(false); // Close mobile menu on logout
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-800">Vibe Commerce</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`text-gray-700 hover:text-blue-600 font-medium ${isActive('/') ? 'text-blue-600' : ''}`}
            >
              Products
            </Link>

            <Link
              to="/cart"
              className={`relative text-gray-700 hover:text-blue-600 font-medium ${isActive('/cart') ? 'text-blue-600' : ''}`}
            >
              <div className="flex items-center space-x-1">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {/* This will now render the count from Redux */}
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </div>
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 focus:outline-none"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium">{userName}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border">
                    <Link
                      to="/profile"
                      onClick={() => setShowDropdown(false)}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setShowDropdown(false)}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Order History
                    </Link>
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button (Hamburger) */}
          <div className="md:hidden flex items-center">
             <Link
              to="/cart"
              className={`relative text-gray-700 hover:text-blue-600 font-medium p-2 ${isActive('/cart') ? 'text-blue-600' : ''}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none p-2"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Dropdown) */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-white shadow-md absolute w-full z-40 border-t border-gray-100`}>
        <div className="flex flex-col px-4 py-3 space-y-2">
          <Link to="/" className={`block py-2 text-gray-700 hover:text-blue-600 font-medium ${isActive('/') ? 'text-blue-600' : ''}`}>
            Products
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/profile" className={`block py-2 text-gray-700 hover:text-blue-600 font-medium ${isActive('/profile') ? 'text-blue-600' : ''}`}>
                My Profile
              </Link>
              <Link to="/orders" className={`block py-2 text-gray-700 hover:text-blue-600 font-medium ${isActive('/orders') ? 'text-blue-600' : ''}`}>
                Order History
              </Link>
              <hr className="my-2" />
              <button
                onClick={handleLogout}
                className="w-full text-left px-0 py-2 text-red-600 hover:bg-red-50 font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={`block py-2 text-gray-700 hover:text-blue-600 font-medium ${isActive('/login') ? 'text-blue-600' : ''}`}>
                Login
              </Link>
              <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium text-center">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;