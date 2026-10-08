import React from 'react';
import { Calendar } from 'lucide-react';

export function SeasonSelector({ seasons, selectedSeason, onSeasonChange }) {

  return (
    <div className="bg-[#0d1a0d] border-b border-[#11d411]/20 px-6 py-4">
      <div className="flex items-center gap-4">
        <Calendar className="w-5 h-5 text-[#11d411]" />
        <div className="flex gap-2">
          {seasons && seasons.map((season) => (
            <button
              key={season.id}
              onClick={() => onSeasonChange(season)}
              className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 ${
                selectedSeason?.id === season.id
                  ? 'bg-[#11d411] text-[#102210] shadow-lg shadow-[#11d411]/50'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              Temporada {season.nome}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
