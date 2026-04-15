import React from 'react';

export const StatusBadge = ({ status }) => {
  const normalizedStatus = status?.toLowerCase();

  const statusStyles = {
    delivered: "bg-[#E1F5EE] text-[#0F6E56]",
    processing: "bg-[#E6F1FB] text-[#185FA5]",
    pending: "bg-[#FAEEDA] text-[#854F0B]",
    cancelled: "bg-[#FCEBEB] text-[#A32D2D]",
    active: "bg-[#E1F5EE] text-[#0F6E56]" // Also used for Active products
  };

  const currentStyle = statusStyles[normalizedStatus] || "bg-gray-100 text-gray-800";

  return (
    <span className={`${currentStyle} px-2 py-[2px] rounded-full text-[10px] font-medium tracking-wide`}>
      {status}
    </span>
  );
};
