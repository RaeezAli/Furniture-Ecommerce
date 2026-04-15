import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import { auth } from "../../firebase/config";
import { Button } from "../../components/common/Button";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get("oobCode");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(null);
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const inputStyles = "w-full h-12 px-4 border border-[#9F9F9F] rounded-xl focus:border-[#B88E2F] outline-none transition-all text-[16px]";

  useEffect(() => {
    const verifyCode = async () => {
      if (!oobCode) {
        setIsValid(false);
        setError("Invalid reset link. Please request a new password reset.");
        return;
      }

      try {
        const email = await verifyPasswordResetCode(auth, oobCode);
        setEmail(email);
        setIsValid(true);
      } catch (err) {
        console.error("Verify error:", err);
        setIsValid(false);
        setError("This reset link has expired or is invalid. Please request a new one.");
      }
    };

    verifyCode();
  }, [oobCode]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!newPassword) {
      setError("Please enter a new password");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setSuccess(true);
    } catch (err) {
      console.error("Reset password error:", err);
      if (err.code === "auth/expired-action-code") {
        setError("This reset link has expired. Please request a new password reset.");
      } else if (err.code === "auth/invalid-action-code") {
        setError("This reset link is invalid. Please request a new password reset.");
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak. Please use a stronger password.");
      } else {
        setError(err.message || "Failed to reset password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isValid === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F5F7]/30">
        <div className="w-10 h-10 border-4 border-[#B88E2F]/30 border-t-[#B88E2F] rounded-full animate-spin" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col md:flex-row bg-white">
        <div className="hidden md:block md:w-1/2 relative overflow-hidden">
          <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800" alt="Luxury furniture" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/20 flex flex-col justify-end p-16">
            <div className="text-white max-w-md">
              <h1 className="text-[48px] font-bold leading-tight mb-4">Furniro</h1>
              <p className="text-[18px] font-light opacity-90 border-l-2 border-[#B88E2F] pl-6">Elevate your living space with our curated collection.</p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-8 bg-[#F4F5F7]/30">
          <div className="w-full max-w-md p-8 md:p-12 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
            <div className="text-center mb-10">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-50 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-[32px] font-bold text-[#333333] mb-2">Password Reset!</h2>
              <p className="text-[#9F9F9F] text-[16px]">Your password has been reset successfully.</p>
            </div>
            <Button onClick={() => navigate("/login")} className="w-full h-14 rounded-xl text-[18px] font-bold shadow-lg shadow-[#B88E2F]/20">
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isValid === false) {
    return (
      <div className="min-h-screen flex flex-col md:flex-row bg-white">
        <div className="hidden md:block md:w-1/2 relative overflow-hidden">
          <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800" alt="Luxury furniture" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/20 flex flex-col justify-end p-16">
            <div className="text-white max-w-md">
              <h1 className="text-[48px] font-bold leading-tight mb-4">Furniro</h1>
              <p className="text-[18px] font-light opacity-90 border-l-2 border-[#B88E2F] pl-6">Elevate your living space with our curated collection.</p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-8 bg-[#F4F5F7]/30">
          <div className="w-full max-w-md p-8 md:p-12 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
            <div className="text-center mb-10">
              <div className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-[32px] font-bold text-[#333333] mb-2">Invalid Link</h2>
              <p className="text-[#9F9F9F] text-[16px]">{error}</p>
            </div>
            <Button onClick={() => navigate("/forgot-password")} className="w-full h-14 rounded-xl text-[18px] font-bold shadow-lg shadow-[#B88E2F]/20">
              Request New Link
            </Button>
            <div className="mt-6 text-center">
              <button onClick={() => navigate("/login")} className="text-[14px] text-[#B88E2F] hover:underline font-medium">← Back to Login</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      <div className="hidden md:block md:w-1/2 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800" alt="Luxury furniture" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/20 flex flex-col justify-end p-16">
          <div className="text-white max-w-md">
            <h1 className="text-[48px] font-bold leading-tight mb-4">Furniro</h1>
            <p className="text-[18px] font-light opacity-90 border-l-2 border-[#B88E2F] pl-6">Elevate your living space with our curated collection.</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-[#F4F5F7]/30">
        <div className="w-full max-w-md p-8 md:p-12 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          <div className="text-center mb-10">
            <h2 className="text-[32px] font-bold text-[#333333] mb-2">Reset Password</h2>
            <p className="text-[#9F9F9F] text-[16px]">
              Resetting password for<br />
              <span className="font-semibold text-[#333333]">{email}</span>
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="newPassword" className="text-[14px] font-semibold text-[#333333] ml-1">New Password</label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={inputStyles}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-4 flex items-center text-[#9F9F9F] hover:text-[#333333]"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="text-[11px] text-[#9F9F9F] ml-1">Minimum 6 characters</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-[14px] font-semibold text-[#333333] ml-1">Confirm Password</label>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputStyles}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || !newPassword || !confirmPassword}
              className="w-full h-14 rounded-xl text-[18px] font-bold shadow-lg shadow-[#B88E2F]/20"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Resetting...
                </div>
              ) : "Reset Password"}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <button onClick={() => navigate("/login")} className="text-[14px] text-[#B88E2F] hover:underline font-medium">
              ← Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}