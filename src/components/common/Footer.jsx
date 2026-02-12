"use client"

import { useState } from "react"
import { Link } from "react-router-dom"

export default function Footer() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setEmail("")
      setTimeout(() => setIsSubscribed(false), 3000)
    }
  }

  return (
    <section className="w-full px-3 sm:px-4 md:px-8 lg:px-16 xl:px-24 py-6 sm:py-8 md:py-11">
      <footer className="w-full flex flex-col gap-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="flex flex-col gap-4 sm:gap-6 md:gap-8">
            <h1 className="text-xl sm:text-2xl font-bold">Funiro.</h1>
            <p className="text-sm sm:text-base font-normal text-[#9F9F9F]">
              400 University Drive Suite 200 Coral Gables,
              <br />
              FL 33134 USA
            </p>
          </div>

          {/* Links Column */}
          <div className="min-w-[120px]">
            <ul className="grid gap-4 md:gap-6">
              <li className="text-[#9F9F9F] font-medium text-sm sm:text-base">Links</li>
              <li className="hover:text-[#B88E2F] transition-colors text-sm sm:text-base">
                <Link to="/home">Home</Link>
              </li>
              <li className="hover:text-[#B88E2F] transition-colors text-sm sm:text-base">
                <Link to="/shop">Shop</Link>
              </li>
              <li className="hover:text-[#B88E2F] transition-colors text-sm sm:text-base">
                <Link to="/about">About</Link>
              </li>
              <li className="hover:text-[#B88E2F] transition-colors text-sm sm:text-base">
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Help Column */}
          <div className="min-w-[120px]">
            <ul className="grid gap-4 md:gap-6">
              <li className="text-[#9F9F9F] font-medium text-sm sm:text-base">Help</li>
              <li className="hover:text-[#B88E2F] transition-colors text-sm sm:text-base">Payment Options</li>
              <li className="hover:text-[#B88E2F] transition-colors text-sm sm:text-base">Returns</li>
              <li className="hover:text-[#B88E2F] transition-colors text-sm sm:text-base">Privacy Policy</li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="w-full flex flex-col gap-4 md:gap-6">
            <p className="text-[#9F9F9F] font-medium text-sm sm:text-base">Newsletter</p>
            <form className="w-full flex flex-col xs:flex-row gap-2 xs:gap-4" onSubmit={handleSubmit}>
              <input
                style={{ borderBottom: "2px solid black" }}
                className="outline-none min-w-0 flex-1 pb-1 text-sm sm:text-base"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Your Email"
                required
              />
              <button
                style={{ borderBottom: "2px solid black" }}
                className="font-medium hover:text-[#B88E2F] transition-colors text-sm sm:text-base pb-1 whitespace-nowrap"
                type="submit"
              >
                SUBSCRIBE
              </button>
            </form>
            {isSubscribed && <p className="text-green-600 text-xs sm:text-sm">Thank you for subscribing!</p>}
          </div>
        </div>
      </footer>

      <hr className="border-gray-200 my-6 sm:my-8" />

      <div className="text-gray-600 text-xs sm:text-sm">2024 furino. All rights reserved</div>
    </section>
  )
}

