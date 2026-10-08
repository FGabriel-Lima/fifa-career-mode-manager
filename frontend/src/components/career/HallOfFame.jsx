import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon, Panel } from './ui';

// Os três rankings da carreira, usados na barra lateral e na Galeria de Lendas.
export const BOARDS = [
  { field: 'total_gols', title: 'Artilheiros', unit: 'gols', short: 'Gols' },
  { field: 'total_assistencias', title: 'Garçons', unit: 'assistências', short: 'Assistências' },
  { field: 'total_jogos', title: 'Mais partidas', unit: 'jogos', short: 'Jogos' },
];

export const rankBy = (ranking, field, size) =>
  [...ranking].filter((p) => p[field] > 0).sort((a, b) => b[field] - a[field]).slice(0, size);

export function HallOfFame({ ranking }) {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <Panel title="Lendas do clube">
      {ranking.length === 0 ? (
        <p className="text-sm text-muted">Os líderes aparecem aqui quando o elenco tiver partidas registradas.</p>
      ) : (
        <div className="space-y-6">
          {BOARDS.map(({ field, short }) => (
            <div key={field}>
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted">{short}</h3>
              <ol className="mt-2 space-y-1">
                {rankBy(ranking, field, 3).map((p, idx) => (
                  <li key={p.id} className="flex items-baseline gap-3">
                    <span className="w-4 font-kit text-lg font-bold text-muted">{idx + 1}</span>
                    <span className="flex-1 truncate text-sm">{p.nome_completo}</span>
                    <span className="font-kit text-xl font-bold text-neon">{p[field]}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => navigate(`/carreira/${id}/hall-of-fame`)}
        className="mt-6 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-pitch-800 text-sm font-semibold text-chalk transition hover:bg-pitch-700"
      >
        Abrir galeria completa
        <Icon name="arrow_forward" className="text-lg" />
      </button>
    </Panel>
  );
}
