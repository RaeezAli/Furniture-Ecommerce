import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase/config";
import { Button } from "../common/Button";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function ForgotReset({ email, setStep }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const inputStyles = "w-full h-12 px-4 border border-[#9F9F9F] rounded-xl focus:border-[#B88E2F] outline-none transition-all text-[16px]";

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!newPassword) {
      setError("Please enter a new password");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      // Firebase doesn't allow direct password set without re-auth
      // So we'll send password reset email and complete the flow
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (err) {
      console.error("Password reset error:", err);
      if (err.code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later.");
      } else {
        setError(err.message || "Failed to reset password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-6 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-green-50 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h3 className="text-[18px] font-semibold text-[#333333] mb-2">Password Reset Link Sent</h3>
          <p className="text-[14px] text-[#9F9F9F]">
            We've sent a password reset link to<br />
            <span className="font-semibold text-[#333333]">{email}</span>
          </p>
          <p className="text-[13px] text-[#9F9F9F] mt-3">
            Click the link in your email to set a new password.
          </p>
        </div>
        <Button
          onClick={() => setStep("login")}
          className="w-full h-14 rounded-xl text-[18px] font-bold shadow-lg shadow-[#B88E2F]/20"
        >
          Back to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-[14px] text-[#9F9F9F]">
          Enter your new password for{" "}
          <span className="font-semibold text-[#333333]">{email}</span>
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      <form onSubmit={handleResetPassword} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="newPassword" className="text-[14px] font-semibold text-[#333333] ml-1">
            New Password
          </label>
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
          <p className="text-[11px] text-[#9F9F9F] ml-1">Minimum 8 characters</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-[14px] font-semibold text-[#333333] ml-1">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputStyles}
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading || !newPassword || !confirmPassword}
          className="w-full h-14 rounded-xl text-[18px] font-bold shadow-lg shadow-[#B88E2F]/20"
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin" />
              Sending reset link...
            </div>
          ) : "Reset Password"}
        </Button>
      </form>

      <div className="text-center">
        <button
          type="button"
          onClick={() => setStep("forgotVerify")}
          className="text-[14px] text-[#B88E2F] hover:underline font-medium"
        >
          ← Back to Verify
        </button>
      </div>
    </div>
  );
}