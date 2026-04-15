import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ForgotEmail from "../../components/auth/ForgotEmail";
import ForgotVerify from "../../components/auth/ForgotVerify";
import ForgotSuccess from "../../components/auth/ForgotSuccess";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

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
          {step === "email" && (
            <ForgotEmail 
              setStep={setStep} 
              setEmail={setEmail} 
              setVerificationCode={setVerificationCode} 
            />
          )}
          
          {step === "verify" && (
            <ForgotVerify 
              step={step}
              setStep={setStep} 
              email={email} 
              verificationCode={verificationCode}
              setVerificationCode={setVerificationCode}
            />
          )}
          
          {step === "success" && (
            <ForgotSuccess email={email} />
          )}
        </div>
      </div>
    </div>
  );
}