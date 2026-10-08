import React from 'react';
import { Trophy, Target, TrendingUp, Calendar, Edit3 } from 'lucide-react';

export function OverviewTab({ data, onEditLeague }) {
  // Verificação de segurança: se data ou stats não existirem, usamos valores 0
  const stats = data?.stats || { games: 0, wins: 0, draws: 0, losses: 0 };
  const nextMatch = data?.nextMatch || { opponent: 'A definir', date: '--/--', competition: '---' };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Card de Estatísticas da Temporada */}
      <div className="bg-[#0d1a0d] p-6 rounded-xl border border-[#11d411]/20">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-5 h-5 text-[#11d411]" />
          <h3 className="font-bold text-lg">Desempenho na Liga</h3>
        </div>

        <button 
            type="button"
            onClick={onEditLeague}
            className="p-2 hover:bg-[#11d411]/20 rounded-lg transition-all text-[#11d411] cursor-pointer"
          >
            <Edit3 className="w-5 h-5" />
          </button>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white/5 rounded-lg">
            <p className="text-white/50 text-sm">Jogos</p>
            <p className="text-2xl font-bold">{stats.games}</p>
          </div>
          <div className="p-4 bg-[#11d411]/10 rounded-lg border border-[#11d411]/20">
            <p className="text-[#11d411] text-sm">Vitórias</p>
            <p className="text-2xl font-bold text-[#11d411]">{stats.wins}</p>
          </div>
          <div className="p-4 bg-white/5 rounded-lg">
            <p className="text-white/50 text-sm">Empates</p>
            <p className="text-2xl font-bold">{stats.draws}</p>
          </div>
          <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
            <p className="text-red-500 text-sm">Derrotas</p>
            <p className="text-2xl font-bold text-red-500">{stats.losses}</p>
          </div>
        </div>
      </div>

      {/* Card de Próximo Jogo */}
      <div className="bg-[#0d1a0d] p-6 rounded-xl border border-[#11d411]/20">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-5 h-5 text-[#11d411]" />
          <h3 className="font-bold text-lg">Próximo Compromisso</h3>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
            <div>
              <p className="text-white/50 text-sm">{nextMatch.competition}</p>
              <p className="text-xl font-bold">{nextMatch.opponent}</p>
            </div>
            <div className="text-right">
              <p className="text-[#11d411] font-mono">{nextMatch.date}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}