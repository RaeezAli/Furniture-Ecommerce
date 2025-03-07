"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import loginimage from '../Images/Common/login.avif'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("hammadalam@gmail.com")
  const [password, setPassword] = useState("hammad")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess(false)

    // Simulate API call
    setTimeout(() => {
      if (email === "hammadalam@gmail.com" && password === "hammad") {
        setSuccess(true)
        setTimeout(() => {
          navigate("/home")
        }, 1500)
      } else {
        setError("Invalid email or password. Please try again.")
      }
      setIsLoading(false)
    }, 800)
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Image */}
      <div className="hidden md:block md:w-1/2 relative">
        <img
          src={loginimage}
          alt="Luxury furniture"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 flex flex-col justify-between p-12">
          <div className="text-white">
            <h1 className="text-3xl font-serif font-bold">Furniro</h1>
            <p className="text-sm mt-1 opacity-80">Premium Furniture Collection</p>
          </div>
     
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#f8f5f2]">
        <div className="w-full max-w-md border-none shadow-xl bg-white rounded-lg">
          <div className="p-6 space-y-1">
            <div className="flex justify-center mb-4">
              <div className="w-28 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <span className="text-amber-800 font-serif text-xl font-bold">Furniro</span>
              </div>
            </div>
            <h2 className="text-2xl font-serif text-center text-amber-900">Welcome Back</h2>
            <p className="text-center text-gray-500 text-sm">Note : Use default credentials to signin</p>
          </div>

          <div className="px-6 pb-6">
            {error && (
              <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-800">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-red-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <span className="font-medium">Error</span>
                </div>
                <p className="ml-7 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 rounded-md bg-green-50 border border-green-200 text-green-800">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-green-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <span className="font-medium">Success!</span>
                </div>
                <p className="ml-7 text-sm">Login successful. Redirecting you...</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium block">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-11 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <a href="#" className="text-xs text-amber-700 hover:text-amber-900 hover:underline">
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full h-11 px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className={`w-full h-11 rounded-md text-white font-medium ${
                  isLoading ? "bg-amber-700 opacity-70 cursor-not-allowed" : "bg-amber-800 hover:bg-amber-900"
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button className="h-11 px-4 border border-gray-300 rounded-md flex items-center justify-center space-x-2 hover:bg-gray-50">
                  <img
                    src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
                    alt="Google logo"
                    className="w-5 h-5"
                  />
                  <span className="text-sm">Google</span>
                </button>
                <button className="h-11 px-4 border border-gray-300 rounded-md flex items-center justify-center space-x-2 hover:bg-gray-50">
                  <svg className="h-5 w-5" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z" />
                  </svg>
                  <span className="text-sm">Facebook</span>
                </button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <a href="#" className="text-amber-700 hover:text-amber-900 hover:underline font-medium">
                  Create account
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

