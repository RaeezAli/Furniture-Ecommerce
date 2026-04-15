import { useState, useEffect, useRef, useCallback } from "react";
import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

function maskEmail(email) {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  return local[0] + "***@" + domain;
}

export default function StepVerification({
  email,
  verificationCode,
  setStep,
  setVerificationCode,
}) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(30);
  const inputRefs = useRef([]);

  const sendCode = useCallback(
    async (code) => {
      setIsSending(true);
      setError("");
      try {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            to_email: email,
            verification_code: code,
          },
          EMAILJS_PUBLIC_KEY
        );
      } catch (err) {
        console.error("EmailJS send error:", err);
      } finally {
        setIsSending(false);
      }
    },
    [email]
  );

  useEffect(() => {
    sendCode(verificationCode);
    inputRefs.current[0]?.focus();
  }, []);

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
          setStep("complete");
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
          onClick={() => setStep("entry")}
          className="text-[14px] text-[#B88E2F] hover:underline font-medium"
        >
          ← Change email
        </button>
      </div>
    </div>
  );
}
