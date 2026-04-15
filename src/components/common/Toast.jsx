import React, { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, X } from "lucide-react";

/**
 * Toast Notification System
 * Following the specification in Dashboard_screens_and_modals.md
 */
export const Toast = ({ message, type = "success", onClose, duration = 3000 }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300); // Wait for slide-out animation
  };

  const isSuccess = type === "success";

  return (
    <div 
      className={`fixed top-5 right-5 z-[60] flex items-center gap-3 bg-white border border-[#E5E7EB] rounded-lg shadow-lg px-4 py-3 min-w-[300px] transition-all duration-300 transform ${
        isExiting ? "translate-x-[120%] opacity-0" : "translate-x-0 opacity-100"
      } animate-in slide-in-from-right duration-300`}
      style={{ borderLeft: `3px solid ${isSuccess ? "#2EC1AC" : "#E24B4A"}` }}
    >
      <div className={isSuccess ? "text-[#2EC1AC]" : "text-[#E24B4A]"}>
        {isSuccess ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
      </div>
      
      <div className="flex-1">
        <p className="text-[13px] font-medium text-[#333333]">{message}</p>
      </div>

      <button 
        onClick={handleClose}
        className="text-[#898989] hover:text-[#333333] transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
};

// Hook-like utility to manage multiple toasts could be added, 
// but for now we'll use a local state in parent components.
