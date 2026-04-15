import { useState } from "react";
import { Link } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase/config";
import { Button } from "../common/Button";
import { Loader2 } from "lucide-react";

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export default function ForgotEmail({ setStep, setEmail, setVerificationCode }) {
  const [emailInput, setEmailInput] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const inputStyles = "w-full h-12 px-4 border border-[#9F9F9F] rounded-xl focus:border-[#B88E2F] outline-none transition-all text-[16px]";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const trimmed = emailInput.trim();
    if (!trimmed) {
      setError("Email is required");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    
    // Store email
    setEmail(trimmed);

    // Generate OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    setVerificationCode(otpCode);

    // Try EmailJS first
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        { to_email: trimmed, verification_code: otpCode },
        EMAILJS_PUBLIC_KEY
      );
      console.log("EmailJS OTP sent!");
    } catch (emailError) {
      console.log("EmailJS error:", emailError.message);
    }

    // Try Firebase reset email
    try {
      await sendPasswordResetEmail(auth, trimmed);
      console.log("Firebase reset email sent!");
    } catch (firebaseError) {
      console.log("Firebase reset error:", firebaseError.code, firebaseError.message);
    }

    // Move to verify step
    setStep("verify");
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-[14px] text-[#9F9F9F]">
          Enter the email address associated with your account
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="forgotEmail" className="text-[14px] font-semibold text-[#333333] ml-1">
            Email Address
          </label>
          <input
            id="forgotEmail"
            type="email"
            placeholder="name@company.com"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            className={inputStyles}
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-14 rounded-xl text-[18px] font-bold shadow-lg shadow-[#B88E2F]/20"
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sending code...
            </div>
          ) : "Send Verification Code"}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-[14px] text-[#9F9F9F]">
          Remember your password?{" "}
          <Link to="/login" className="text-[#B88E2F] hover:underline font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
