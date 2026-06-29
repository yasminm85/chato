import React, { useState } from 'react';
import { FiEye, FiEyeOff } from "react-icons/fi";

export function Field({
  label,
  type = 'text',
  id,
  placeholder,
  icon,
  value,
  onChange,
  required,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className="flex flex-col w-full">
      {label && (
        <label
          className="block font-dm text-[14px] font-bold text-black mb-1.5"
          htmlFor={id}
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center w-full">
        
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[16px] opacity-45 pointer-events-none text-black">
            {icon}
          </span>
        )}

        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full py-3 px-3.5 border-2 border-black shadow-[3px_3px_0_0_#000] font-dm text-[14px] bg-white text-black outline-none focus:bg-[#DAF5F0] transition-colors duration-150
            ${icon ? 'pl-10' : ''} 
            ${type === 'password' ? 'pr-11' : ''}
          `}
        />

        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer flex items-center justify-center p-0 text-[18px] text-black transition-transform duration-100 hover:scale-110 outline-none"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        )}
      </div>
    </div>
  );
}