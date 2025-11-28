import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('usuario') || '{}');
  const userName = user.email ? user.email.split('@')[0] : 'Treinador';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/');
  }

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-white/10 bg-[#102210] px-4 sm:px-10 py-3">
      <div className="flex items-center gap-4 text-white">
        <div className="size-6 text-[#11d411]">
          <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.8261 30.5736C16.7203 29.8826 20.2244 29.4783 24 29.4783C27.7756 29.4783 31.2797 29.8826 34.1739 30.5736C36.9144 31.2278 39.9967 32.7669 41.3563 33.8352L24.8486 7.36089C24.4571 6.73303 23.5429 6.73303 23.1514 7.36089L6.64374 33.8352C8.00331 32.7669 11.0856 31.2278 13.8261 30.5736Z" fill="currentColor"></path>
          </svg>
        </div>
        <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">FIFA Manager</h2>
      </div>
      
      <div className="flex gap-2">
        <div className="flex items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#1A2B1A] text-white text-sm font-bold">
          <span className="truncate">Olá, {userName}</span>
        </div>
        <button 
          onClick={handleLogout}
          aria-label="Sair" 
          className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-[#1A2B1A] text-white gap-2 text-sm font-bold px-2.5 hover:bg-[#234823] transition-colors"
        >
          <span className="material-symbols-outlined" style={{fontSize: '20px'}}>logout</span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;