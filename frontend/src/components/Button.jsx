import React from "react"

export const C = {
  paper:"#FAFAF8", ink:"#0D0C0C", blue:"#1933CC", bluePale:"#D6DCFF",
  yellow:"#FFE04B", yellowDim:"#FFF9D4", gray:"#E8E4DC", grayMid:"#B8B2AA",
  green:"#90EE90", white:"#FFFFFF"
};

export default function Btn({ 
  children, 
  v = "green", 
  sz = "md", 
  onClick, 
  full, 
  className = "", 
  ...props 
}) {
  
  const variants = {
    blue: "bg-[#1933CC] text-white",
    ghost: "bg-white text-black",
    yellow: "bg-[#FFE04B] text-black",
    green: "bg-[#00C27C] text-black",
    ink: "bg-[#0D0C0C] text-white"
  };

  const sizes = {
    sm: "py-2 px-4 text-[14px]",
    md: "py-3 px-8 text-[16px]",
    lg: "py-4 px-10 text-[18px]"
  };

  const baseStyle = 
    "font-sg font-bold rounded border-2 border-black flex items-center justify-center gap-2 select-none cursor-pointer outline-none transition-all duration-100 shadow-[4px_4px_0_0_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0_0_#000] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none disabled:opacity-50 disabled:pointer-events-none";

  const widthStyle = full ? "w-full" : "w-auto";

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${variants[v]} ${sizes[sz]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
