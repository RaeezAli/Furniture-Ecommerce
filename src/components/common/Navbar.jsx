import { useState, useEffect, useRef } from "react"
import { NavLink, useNavigate, Link } from "react-router-dom"
import { LogOut, User, Settings, HelpCircle } from "lucide-react"

// Logo
import Logo from "../../assets/Logo.jsx"

// Icons
import AcountIcon from "../../assets/Acount-Alert.jsx"
import SearchIcon from "../../assets/SearchIcon.jsx"
import HeartIcon from "../../assets/Heart.jsx"
import CartIcon from "../../assets/Cart.jsx"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const accountRef = useRef(null)
  const navigate = useNavigate()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setIsAccountOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleLogout = () => {
    // Simulate logout logic
    console.log("User logged out")
    setIsAccountOpen(false)
    setIsMobileMenuOpen(false)
    navigate("/")
  }

  return (
    <header
      className={`w-full bg-white fixed top-0 left-0 z-50 transition-all duration-300 ${
        isScrolled ? "py-4 shadow-md" : "py-7"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 lg:px-16 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex justify-center gap-8 lg:gap-12">
          {["Home", "Shop", "About", "Contact"].map((item) => (
            <NavLink
              key={item}
              to={`/${item.toLowerCase()}`}
              className={({ isActive }) =>
                `text-base font-medium transition-all duration-300 hover:text-[#B88E2F] relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-[#B88E2F] after:transition-all after:duration-300 ${
                  isActive ? "text-[#B88E2F] after:w-full" : "text-black after:w-0 hover:after:w-full"
                }`
              }
            >
              {item}
            </NavLink>
          ))}
        </nav>

        {/* Icons */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          <div className="relative" ref={accountRef}>
            <button 
              className="icon-btn focus:outline-none" 
              onClick={() => setIsAccountOpen(!isAccountOpen)}
            >
              <AcountIcon />
            </button>
            
            {/* Account Dropdown */}
            {isAccountOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 transform transition-all animate-in fade-in zoom-in duration-200 origin-top-right">
                <div className="px-4 py-3 border-b border-gray-50 mb-1">
                  <p className="text-sm font-semibold text-gray-900">My Account</p>
                  <p className="text-xs text-gray-500 truncate">ali@gmail.com</p>
                </div>
                
                <button className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <User className="h-4 w-4 mr-3 text-gray-400" />
                  Profile
                </button>
                <button className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <Settings className="h-4 w-4 mr-3 text-gray-400" />
                  Settings
                </button>
                <button className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <HelpCircle className="h-4 w-4 mr-3 text-gray-400" />
                  Help Center
                </button>
                
                <div className="border-t border-gray-50 mt-1 pt-1">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          <button className="icon-btn">
            <SearchIcon />
          </button>
          <button className="icon-btn relative group">
            <HeartIcon />
          </button>
          <Link to="/billing">
            <button className="icon-btn relative group">
              <CartIcon />
            </button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden flex flex-col gap-1.5 p-2" onClick={toggleMobileMenu} aria-label="Toggle menu">
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
        className={`md:hidden absolute top-full left-0 w-full bg-white shadow-md transition-transform duration-300 ${isMobileMenuOpen ? "block" : "hidden"}`}
      >
        <ul className="flex flex-col items-center py-4 gap-4">
          {["Home", "Shop", "About", "Contact"].map((item) => (
            <li key={item}>
              <NavLink
                to={`/${item.toLowerCase()}`}
                className="text-base font-medium text-black hover:text-[#B88E2F]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item}
              </NavLink>
            </li>
          ))}

          {/* Mobile Icons */}
          <li className="w-full flex justify-center pt-4 border-t border-gray-100">
            <div className="flex items-center gap-8 py-2">
              <div className="group relative">
                <button 
                  className="icon-btn flex flex-col items-center" 
                  onClick={() => setIsAccountOpen(!isAccountOpen)}
                >
                  <AcountIcon />
                  <span className="text-xs mt-1">Account</span>
                </button>
                
                {isAccountOpen && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-white rounded-lg shadow-lg border border-gray-100 py-1 overflow-hidden">
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center px-3 py-2 text-xs text-red-600 font-bold hover:bg-red-50"
                    >
                      <LogOut className="h-3 w-3 mr-1.5" />
                      Logout
                    </button>
                  </div>
                )}
              </div>

              <button className="icon-btn flex flex-col items-center" onClick={() => setIsMobileMenuOpen(false)}>
                <SearchIcon />
                <span className="text-xs mt-1">Search</span>
              </button>
              <button className="icon-btn flex flex-col items-center" onClick={() => setIsMobileMenuOpen(false)}>
                <HeartIcon />
                <span className="text-xs mt-1">Wishlist</span>
              </button>
              <Link to="/billing" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="icon-btn flex flex-col items-center">
                  <CartIcon />
                  <span className="text-xs mt-1">Cart</span>
                </button>
              </Link>
            </div>
          </li>
        </ul>
      </nav>
    </header>
  )
}

