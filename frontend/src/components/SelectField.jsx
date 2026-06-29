import React from "react";
import { MdArrowDropDown } from "react-icons/md";

export function SelectField({ label, id, opts, value, onChange, className }) {
  const defaultSelectStyle = 
    "w-full py-3 px-3.5 pr-9 border-2 border-black shadow-[3px_3px_0_0_#000] font-dm text-[14px] bg-white cursor-pointer outline-none appearance-none focus transition-colors duration-150";

  return (
    <div className="w-full">
      {label && (
        <label 
          className="block font-dm text-[14px] font-bold text-black mb-1.5" 
          htmlFor={id}
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        <select 
          id={id} 
          name={id} 
          value={value} 
          onChange={onChange} 
          className={className || defaultSelectStyle}
        >
          {opts.map((o) => (
            <option key={o.v} value={o.v} disabled={o.d}>
              {o.l}
            </option>
          ))}
        </select>
        
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[12px] text-black font-extrabold select-none">
          <MdArrowDropDown />
        </span>
      </div>
    </div>
  );
}