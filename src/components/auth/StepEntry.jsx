import { useState } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../firebase/config";
import { Button } from "../common/Button";

export default function StepEntry({ setStep, setEmail, setVerificationCode, setGoogleName }) {
  const [emailInput, setEmailInput] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const inputStyles = "w-full h-12 px-4 border border-[#9F9F9F] rounded-xl focus:border-[#B88E2F] outline-none transition-all text-[16px]";

  const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleContinue = (e) => {
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

    const code = generateCode();
    setVerificationCode(code);
    setEmail(trimmed);
    setStep("verify");
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const googleUser = result.user;

      setEmail(googleUser.email);
      setGoogleName(googleUser.displayName || "");
      setStep("complete");
    } catch (err) {
      setError(err.message || "Google sign-up failed. Please try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      <form onSubmit={handleContinue} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className="text-[14px] font-semibold text-[#333333] ml-1">
            Email Address
          </label>
          <input
            id="email"
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
              Processing...
            </div>
          ) : "Continue"}
        </Button>
      </form>

      <div className="relative flex items-center justify-center">
        <div className="border-t border-gray-200 absolute w-full" />
        <span className="bg-white px-4 text-[13px] text-[#9F9F9F] relative z-10">or</span>
      </div>

      <button
        type="button"
        onClick={handleGoogleSignUp}
        disabled={isGoogleLoading}
        className="w-full h-12 px-4 border border-[#9F9F9F] rounded-xl flex items-center justify-center gap-3 text-[15px] font-medium text-[#333333] hover:bg-gray-50 transition-colors"
      >
        {isGoogleLoading ? (
          <div className="w-5 h-5 border-2 border-gray-300 border-t-[#B88E2F] rounded-full animate-spin" />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
          </svg>
        )}
        Sign Up with Google
      </button>
    </div>
  );
}
