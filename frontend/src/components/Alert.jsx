import React from 'react';
import Btn from './Button'; 

export function NeoConfirmAlert({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      
      <div className="bg-[#FAFAF8] border-4 border-[#0D0C0C] shadow-[8px_8px_0_0_#0D0C0C] max-w-sm w-full rounded-none overflow-hidden transform transition-all scale-100">
        
        <div className="bg-[#FFE04B] border-b-4 border-[#0D0C0C] p-3 flex items-center gap-2">
          <h3 className="font-sg font-black text-[16px] uppercase tracking-tight text-[#0D0C0C]">
            {title || "Confirmation Required"}
          </h3>
        </div>

        <div className="p-5 bg-white">
          <p className="font-dm text-[14px] leading-relaxed text-[#0D0C0C] font-medium">
            {message || "Are you absolutely sure you want to proceed with this action?"}
          </p>
        </div>

        <div className="p-4 bg-[#FAFAF8] border-t-2 border-[#0D0C0C] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[13px] font-dm font-bold text-[#0D0C0C] border-2 border-[#0D0C0C] bg-white hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          
          <Btn
            v="ink"
            sz="sm"
            onClick={onConfirm}
            className="!bg-red-500 !text-white" 
          >
            Yes, Do It!
          </Btn>
        </div>

      </div>
    </div>
  );
}