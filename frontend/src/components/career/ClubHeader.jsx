import React from 'react';
import Crest, { clubColors } from '../Crest';
import { money } from '../../format';
import { Icon } from './ui';

export function ClubHeader({ careerName, data, onEditColors }) {
  const club = data?.clube_nome || 'Clube';
  const colors = clubColors(data);
  const [primary, secondary] = colors;
  const position = data?.currentPosition;

  const stats = [
    { label: 'Posição', value: position && position !== '--' ? `${position}º` : '—' },
    { label: 'Pontos', value: data?.stats?.points ?? 0 },
    { label: 'Orçamento', value: money(data?.orcamento_transferencia), className: 'text-gold' },
  ];

  return (
    <section className="overflow-hidden rounded-2xl border border-pitch-700/70 bg-pitch-900">
      {/* Listras da camisa do clube, como no card do painel */}
      <div
        className="relative h-28 sm:h-36"
        style={{ background: `repeating-linear-gradient(90deg, ${primary} 0 34px, ${secondary} 34px 46px)` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-pitch-900/10 via-pitch-900/90 to-pitch-900" />
        <button
          type="button"
          onClick={onEditColors}
          className="absolute right-3 top-3 flex items-center gap-1.5 rounded-lg bg-pitch-950/80 px-3 py-1.5 text-sm font-semibold text-chalk backdrop-blur transition hover:bg-pitch-950"
        >
          <Icon name="palette" className="text-lg" />
          Cores
        </button>
      </div>

      <div className="relative -mt-14 flex flex-col gap-4 px-5 pb-6 sm:flex-row sm:items-end sm:gap-6 sm:px-8">
        <Crest name={club} colors={colors} className="h-28 w-24 shrink-0 drop-shadow-[0_8px_14px_rgba(0,0,0,0.55)]" />
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-widest text-neon">{data?.leagueName || 'Liga'}</p>
          <h1 className="font-kit text-5xl font-bold uppercase leading-none tracking-tight sm:text-6xl">{club}</h1>
          <p className="mt-2 truncate text-muted">
            {careerName} · Temporada {data?.nome}
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-3 divide-x divide-pitch-700/70 border-t border-pitch-700/70">
        {stats.map((s) => (
          <div key={s.label} className="px-5 py-4 sm:px-8">
            <dt className="text-[11px] uppercase tracking-wider text-muted">{s.label}</dt>
            <dd className={`font-kit text-2xl font-bold sm:text-3xl ${s.className || ''}`}>{s.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
