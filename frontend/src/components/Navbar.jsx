import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from './AuthLayout';

function Navbar() {
  const navigate = useNavigate();

  let user = {};
  try {
    user = JSON.parse(localStorage.getItem('usuario') || '{}');
  } catch {}
  const userName = user.email ? user.email.split('@')[0] : 'técnico';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/');
  };

  return (
    <header className="border-b border-pitch-700/60 bg-pitch-950/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-8">
        <Logo />
        <div className="flex items-center gap-2">
          <span className="hidden rounded-lg bg-pitch-800 px-3 py-2 text-sm text-muted sm:block">
            Olá, <span className="font-semibold text-chalk">{userName}</span>
          </span>
          <button
            onClick={handleLogout}
            aria-label="Sair da conta"
            title="Sair"
            className="grid h-10 w-10 place-items-center rounded-lg bg-pitch-800 text-muted transition hover:bg-pitch-700 hover:text-chalk"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
