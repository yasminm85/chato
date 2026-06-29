import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function Navbar() {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-[100] bg-[#FDF2E9] border-b-4 border-black">
      <div className="max-w-[1200px] mx-auto px-10 flex items-center justify-between h-[80px]">
        <div 
          onClick={() => navigate('/')} 
          className="font-sg text-[32px] font-extrabold text-black cursor-pointer"
        >
          Chato
        </div>
        
        <nav className="hidden md:flex items-center gap-10 font-sg font-bold text-[18px] text-black">
          <a href="#about" className="hover:underline">About</a>
          <a href="#how" className="hover:underline">How</a>
          <a href="#features" className="hover:underline">Features</a>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-black border-t-4 border-black py-10 px-10">
      <div className="max-w-[1200px] mx-auto flex justify-between items-center flex-wrap gap-4">
        <span className="font-sg text-[20px] font-extrabold text-[#FDF2E9]">
          Chato
        </span>
        <span className="font-dm text-[12px] text-[#FDF2E9]">
          © 2026 Chato{' '}
          <a 
            href="https://linkedin.com/in/nuryasminmb/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:underline text-[#FDF2E9]"
          >
            Yasmin
          </a>
        </span>
        {/* Navigasi Footer (Sudah dikonversi ke Tailwind, tinggal diuncomment kalau mau dipakai) */}
        {/* <nav className="flex gap-6">
          {['Privacy Policy', 'Terms of Service', 'Contact Support'].map(
            (t) => (
              <a
                key={t}
                href="#"
                className="font-dm text-[12px] text-gray-500 hover:text-[#FFE04B] transition-colors duration-150"
              >
                {t}
              </a>
            ),
          )}
        </nav> */}
      </div>
    </footer>
  );
}

export function AuthHeader({ altText, altAction, altLabel }) {
  const navigate = useNavigate();
  return (
    <header className="bg-white border-b-4 border-black px-10">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between h-[54px]">
        <Link
          to="/"
          className="font-sg text-[18px] font-extrabold tracking-tight no-underline text-black"
        >
          Chato
        </Link>
        <div className="font-dm text-[13px] text-[#555]">
          {altText}{' '}
          <button
            onClick={() => navigate(altAction)}
            className="text-[#1933CC] font-bold bg-transparent border-none cursor-pointer underline font-mono text-[13px] hover:text-black transition-colors duration-150"
          >
            {altLabel}
          </button>
        </div>
      </div>
    </header>
  );
}

export function AuthFooter() {
  return (
    <footer className="bg-white border-t-4 border-black py-5 px-10">
      <div className="max-w-[1200px] mx-auto flex justify-between items-center flex-wrap gap-3">
        <span className="font-sg text-[16px] font-bold text-black">
          Chato
        </span>
        <span className="font-dm text-[12px] text-gray-400">
          © 2026 Chato{' '}
          <a 
            href="https://linkedin.com/in/nuryasminmb/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:underline text-gray-500"
          >
            Yasmin
          </a>
        </span>
      </div>
    </footer>
  );
}