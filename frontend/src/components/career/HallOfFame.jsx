import { useNavigate, useParams } from 'react-router-dom';
import { Target, TrendingUp, Activity, ChevronRight } from 'lucide-react';

export function HallOfFame({ ranking }) {
  const navigate = useNavigate();
  const { id } = useParams();

  // Geramos as três listas a partir do ranking completo recebido
  const topArtilheiros = [...ranking].sort((a, b) => b.total_gols - a.total_gols).slice(0, 5);
  const topGarcons = [...ranking].sort((a, b) => b.total_assistencias - a.total_assistencias).slice(0, 5);
  const topVeteranos = [...ranking].sort((a, b) => b.total_jogos - a.total_jogos).slice(0, 5);

  return (
    <div className="w-80 space-y-4"> 
      
      {/* BLOCO 1: ARTILHEIROS (Verde) */}
      <div className="bg-[#0d1a0d] border border-[#11d411]/20 rounded-xl overflow-hidden shadow-lg">
        <div className="p-3 border-b border-[#11d411]/20 bg-[#11d411]/5 flex items-center gap-2">
          <Target className="w-4 h-4 text-[#11d411]" />
          <h2 className="font-black uppercase italic text-[10px] tracking-tighter">Maiores Artilheiros</h2>
        </div>
        <div className="p-2 space-y-1">
          {topArtilheiros.map((player, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg transition-all group">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="text-[10px] font-black text-white/20 italic">#{idx + 1}</span>
                <p className="text-[11px] font-bold uppercase text-white group-hover:text-[#11d411] transition-colors truncate">
                  {player.nome_completo}
                </p>
              </div>
              <span className="text-[11px] font-black text-[#11d411] italic shrink-0">{player.total_gols} G</span>
            </div>
          ))}
        </div>
      </div>

      {/* BLOCO 2: GARÇONS (Azul) */}
      <div className="bg-[#0d1a0d] border border-blue-500/20 rounded-xl overflow-hidden shadow-lg shadow-blue-500/5">
        <div className="p-3 border-b border-blue-500/20 bg-blue-500/5 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-400" />
          <h2 className="font-black uppercase italic text-[10px] tracking-tighter">Líderes de Assistências</h2>
        </div>
        <div className="p-2 space-y-1">
          {topGarcons.map((player, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg transition-all group">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="text-[10px] font-black text-white/20 italic">#{idx + 1}</span>
                <p className="text-[11px] font-bold uppercase text-white group-hover:text-blue-400 transition-colors truncate">
                  {player.nome_completo}
                </p>
              </div>
              <span className="text-[11px] font-black text-blue-400 italic shrink-0">{player.total_assistencias} A</span>
            </div>
          ))}
        </div>
      </div>

      {/* BLOCO 3: MAIS PARTIDAS (Roxo) */}
      <div className="bg-[#0d1a0d] border border-purple-500/20 rounded-xl overflow-hidden shadow-lg shadow-purple-500/5">
        <div className="p-3 border-b border-purple-500/20 bg-purple-500/5 flex items-center gap-2">
          <Activity className="w-4 h-4 text-purple-400" />
          <h2 className="font-black uppercase italic text-[10px] tracking-tighter">Mais Partidas</h2>
        </div>
        <div className="p-2 space-y-1">
          {topVeteranos.map((player, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg transition-all group">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="text-[10px] font-black text-white/20 italic">#{idx + 1}</span>
                <p className="text-[11px] font-bold uppercase text-white group-hover:text-purple-400 transition-colors truncate">
                  {player.nome_completo}
                </p>
              </div>
              <span className="text-[11px] font-black text-purple-400 italic shrink-0">{player.total_jogos} J</span>
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={() => navigate(`/carreira/${id}/hall-of-fame`)}
        className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 border border-white/5"
      >
        Galeria Completa <ChevronRight className="w-3 h-3" />
      </button>
    </div>
  );
}