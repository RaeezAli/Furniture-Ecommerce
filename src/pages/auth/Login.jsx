import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react"
import { loginUser } from "../../firebase/auth"
import { Button } from "../../components/common/Button"
import loginimage from '../../Images/Common/login.avif'

export default function Login() {
  const navigate = useNavigate()
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const onSubmit = async (data) => {
    setIsLoading(true)
    setError("")
    
    try {
      // Hardcoded Admin Bypass for Demo
      if (data.email === "admin@example.com" && data.password === "admin123") {
        localStorage.setItem("furniro_demo_admin", "true");
        window.location.href = "/admin"; // Use window.location to force full reload and pick up new state
        return;
      }

      const { user, role, error: authError } = await loginUser(data.email, data.password)
      
      if (authError) {
        setError(authError)
      } else {
        // Role based redirection
        if (role === 'admin') {
          navigate("/admin")
        } else {
          navigate("/")
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const inputStyles = "w-full h-12 px-4 border border-[#9F9F9F] rounded-xl focus:border-[#B88E2F] outline-none transition-all text-[16px]";

  const { title, subtitle } = { title: "Welcome Back", subtitle: "Enter your credentials to access your account" };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left side - Image */}
      <div className="hidden md:block md:w-1/2 relative overflow-hidden">
        <img
          src={loginimage}
          alt="Luxury furniture"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20 flex flex-col justify-end p-16">
          <div className="text-white max-w-md">
            <h1 className="text-[48px] font-bold leading-tight mb-4">Furniro</h1>
            <p className="text-[18px] font-light opacity-90 border-l-2 border-[#B88E2F] pl-6">
              Elevate your living space with our curated collection of premium furniture.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#F4F5F7]/30">
        <div className="w-full max-w-md p-8 md:p-12 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          <div className="text-center mb-10">
            <h2 className="text-[32px] font-bold text-[#333333] mb-2">{title}</h2>
            <p className="text-[#9F9F9F] text-[16px]">{subtitle}</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-[14px] font-semibold text-[#333333] ml-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  {...register("email", { required: "Email is required" })}
                  className={inputStyles}
                />
                {errors.email && <p className="text-xs text-red-500 mt-1 ml-1">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label htmlFor="password" className="text-[14px] font-semibold text-[#333333]">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-[12px] text-[#B88E2F] hover:underline font-medium"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password", { required: "Password is required" })}
                    className={inputStyles}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-4 flex items-center text-[#9F9F9F] hover:text-[#333333] transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12.a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1 ml-1">{errors.password.message}</p>}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 rounded-xl text-[18px] font-bold shadow-lg shadow-[#B88E2F]/20"
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : "Sign In"}
              </Button>
            </form>

          <div className="mt-8 text-center">
            <p className="text-[14px] text-[#9F9F9F]">
              Don&apos;t have an account?{" "}
              <Link to="/auth/signup" className="text-[#B88E2F] hover:underline font-bold ml-1">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
