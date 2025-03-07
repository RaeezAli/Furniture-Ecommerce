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
    <section className="w-full px-4 sm:px-8 md:px-16 lg:px-24 py-11 grid gap-10">
      <footer className="w-full grid md:flex md:flex-row gap-8">
        <div className="flex flex-col gap-8">
          <h1 className="w-full text-2xl font-bold">Funiro.</h1>
          <p style={{ color: "rgba(159, 159, 159, 1)" }} className="w-full font-normal text-base">
            400 University Drive Suite 200 Coral Gables,
            <br />
            FL 33134 USA
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 md:px-8 gap-8">
          <div>
            <ul className="grid gap-6 md:gap-9">
              <li style={{ color: "rgba(159, 159, 159, 1)" }} className="font-medium text-base">
                Links
              </li>
              <li className="hover:text-[#B88E2F] transition-colors">
                <Link to="/home">Home</Link>
              </li>
              <li className="hover:text-[#B88E2F] transition-colors">
                <Link to="/shop">Shop</Link>
              </li>
              <li className="hover:text-[#B88E2F] transition-colors">
                <Link to="/about">About</Link>
              </li>
              <li className="hover:text-[#B88E2F] transition-colors">
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>
          <div>
            <ul className="grid gap-6 md:gap-9">
              <li style={{ color: "rgba(159, 159, 159, 1)" }} className="font-medium text-base">
                Help
              </li>
              <li className="hover:text-[#B88E2F] transition-colors">Payment Options</li>
              <li className="hover:text-[#B88E2F] transition-colors">Returns</li>
              <li className="hover:text-[#B88E2F] transition-colors">Privacy Policy</li>
            </ul>
          </div>
          <div className="w-full flex flex-col gap-6 md:gap-9">
            <p style={{ color: "rgba(159, 159, 159, 1)" }} className="w-full font-medium text-base">
              Newsletter
            </p>
            <form className="w-full flex gap-4" onSubmit={handleSubmit}>
              <input
                style={{ borderBottom: "2px solid black" }}
                className="outline-none flex-1"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Your Email"
                required
              />
              <button
                style={{ borderBottom: "2px solid black" }}
                className="font-medium hover:text-[#B88E2F] transition-colors"
              >
                SUBSCRIBE
              </button>
            </form>
            {isSubscribed && <p className="text-green-600 text-sm">Thank you for subscribing!</p>}
          </div>
        </div>
      </footer>
      <hr className="border-gray-200" />
      <article className="text-gray-600">2024 furino. All rights reverved</article>
    </section>
  )
}

