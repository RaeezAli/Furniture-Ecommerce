import React from 'react';

export const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "text-[16px] transition-all flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-[#B88E2F] hover:bg-[#A47E2A] text-white font-bold rounded-xl hover:scale-105 active:scale-95",
    outline: "border border-[#B88E2F] text-[#B88E2F] hover:bg-[#B88E2F] hover:text-white font-semibold rounded-xl",
    icon: "bg-transparent text-inherit hover:text-[#B88E2F] p-[8px]"
  };

  const selectedVariantStyles = variants[variant] || variants.primary;
  const disabledStyles = "opacity-60 cursor-not-allowed pointer-events-none";

  return (
    <button 
      className={`${baseStyles} ${selectedVariantStyles} ${props.disabled ? disabledStyles : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};