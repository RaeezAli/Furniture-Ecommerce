"use client"

import { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"

// Logo
import Logo from "../../assets/Logo.jsx"
import { Link } from "react-router-dom"

// Icons
import AcountIcon from "../../assets/Acount-Alert.jsx"
import SearchIcon from "../../assets/SearchIcon.jsx"
import HeartIcon from "../../assets/Heart.jsx"
import CartIcon from "../../assets/Cart.jsx"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
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
          {['Home', 'Shop', 'About', 'Contact'].map((item) => (
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
          <button className="icon-btn">
            <AcountIcon />
          </button>
          <button className="icon-btn">
            <SearchIcon />
          </button>
          <button className="icon-btn relative group">
            <HeartIcon />
          </button>
          <Link to='/billing'>

          <button className="icon-btn relative group">
            <CartIcon />
          </button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden flex flex-col gap-1.5 p-2" onClick={toggleMobileMenu} aria-label="Toggle menu">
          <span className={`block w-6 h-0.5 bg-black transition-transform duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-black transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-0" : "opacity-100"}`} />
          <span className={`block w-6 h-0.5 bg-black transition-transform duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      <nav className={`md:hidden absolute top-full left-0 w-full bg-white shadow-md transition-transform duration-300 ${isMobileMenuOpen ? "block" : "hidden"}`}>
        <ul className="flex flex-col items-center py-4 gap-4">
          {['Home', 'Shop', 'About', 'Contact'].map((item) => (
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
        </ul>
      </nav>
    </header>
  )
}
