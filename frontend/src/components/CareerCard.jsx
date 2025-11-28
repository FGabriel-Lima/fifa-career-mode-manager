import React from 'react';

function CareerCard({ carreira, onOpen }) {
  
  const temporadaAtual = carreira.temporadas && carreira.temporadas[0];

  return (
    <div className="flex flex-col gap-3 rounded-lg bg-[#1A2B1A] p-3 transition-all hover:ring-2 hover:ring-[#11d411]/50 hover:scale-[1.02] shadow-lg border border-white/5">
      
      {/* Imagem do Card */}
      <div className="w-full bg-center bg-no-repeat aspect-[16/10] bg-cover rounded-md bg-gray-800 relative overflow-hidden group">
          {/* Gradiente na imagem */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#102210] via-transparent to-transparent opacity-80"></div>
          
          {/* Ícone de Estádio */}
          <span className="material-symbols-outlined absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white/20 group-hover:text-[#11d411]/40 transition-colors duration-300" style={{fontSize: '48px'}}>
            stadium
          </span>
          
          {/* Nome do clube sobre a imagem */}
          <div className="absolute bottom-2 left-3 right-3">
             <p className="text-white font-bold text-lg truncate drop-shadow-md tracking-tight">
               {temporadaAtual?.clube_nome || "Sem Clube"}
             </p>
          </div>
      </div>
      
      {/* Informações de Texto */}
      <div className="flex flex-col gap-1 px-1 py-1">
        <p className="text-[#11d411] text-base font-bold leading-normal truncate">
          {carreira.nome_carreira}
        </p>
        <div className="flex items-center gap-1 text-white/60 text-xs font-medium">
            <span className="material-symbols-outlined" style={{fontSize: '14px'}}>calendar_month</span>
            <span>Temporada: {temporadaAtual?.nome}</span>
        </div>
      </div>
      
      {/* Botão de Ação */}
      <button 
        onClick={() => onOpen(carreira.id)}
        className="w-full flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#11d411] text-[#102210] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#11d411]/90 transition-colors mt-auto shadow-md shadow-[#11d411]/10"
      >
        <span className="truncate">Carregar Save</span>
      </button>
    </div>
  );
}

export default CareerCard;