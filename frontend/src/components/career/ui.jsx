import React, { useEffect } from 'react';
import { apiError } from '../../services/api';
import { btnPrimary } from '../AuthLayout';

export function Icon({ name, className = '' }) {
  return (
    <span className={`material-symbols-outlined ${className}`} aria-hidden="true">
      {name}
    </span>
  );
}

// Botão secundário usado nos cabeçalhos dos painéis ("Adicionar jogador", "Atualizar"...).
export const actionBtn =
  'flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-neon/40 px-3 text-sm font-semibold text-neon transition hover:bg-neon hover:text-pitch-950';

export const selectClass =
  'h-12 w-full rounded-lg border border-pitch-700 bg-pitch-950 px-4 text-chalk transition focus:border-neon focus:outline-none focus:ring-2 focus:ring-neon/30';

export function Panel({ title, action, children, className = '' }) {
  return (
    <section className={`rounded-xl border border-pitch-700/70 bg-pitch-900 ${className}`}>
      <header className="flex items-center justify-between gap-3 border-b border-pitch-700/70 px-5 py-4">
        <h2 className="font-kit text-xl font-bold uppercase tracking-wide">{title}</h2>
        {action}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function Empty({ children }) {
  return (
    <p className="rounded-lg border border-dashed border-pitch-700 px-4 py-8 text-center text-sm text-muted">
      {children}
    </p>
  );
}

// Casca única dos modais: fecha com Esc, clique fora ou no X.
export function Modal({ isOpen, onClose, title, subtitle, icon, onSubmit, wide = false, children }) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onSubmit={onSubmit}
        onClick={(e) => e.stopPropagation()}
        className={`m-auto w-full ${wide ? 'max-w-xl' : 'max-w-md'} rounded-2xl border border-pitch-700 bg-pitch-900 p-6 font-display text-chalk shadow-2xl sm:p-8`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {icon}
            <div>
              <h2 className="font-kit text-3xl font-bold uppercase leading-none">{title}</h2>
              {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-muted transition hover:bg-pitch-800 hover:text-chalk"
          >
            <Icon name="close" />
          </button>
        </div>
        <div className="mt-7">{children}</div>
      </form>
    </div>
  );
}

export function ModalActions({ submitLabel, busy, onCancel }) {
  return (
    <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <button
        type="button"
        onClick={onCancel}
        className="h-12 rounded-lg px-6 font-semibold text-muted transition hover:bg-pitch-800 hover:text-chalk"
      >
        Cancelar
      </button>
      <button type="submit" disabled={busy} className={`${btnPrimary} sm:w-auto`}>
        {busy ? 'Salvando…' : submitLabel}
      </button>
    </div>
  );
}

// Envia o formulário cuidando de "salvando…" e da mensagem de erro.
export function useSubmit(action, fallbackError) {
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState('');
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await action();
    } catch (err) {
      setError(apiError(err, fallbackError));
    } finally {
      setBusy(false);
    }
  };
  return { busy, error, setError, submit };
}
