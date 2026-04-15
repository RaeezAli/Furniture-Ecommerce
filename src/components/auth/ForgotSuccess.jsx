import { Link } from "react-router-dom";
import { Button } from "../common/Button";

export default function ForgotSuccess({ email }) {
  return (
    <div className="space-y-6 text-center">
      <div className="w-16 h-16 mx-auto rounded-full bg-green-50 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#2EC1AC]" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      </div>
      
      <div>
        <h2 className="text-[16px] font-semibold text-[#333333] mb-2">Verification Complete</h2>
        <p className="text-[13px] text-[#616161]">
          Your email <span className="font-medium text-[#333333]">{email}</span> has been verified.
        </p>
        <p className="text-[13px] text-[#616161] mt-2">
          Please contact support to reset your password.
        </p>
      </div>

      <Button
        onClick={() => window.open('mailto:support@furniro.com', '_blank')}
        className="w-full h-14 rounded-xl text-[18px] font-bold"
        style={{ border: '2px solid #B88E2F', backgroundColor: 'transparent', color: '#B88E2F' }}
      >
        Contact Support
      </Button>

      <div className="text-center">
        <Link to="/login" className="text-[14px] text-[#B88E2F] hover:underline font-medium">
          ← Back to Login
        </Link>
      </div>
    </div>
  );
}