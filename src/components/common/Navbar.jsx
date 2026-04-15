import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { LogOut, User, Settings, ShoppingCart } from "lucide-react";
import { TbUser, TbUserExclamation } from "react-icons/tb";
import { useAuth } from "../../hooks/useAuth";
import { logoutUser } from "../../firebase/auth";
import { useCart } from "../../context/CartContext";

// Logo
import Logo from "../../assets/Logo.jsx";

// Icons
import CartIcon from "../../assets/Cart.jsx";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const accountRef = useRef(null);
  const { currentUser } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setIsAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogoutAction = async () => {
    await logoutUser();
    setIsAccountOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/auth/login");
  };

  return (
    <header
      className={`w-full bg-white md:px-8 fixed top-0 left-0 z-50 transition-all duration-300 ${
        isScrolled ? "py-4 shadow-md" : "py-4"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 lg:px-8 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex justify-center gap-8 lg:gap-12">
          {["Home", "Shop", "About", "Contact"].map((item) => (
            <NavLink
              key={item}
              to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              className={({ isActive }) =>
                `text-base font-medium transition-all duration-300 hover:text-[#B88E2F] relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-[#B88E2F] after:transition-all after:duration-300 ${
                  isActive
                    ? "text-[#B88E2F] after:w-full"
                    : "text-black after:w-0 hover:after:w-full"
                }`
              }
            >
              {item}
            </NavLink>
          ))}
        </nav>

        {/* Icons */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          <div className="relative group" ref={accountRef}>
            <button
              className="icon-btn group-hover:text-[#B88E2F] transition-colors"
              onClick={() => setIsAccountOpen(!isAccountOpen)}
            >
              {currentUser ? (
                <TbUser size={24} />
              ) : (
                <TbUserExclamation size={24} />
              )}
            </button>

            {/* Account Dropdown */}
            {isAccountOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 transform transition-all animate-in fade-in zoom-in duration-200 origin-top-right">
                {currentUser ? (
                  <>
                    <div className="px-5 py-4 border-b border-gray-50 mb-1">
                      <p className="text-[14px] font-bold text-gray-900">
                        My Account
                      </p>
                      <p className="text-[12px] text-gray-500 truncate mt-0.5">
                        {currentUser?.email}
                      </p>
                    </div>

                    {currentUser?.role === "admin" && (
                      <Link
                        to="/admin"
                        onClick={() => setIsAccountOpen(false)}
                        className="w-full flex items-center px-5 py-3 text-[14px] text-gray-700 hover:bg-[#FCF8F3] transition-colors font-medium"
                      >
                        <Settings className="h-4 w-4 mr-3 text-[#B88E2F]" />
                        Admin Dashboard
                      </Link>
                    )}

                    <button 
                      onClick={() => {
                        setIsAccountOpen(false);
                        navigate('/profile');
                      }}
                      className="w-full flex items-center px-5 py-3 text-[14px] text-gray-700 hover:bg-[#FCF8F3] transition-colors"
                    >
                      <User className="h-4 w-4 mr-3 text-gray-400" />
                      My Profile
                    </button>

                    <div className="border-t border-gray-50 mt-1 pt-1 px-2">
                      <button
                        onClick={handleLogoutAction}
                        className="w-full flex items-center px-4 py-3 text-[14px] text-red-600 hover:bg-red-50 transition-colors font-bold rounded-xl"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      to="/auth/login"
                      onClick={() => setIsAccountOpen(false)}
                      className="w-full flex items-center px-5 py-3 text-[14px] text-gray-700 hover:bg-[#FCF8F3] transition-colors font-medium"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/auth/signup"
                      onClick={() => setIsAccountOpen(false)}
                      className="w-full flex items-center px-5 py-3 text-[14px] text-gray-700 hover:bg-[#FCF8F3] transition-colors font-medium"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          <Link to="/cart" className="relative group">
            <button className="icon-btn hover:text-[#B88E2F] transition-colors">
              <CartIcon />
            </button>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#B88E2F] text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex flex-col justify-center items-center gap-1.5 p-2 w-10 h-10 bg-[#F9F1E7] rounded-lg"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 bg-black transition-transform duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block w-6 h-0.5 bg-black transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-0" : "opacity-100"}`}
          />
          <span
            className={`block w-6 h-0.5 bg-black transition-transform duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <nav
        className={`md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? "max-h-screen py-6 opacity-100" : "max-h-0 py-0 opacity-0"}`}
      >
        <ul className="flex flex-col items-center gap-6">
          {["Home", "Shop", "About", "Contact"].map((item) => (
            <li key={item} className="w-full text-center px-8">
              <NavLink
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className={({ isActive }) =>
                  `block py-3 text-[18px] font-bold rounded-xl transition-all ${isActive ? "bg-[#F9F1E7] text-[#B88E2F]" : "text-black"}`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item}
              </NavLink>
            </li>
          ))}

          {/* Mobile Icons Area */}
          <li className="w-full px-8 pt-6 border-t border-gray-50">
            <div className="grid grid-cols-4 gap-4">
              <button
                className="flex flex-col items-center gap-1 group"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate('/profile');
                }}
              >
                <div className="w-12 h-12 bg-[#F9F1E7] rounded-full flex items-center justify-center text-black group-hover:bg-[#B88E2F] group-hover:text-white transition-all">
                  {currentUser ? (
                    <TbUser size={22} />
                  ) : (
                    <TbUserExclamation size={22} />
                  )}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-tighter">
                  Profile
                </span>
              </button>

              <Link
                to="/cart"
                className="flex flex-col items-center gap-1 group"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="w-12 h-12 bg-[#F9F1E7] rounded-full flex items-center justify-center text-black group-hover:bg-[#B88E2F] group-hover:text-white transition-all relative">
                  <CartIcon />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#B88E2F] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-tighter">
                  Cart
                </span>
              </Link>
            </div>
          </li>

          {currentUser ? (
            <li className="w-full px-8 pt-4 pb-2">
              <button
                onClick={handleLogoutAction}
                className="w-full py-4 bg-red-50 text-red-600 font-bold rounded-xl flex items-center justify-center gap-2"
              >
                <LogOut size={18} /> Logout
              </button>
            </li>
          ) : (
            <li className="w-full px-8 pt-4 pb-2 flex gap-3">
              <Link
                to="/auth/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 py-4 bg-[#B88E2F] text-white font-bold rounded-xl text-center"
              >
                Sign In
              </Link>
              <Link
                to="/auth/signup"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 py-4 bg-[#F9F1E7] text-[#B88E2F] font-bold rounded-xl text-center"
              >
                Sign Up
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
