import React, { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";

/**
 * Global Modal System
 * Following the specification in Dashboard_screens_and_modals.md
 */
export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer, 
  width = "480px",
  loading = false,
  confirmText = "Save Changes",
  onConfirm,
  showFooter = true,
  type = "default" // "default" or "danger"
}) => {
  // Handle Escape key to close
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isDanger = type === "danger";

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      {/* Modal Box */}
      <div 
        className="bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar animate-in fade-in slide-in-from-bottom-4 duration-200"
        style={{ width }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 pb-4 border-b border-[#E5E7EB]">
          <h3 className="text-[16px] font-semibold text-[#333333]">{title}</h3>
          <button 
            onClick={onClose}
            className="text-[#898989] hover:text-[#B88E2F] transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {children}
        </div>

        {/* Modal Footer */}
        {showFooter && (
          <div className="flex justify-end gap-3 p-6 pt-4 border-t border-[#E5E7EB]">
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={loading}
              className="py-2 px-4 rounded-xl text-[14px]"
            >
              Cancel
            </Button>
            {onConfirm && (
              <Button 
                variant={isDanger ? "danger" : "primary"}
                onClick={onConfirm}
                disabled={loading}
                className={`py-2 px-4 rounded-xl text-[14px] ${isDanger ? 'bg-[#E24B4A] hover:bg-[#A32D2D]' : ''}`}
              >
                {loading ? "Saving..." : confirmText}
              </Button>
            )}
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
