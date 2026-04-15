import { useState } from "react"
import { Link } from "react-router-dom"
import loginimage from '../../Images/Common/login.avif'
import StepEntry from "../../components/auth/StepEntry"
import StepVerification from "../../components/auth/StepVerification"
import StepComplete from "../../components/auth/StepComplete"

export default function Signup() {
  const [step, setStep] = useState("entry")
  const [email, setEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [googleName, setGoogleName] = useState("")

  const stepTitles = {
    entry: { title: "Create Account", subtitle: "Join our luxury furniture community" },
    verify: { title: "Verify Email", subtitle: "Enter the 6-digit code we sent you" },
    complete: { title: "Set Password", subtitle: googleName ? "Set a password for your account" : "Secure your account with a password" },
  }

  const { title, subtitle } = stepTitles[step]

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
              Create an account and start your journey towards a more beautiful home.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Signup form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#F4F5F7]/30">
        <div className="w-full max-w-md p-8 md:p-12 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          <div className="text-center mb-10">
            <h2 className="text-[32px] font-bold text-[#333333] mb-2">{title}</h2>
            <p className="text-[#9F9F9F] text-[16px]">{subtitle}</p>
          </div>

          {step === "entry" && (
            <StepEntry
              setStep={setStep}
              setEmail={setEmail}
              setVerificationCode={setVerificationCode}
              setGoogleName={setGoogleName}
            />
          )}

          {step === "verify" && (
            <StepVerification
              email={email}
              verificationCode={verificationCode}
              setStep={setStep}
              setVerificationCode={setVerificationCode}
            />
          )}

          {step === "complete" && (
            <StepComplete email={email} googleName={googleName} />
          )}

          <div className="mt-8 text-center">
            <p className="text-[14px] text-[#9F9F9F]">
              Already have an account?{" "}
              <Link to="/auth/login" className="text-[#B88E2F] hover:underline font-bold ml-1">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
