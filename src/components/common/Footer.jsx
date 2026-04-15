"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../../firebase/config"

export default function Footer() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [subscribing, setSubscribing] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (email) {
      setSubscribing(true)
      try {
        await addDoc(collection(db, "newsletter"), {
          email: email,
          subscribedAt: serverTimestamp(),
          isActive: true,
        })
        setIsSubscribed(true)
        setEmail("")
        setTimeout(() => setIsSubscribed(false), 3000)
      } catch (error) {
        console.error("Error subscribing to newsletter:", error)
      } finally {
        setSubscribing(false)
      }
    }
  }

  return (
    <section className="w-full px-4 md:px-8 lg:px-16 py-10 md:py-8 border-t border-[#E5E7EB]">
      <footer className="max-w-7xl mx-auto flex flex-col gap-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="flex flex-col gap-6">
            <h2 className="text-[24px] font-bold text-[#333333]">Furniro.</h2>
            <p className="text-[16px] font-normal text-[#9F9F9F] leading-[24px]">
              400 University Drive Suite 200 Coral Gables,
              <br />
              FL 33134 USA
            </p>
          </div>

          {/* Links Column */}
          <div className="lg:pl-12">
            <h4 className="text-[#9F9F9F] font-medium text-[16px] mb-8">Links</h4>
            <ul className="flex flex-col gap-8 text-[16px] font-medium text-[#333333]">
              <li>
                <Link to="/" className="hover:text-[#B88E2F] transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#B88E2F] transition-colors">Shop</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#B88E2F] transition-colors">About</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#B88E2F] transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Help Column */}
          <div className="lg:pl-12">
            <h4 className="text-[#9F9F9F] font-medium text-[16px] mb-8">Help</h4>
            <ul className="flex flex-col gap-8 text-[16px] font-medium text-[#333333]">
              <li className="hover:text-[#B88E2F] cursor-pointer transition-colors">Payment Options</li>
              <li className="hover:text-[#B88E2F] cursor-pointer transition-colors">Returns</li>
              <li className="hover:text-[#B88E2F] cursor-pointer transition-colors">Privacy Policy</li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[#9F9F9F] font-medium text-[16px] mb-8">Newsletter</h4>
            <form className="flex gap-3" onSubmit={handleSubmit}>
              <input
                className="outline-none border-b border-black flex-1 pb-1 text-[14px] bg-transparent"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Your Email Address"
                required
              />
              <button
                className="font-medium text-[14px] border-b border-black hover:text-[#B88E2F] hover:border-[#B88E2F] transition-all pb-1 uppercase tracking-wider disabled:opacity-50"
                type="submit"
                disabled={subscribing}
              >
                {subscribing ? "..." : "Subscribe"}
              </button>
            </form>
            {isSubscribed && <p className="text-[#2EC1AC] text-[12px] font-medium">Thank you for subscribing!</p>}
          </div>
        </div>

        <div className="pt-8 border-t border-[#D9D9D9]">
          <p className="text-[#333333] text-[16px]">2024 funiro. All rights reserved</p>
        </div>
      </footer>
    </section>
  )
}

