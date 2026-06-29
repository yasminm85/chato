import React from 'react';
import { FiTool, FiRefreshCw } from 'react-icons/fi';

export default function MaintenancePage() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen w-full bg-[#FAFAF8] flex flex-col items-center justify-center p-4 selection:bg-[#FFE04B]">
      
      <div className="bg-white border-4 border-[#0D0C0C] shadow-[8px_8px_0_0_#0D0C0C] max-w-md w-full rounded-none overflow-hidden">
        
        <div className="bg-[#FFE04B] border-b-4 border-[#0D0C0C] p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h1 className="font-sg font-black text-[14px] uppercase tracking-wider text-[#0D0C0C]">
              System Under Maintenance
            </h1>
          </div>
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full border-2 border-[#0D0C0C] bg-[#FF5F56]" />
            <span className="w-3 h-3 rounded-full border-2 border-[#0D0C0C] bg-[#FFBD2E]" />
            <span className="w-3 h-3 rounded-full border-2 border-[#0D0C0C] bg-[#27C93F]" />
          </div>
        </div>

        <div className="p-8 flex flex-col items-center text-center gap-6">
          
          <div className="bg-[#D6DCFF] border-3 border-[#0D0C0C] shadow-[4px_4px_0_0_#0D0C0C] p-5 rounded-none text-[#0D0C0C]">
            <FiTool size={44} className="stroke-[2.5]" />
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="font-sg font-black text-[24px] leading-tight text-[#0D0C0C] uppercase tracking-tight">
              Oops our server is maintenance!
            </h2>
          </div>

          <button
            onClick={handleRefresh}
            className="mt-2 border-3 border-[#0D0C0C] bg-[#1933CC] text-white px-5 py-3 font-black font-sg text-[14px] tracking-wide uppercase cursor-pointer shadow-[4px_4px_0_0_#0D0C0C] transition-all hover:bg-[#122599] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none flex items-center gap-2 outline-none"
          >
            <FiRefreshCw className="animate-spin [animation-duration:3s]" /> 
            Refresh this web
          </button>

        </div>

      </div>
    </div>
  );
}