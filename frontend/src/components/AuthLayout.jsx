import React, { useState } from 'react';

// Campo de futebol visto de cima, em linhas de giz, com uma formação 4-3-3 em neon.
function Pitch() {
  const players = [
    [50, 127], // goleiro
    [18, 108], [39, 112], [61, 112], [82, 108], // defesa
    [30, 88], [50, 92], [70, 88], // meio
    [22, 62], [50, 56], [78, 62], // ataque
  ];
  return (
    <svg viewBox="0 0 100 140" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <g fill="none" stroke="#eef5ee" strokeOpacity="0.14" strokeWidth="0.5">
        <rect x="5" y="5" width="90" height="130" rx="1" />
        <line x1="5" y1="70" x2="95" y2="70" />
        <circle cx="50" cy="70" r="12" />
        <rect x="25" y="5" width="50" height="20" />
        <rect x="38" y="5" width="24" height="8" />
        <rect x="25" y="115" width="50" height="20" />
        <rect x="38" y="127" width="24" height="8" />
        <path d="M40 25 A 12 12 0 0 0 60 25" />
        <path d="M40 115 A 12 12 0 0 1 60 115" />
      </g>
      {players.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="2.2" fill="#11d411" />
      ))}
    </svg>
  );
}

export function Logo({ className = '' }) {
  return (
    <span className={`flex items-center gap-2.5 font-kit text-xl font-bold uppercase tracking-wide text-chalk ${className}`}>
      <svg viewBox="0 0 48 48" className="h-6 w-6 text-neon" fill="currentColor" aria-hidden="true">
        <path d="M13.8261 30.5736C16.7203 29.8826 20.2244 29.4783 24 29.4783C27.7756 29.4783 31.2797 29.8826 34.1739 30.5736C36.9144 31.2278 39.9967 32.7669 41.3563 33.8352L24.8486 7.36089C24.4571 6.73303 23.5429 6.73303 23.1514 7.36089L6.64374 33.8352C8.00331 32.7669 11.0856 31.2278 13.8261 30.5736Z" />
      </svg>
      FIFA Manager
    </span>
  );
}

export const inputClass =
  'h-12 w-full rounded-lg border border-pitch-700 bg-pitch-950 px-4 text-chalk placeholder:text-muted/50 transition focus:border-neon focus:outline-none focus:ring-2 focus:ring-neon/30';

export const btnPrimary =
  'flex h-12 w-full items-center justify-center rounded-lg bg-neon px-5 font-bold text-pitch-950 transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-neon focus-visible:ring-offset-2 focus-visible:ring-offset-pitch-900 disabled:opacity-50';

export function Field({ label, id, ...props }) {
  return (
    <label className="flex flex-col gap-2" htmlFor={id}>
      <span className="text-sm font-medium text-muted">{label}</span>
      <input id={id} className={inputClass} {...props} />
    </label>
  );
}

export function PasswordField({ label, id, ...props }) {
  const [show, setShow] = useState(false);
  return (
    <label className="flex flex-col gap-2" htmlFor={id}>
      <span className="text-sm font-medium text-muted">{label}</span>
      <span className="relative">
        <input id={id} type={show ? 'text' : 'password'} className={`${inputClass} pr-12`} {...props} />
        <button
          type="button"
          onClick={() => setShow(!show)}
          aria-label={show ? 'Esconder senha' : 'Mostrar senha'}
          className="absolute inset-y-0 right-0 flex items-center px-4 text-muted transition hover:text-neon"
        >
          <span className="material-symbols-outlined text-xl">{show ? 'visibility_off' : 'visibility'}</span>
        </button>
      </span>
    </label>
  );
}

export function FormError({ children }) {
  if (!children) return null;
  return (
    <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
      {children}
    </p>
  );
}

// Layout das telas de login e cadastro: campo à esquerda, formulário à direita.
function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen bg-pitch-950 font-display text-chalk">
      <aside className="relative hidden flex-1 flex-col justify-between overflow-hidden bg-pitch-900 p-12 lg:flex">
        <Logo />
        <div className="pointer-events-none absolute inset-y-12 right-[5%] w-[44%]">
          <Pitch />
        </div>
        <div className="relative max-w-sm">
          <p className="font-kit text-6xl font-bold uppercase leading-[0.9] tracking-tight">
            Estratégia e paixão <span className="text-neon">em campo.</span>
          </p>
          <p className="mt-5 text-muted">
            Elenco, transferências, observação e títulos de cada temporada do seu modo carreira, num lugar só.
          </p>
        </div>
      </aside>

      <main className="flex flex-1 items-center justify-center p-6 sm:p-12 lg:max-w-xl">
        <div className="w-full max-w-sm">
          <Logo className="mb-10 lg:hidden" />
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="mt-2 text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </main>
    </div>
  );
}

export default AuthLayout;
