import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile, updatePassword } from "firebase/auth";
import { nanoid } from "nanoid";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/config";
import { Button } from "../common/Button";

export default function StepComplete({ email, googleName }) {
  const navigate = useNavigate();
  const isGoogleUser = !!googleName;
  const [name, setName] = useState(googleName || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const inputStyles = "w-full h-12 px-4 border border-[#9F9F9F] rounded-xl focus:border-[#B88E2F] outline-none transition-all text-[16px]";

  const EyeIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  );

  const EyeOffIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Full name is required");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      let user;

      if (isGoogleUser) {
        user = auth.currentUser;
        await updatePassword(user, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        user = userCredential.user;
      }

      await updateProfile(user, { displayName: name });

      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        role: "customer",
        internalId: nanoid(8).toUpperCase(),
        createdAt: new Date(),
      });

      navigate("/auth/login");
    } catch (err) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="fullName" className="text-[14px] font-semibold text-[#333333] ml-1">
          Full Name
        </label>
        <input
          id="fullName"
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputStyles}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-[14px] font-semibold text-[#333333] ml-1">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputStyles}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-4 flex items-center text-[#9F9F9F] hover:text-[#333333] transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? EyeOffIcon : EyeIcon}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-[14px] font-semibold text-[#333333] ml-1">
          Confirm Password
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={inputStyles}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-4 flex items-center text-[#9F9F9F] hover:text-[#333333] transition-colors"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? EyeOffIcon : EyeIcon}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-14 rounded-xl text-[18px] font-bold shadow-lg shadow-[#B88E2F]/20"
      >
        {isLoading ? (
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Creating account...
          </div>
        ) : "Create Account"}
      </Button>
    </form>
  );
}
