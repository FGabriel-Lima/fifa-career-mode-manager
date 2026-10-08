import React from 'react';

export function SeasonSelector({ seasons = [], selectedSeason, onSeasonChange }) {
  return (
    <div className="flex items-center gap-3 overflow-x-auto" role="group" aria-label="Temporadas">
      <span className="shrink-0 text-[11px] uppercase tracking-wider text-muted">Temporada</span>
      {seasons.map((season) => {
        const active = selectedSeason?.id === season.id;
        return (
          <button
            key={season.id}
            onClick={() => onSeasonChange(season)}
            aria-pressed={active}
            className={`h-9 shrink-0 rounded-lg px-4 font-kit text-lg font-bold transition ${
              active ? 'bg-neon text-pitch-950' : 'bg-pitch-800 text-muted hover:bg-pitch-700 hover:text-chalk'
            }`}
          >
            {season.nome}
          </button>
        );
      })}
    </div>
  );
}
