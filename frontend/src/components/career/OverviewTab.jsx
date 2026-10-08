import React from 'react';
import { actionBtn, Icon, Panel } from './ui';

export function OverviewTab({ data, onEditLeague }) {
  const stats = data?.stats || { games: 0, wins: 0, draws: 0, losses: 0, points: 0 };
  const squad = data?.squad || [];
  // Dados digitados à mão podem não fechar; a barra nunca passa de 100%.
  const aproveitamento = stats.games ? Math.min(100, Math.round((stats.points / (stats.games * 3)) * 100)) : 0;
  const position = data?.currentPosition && data.currentPosition !== '--' ? `${data.currentPosition}º` : '—';

  const results = [
    { label: 'Jogos', value: stats.games },
    { label: 'Vitórias', value: stats.wins, className: 'text-neon' },
    { label: 'Empates', value: stats.draws },
    { label: 'Derrotas', value: stats.losses, className: 'text-red-300' },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Panel
        title="Classificação"
        action={
          <button type="button" onClick={onEditLeague} className={actionBtn}>
            <Icon name="edit" className="text-lg" />
            Atualizar
          </button>
        }
      >
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-kit text-7xl font-bold leading-none">{position}</p>
            <p className="mt-1 text-sm text-muted">{data?.leagueName || 'Liga'}</p>
          </div>
          <div className="text-right">
            <p className="font-kit text-5xl font-bold leading-none text-neon">{stats.points}</p>
            <p className="mt-1 text-sm text-muted">pontos</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-between text-[11px] uppercase tracking-wider text-muted">
            <span>Aproveitamento</span>
            <span>{aproveitamento}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-pitch-800">
            <div className="h-full rounded-full bg-neon" style={{ width: `${aproveitamento}%` }} />
          </div>
        </div>
      </Panel>

      <Panel title="Campanha">
        <dl className="grid grid-cols-4 gap-2 text-center">
          {results.map((r) => (
            <div key={r.label} className="rounded-lg bg-pitch-950/60 py-3">
              <dd className={`font-kit text-4xl font-bold ${r.className || ''}`}>{r.value}</dd>
              <dt className="text-[11px] uppercase tracking-wider text-muted">{r.label}</dt>
            </div>
          ))}
        </dl>

        <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-pitch-700/70 pt-5">
          <div>
            <dt className="text-[11px] uppercase tracking-wider text-muted">Gols do elenco</dt>
            <dd className="font-kit text-3xl font-bold">{squad.reduce((s, p) => s + (p.gols || 0), 0)}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-wider text-muted">Assistências</dt>
            <dd className="font-kit text-3xl font-bold">{squad.reduce((s, p) => s + (p.assistencias || 0), 0)}</dd>
          </div>
        </dl>
      </Panel>
    </div>
  );
}
