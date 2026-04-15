import { useState, useEffect, useRef, useCallback } from "react";
import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

emailjs.init(EMAILJS_PUBLIC_KEY);

function maskEmail(email) {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  return local[0] + "***@" + domain;
}

export default function ForgotVerify({
  email,
  verificationCode,
  setStep,
  setVerificationCode,
}) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(30);
  const inputRefs = useRef([]);
  const hasSentRef = useRef(false);

  const sendCode = useCallback(
    async (code) => {
      setIsSending(true);
      setSendError("");
      try {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            to_email: email,
            verification_code: code,
          }
        );
      } catch (err) {
        console.error("EmailJS send error:", err);
        setSendError(
          "Failed to send verification email. Please check your EmailJS configuration or click 'Change email' to try again."
        );
      } finally {
        setIsSending(false);
      }
    },
    [email]
  );

  useEffect(() => {
    if (hasSentRef.current) return;
    hasSentRef.current = true;
    sendCode(verificationCode);
    inputRefs.current[0]?.focus();
  }, [sendCode, verificationCode]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const checkCode = useCallback(
    (newDigits) => {
      const entered = newDigits.join("");
      if (entered.length === 6) {
        if (entered === verificationCode) {
          setError("");
          setStep("success");
        } else {
          setError("Incorrect code, please try again");
        }
      }
    },
    [verificationCode, setStep]
  );

  const handleDigitChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;

    setError("");
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    checkCode(newDigits);
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const newDigits = [...digits];
      newDigits[index - 1] = "";
      setDigits(newDigits);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const newDigits = [...digits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || "";
    }
    setDigits(newDigits);

    const focusIndex = Math.min(pasted.length, 5);
    inputRefs.current[focusIndex]?.focus();

    checkCode(newDigits);
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || isSending) return;

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setVerificationCode(newCode);
    setDigits(["", "", "", "", "", ""]);
    setError("");
    setResendCooldown(30);
    inputRefs.current[0]?.focus();
    await sendCode(newCode);
  };

  const digitInputStyles =
    "w-12 h-14 text-center text-[22px] font-bold border border-[#9F9F9F] rounded-xl focus:border-[#B88E2F] outline-none transition-all";

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-[14px] text-[#9F9F9F]">
          We sent a code to{" "}
          <span className="font-semibold text-[#333333]">{maskEmail(email)}</span>
        </p>
      </div>

      {sendError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {sendError}
        </div>
      )}

      <div className="flex justify-center gap-3">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleDigitChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={`${digitInputStyles} ${error ? "border-red-400" : ""}`}
          />
        ))}
      </div>

      {error && (
        <p className="text-center text-xs text-red-500">{error}</p>
      )}

      <div className="text-center space-y-2">
        {isSending && (
          <p className="text-[13px] text-[#9F9F9F]">Sending code...</p>
        )}
        <button
          type="button"
          onClick={handleResend}
          disabled={resendCooldown > 0 || isSending}
          className={`text-[14px] font-medium transition-colors ${
            resendCooldown > 0 || isSending
              ? "text-[#9F9F9F] cursor-not-allowed"
              : "text-[#B88E2F] hover:underline"
          }`}
        >
          {resendCooldown > 0 ? `Resend Code in ${resendCooldown}s` : "Resend Code"}
        </button>
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={() => setStep("email")}
          className="text-[14px] text-[#B88E2F] hover:underline font-medium"
        >
          ← Change email
        </button>
      </div>
    </div>
  );
}
