import React from 'react';
import { Trophy, Users, Star, Target, Coins } from 'lucide-react';

export function ClubHeader({ data }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(value || 0);
  };
  // data aqui é a 'temporadaAtiva'
  const teamName = data?.clube_nome || "Nome do Clube";
  const league = data?.leagueName || "Liga";
  const position = data?.currentPosition || "--";

  return (
    <div className="bg-[#0d1a0d] p-8 rounded-2xl border border-[#11d411]/20 relative overflow-hidden">
      {/* Detalhe estético de fundo */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#11d411]/5 rounded-full -mr-32 -mt-32 blur-3xl" />
      
      <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
        {/* Logo do Clube (Placeholder) */}
        <div className="w-32 h-32 bg-gradient-to-br from-[#11d411]/20 to-[#102210] rounded-2xl border-2 border-[#11d411]/30 flex items-center justify-center shadow-2xl shadow-[#11d411]/10">
          <Trophy className="w-16 h-16 text-[#11d411]" />
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
              {teamName}
            </h1>
            <div className="flex items-center gap-2 px-4 py-1 bg-[#11d411] text-[#102210] rounded-full font-bold text-sm mx-auto md:mx-0">
              <Star className="w-4 h-4 fill-current" />
              {position}º LUGAR
            </div>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-6 text-white/60">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-[#11d411]" />
              <span className="font-medium">{league}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#11d411]" />
              <span className="font-medium">Temporada {data?.nome}</span>
            </div>
            {/* Orçamento Transferências */}
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold text-white/40">Transferências</span>
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-[#11d411]" />
            <span className="font-bold text-white">{formatCurrency(data?.orcamento_transferencia)}</span>
          </div>
        </div>
          </div>
        </div>

        {/* Card de Pontuação Rápida */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl min-w-[160px] text-center">
          <p className="text-white/40 text-xs font-bold uppercase mb-1">Pontos na Liga</p>
          <p className="text-5xl font-black text-[#11d411]">{data?.stats?.points || 0}</p>
        </div>
      </div>
    </div>
  );
}