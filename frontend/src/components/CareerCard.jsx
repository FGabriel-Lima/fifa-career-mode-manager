import React from 'react';
import Crest, { kitFor } from './Crest';
import { money } from '../format';

function CareerCard({ carreira, onOpen }) {
  const temporada = carreira.temporadas?.[0];
  const clube = temporada?.clube_nome || 'Sem clube';
  const [primary, secondary] = kitFor(clube);

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-pitch-700/70 bg-pitch-900 transition hover:-translate-y-1 hover:border-neon/50 hover:shadow-[0_18px_40px_-18px_rgba(17,212,17,0.35)]">
      {/* Listras de camisa nas cores do clube */}
      <div
        className="relative h-24"
        style={{
          background: `repeating-linear-gradient(90deg, ${primary} 0 22px, ${secondary} 22px 30px)`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-pitch-900" />
        <Crest name={clube} className="absolute -bottom-7 left-5 h-16 w-14 drop-shadow-[0_6px_10px_rgba(0,0,0,0.5)]" />
      </div>

      <div className="flex flex-1 flex-col gap-4 px-5 pb-5 pt-10">
        <div>
          <p className="font-kit text-2xl font-bold uppercase leading-none tracking-wide text-chalk">{clube}</p>
          <p className="mt-1.5 truncate text-sm text-muted">{carreira.nome_carreira}</p>
        </div>

        <dl className="grid grid-cols-2 gap-3 rounded-lg bg-pitch-950/60 p-3">
          <div>
            <dt className="text-[11px] uppercase tracking-wider text-muted">Temporada</dt>
            <dd className="font-kit text-xl font-bold text-chalk">{temporada?.nome || '—'}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-wider text-muted">Orçamento</dt>
            <dd className="font-kit text-xl font-bold text-gold">{money(temporada?.orcamento_transferencia)}</dd>
          </div>
        </dl>

        <button
          onClick={() => onOpen(carreira.id)}
          className="mt-auto flex h-10 items-center justify-center gap-2 rounded-lg border border-neon/40 text-sm font-bold text-neon transition hover:bg-neon hover:text-pitch-950"
        >
          Carregar save
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </button>
      </div>
    </article>
  );
}

export default CareerCard;
