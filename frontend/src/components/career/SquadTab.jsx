import React, { useMemo } from 'react';
import { Edit2, Trash2, User } from 'lucide-react';

export function SquadTab({ data, onAddPlayer, onEditPlayer, onRemovePlayer }) {
  
  // 1. Defina a ordem lógica das posições em Português
  const ordemPosicoes = {
    'GOL': 1,
    'LD': 2,  'ADD': 2, // Ala Direito Defensivo
    'ZAG': 3,
    'LE': 4,  'ADE': 4, // Ala Esquerdo Defensivo
    'VOL': 5,
    'MC': 6,
    'MD': 7,
    'ME': 8,
    'MEI': 9,
    'PD': 10,
    'PE': 11,
    'SA': 12,
    'ATA': 13
  };

  // 2. Crie uma lista ordenada usando useMemo (para performance)
  const elencoOrdenado = useMemo(() => {
    const lista = data?.squad || [];
    
    return [...lista].sort((a, b) => {
      // Normaliza para maiúsculo e remove espaços para garantir que encontre no mapa
      const posA = a.position ? a.position.toUpperCase().trim() : '';
      const posB = b.position ? b.position.toUpperCase().trim() : '';

      // Pega o valor da ordem (se não achar, joga pro final com valor 99)
      const valorA = ordemPosicoes[posA] || 99;
      const valorB = ordemPosicoes[posB] || 99;

      // Se as posições forem diferentes, ordena pela posição
      if (valorA !== valorB) {
        return valorA - valorB;
      }

      // Se for a mesma posição, ordena pelo OVR (Overall) do maior para o menor
      return b.overall - a.overall;
    });
  }, [data?.squad]);


  return (
    <div className="bg-[#0d1a0d] rounded-xl border border-[#11d411]/20 overflow-hidden">
      {/* ... Cabeçalho da Tabela (Mantenha igual) ... */}
      <div className="grid grid-cols-12 gap-4 p-4 border-b border-[#11d411]/20 bg-[#11d411]/10 text-xs font-bold uppercase text-[#11d411] tracking-wider">
        <div className="col-span-4">Jogador</div>
        <div className="col-span-2 text-center">Posição</div>
        <div className="col-span-1 text-center">OVR</div>
        <div className="col-span-1 text-center">Idade</div>
        <div className="col-span-1 text-center">Jogos</div>
        <div className="col-span-1 text-center">Gols</div>
        <div className="col-span-1 text-center">Assists</div>
        <div className="col-span-1 text-center">Ações</div>
      </div>

      <div className="divide-y divide-[#11d411]/10">
        {/* 3. Use a lista 'elencoOrdenado' aqui ao invés de 'data.squad' */}
        {elencoOrdenado.map((player) => (
          <div 
            key={player.id} 
            className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors group"
          >
            {/* Nome e Avatar */}
            <div className="col-span-4 flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-[#11d411]/20 flex items-center justify-center text-[#11d411]">
                 <User className="w-4 h-4" />
               </div>
               <span className="font-bold text-white uppercase">{player.name}</span>
            </div>

            {/* Posição (Com badge estilizada) */}
            <div className="col-span-2 flex justify-center">
              <span className="px-2 py-1 rounded bg-white/10 text-white font-bold text-xs w-12 text-center">
                {player.position}
              </span>
            </div>

            {/* OVR (Colorido dependendo do nível) */}
            <div className="col-span-1 text-center">
              <span className={`font-black text-lg ${
                player.overall >= 80 ? 'text-[#11d411]' : 
                player.overall >= 70 ? 'text-yellow-400' : 'text-white/60'
              }`}>
                {player.overall}
              </span>
            </div>

            <div className="col-span-1 text-center text-white/80 font-mono">{player.idade}</div>
            <div className="col-span-1 text-center text-white/60 font-mono italic">{player.jogos_disputados}</div>
            <div className="col-span-1 text-center text-[#11d411] font-bold font-mono">{player.gols}</div>
            <div className="col-span-1 text-center text-[#11d411] font-bold font-mono">{player.assistencias}</div>

            {/* Botões de Ação */}
            <div className="col-span-1 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => onEditPlayer(player)}
                className="p-1.5 hover:bg-yellow-500/20 text-yellow-500 rounded transition-colors"
                title="Editar Jogador"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => onRemovePlayer(player.id)}
                className="p-1.5 hover:bg-red-500/20 text-red-500 rounded transition-colors"
                title="Demitir Jogador"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        
        {/* Mensagem se lista vazia */}
        {elencoOrdenado.length === 0 && (
            <div className="p-8 text-center text-white/30 text-sm uppercase font-bold tracking-widest">
                Nenhum jogador no elenco
            </div>
        )}
      </div>
      
      {/* Botão de adicionar no rodapé */}
      <div className="p-4 border-t border-[#11d411]/20 bg-[#11d411]/5">
        <button
            onClick={onAddPlayer}
            className="w-full py-3 border-2 border-dashed border-[#11d411]/30 hover:border-[#11d411] text-[#11d411] rounded-lg font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 hover:bg-[#11d411]/10"
        >
            + Contratar Jogador
        </button>
      </div>
    </div>
  );
}