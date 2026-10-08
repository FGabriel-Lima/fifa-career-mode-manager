import React from 'react'
import { Trophy, Award, Star, Globe, Target, TrendingUp, Plus, Calculator } from 'lucide-react';

export function TrophiesTab({ data, onAddTitle, onAddWorldTitle, onAddCandidate, onCalculateWinner }) {

  // --- 1. CONFIGURAÇÃO DE DADOS E SEGURANÇA ---
  const allTrophies = data?.trophies || []
  const individualAwards = data?.individualAwards || []
  
  // CORREÇÃO PRINCIPAL: Tenta pegar o nome do clube de todas as formas possíveis
  const rawClubName = data?.clube_nome || data?.currentClubName || data?.clubeNome || "Meu Clube";

  // --- 2. LÓGICA DE COMPARAÇÃO (NORMALIZAÇÃO) ---
  // Transforma " Arsenal " em "arsenal" para a comparação não falhar por causa de maiúsculas ou espaços
  const clean = (str) => str ? str.toString().toLowerCase().trim() : "";
  const myClubName = clean(rawClubName);

  // --- 3. FILTROS ---
  const myTrophies = allTrophies.filter(t => clean(t.clube_vencedor) === myClubName)
  const worldTrophies = allTrophies.filter(t => clean(t.clube_vencedor) !== myClubName)

  // --- 4. DEBUG (Pode remover depois se quiser) ---
  console.log("--- DEBUG TROPHIES TAB ---");
  console.log("Temporada ID:", data?.id);
  console.log("Nome Bruto do Clube:", rawClubName);
  console.log("Nome Limpo para Filtro:", myClubName);
  console.log("Total Títulos:", allTrophies.length);
  console.log("Meus Títulos:", myTrophies.length);
  console.log("Mundiais:", worldTrophies.length);
  if(allTrophies.length > 0) {
      console.log("Teste Match 1º Título:", clean(allTrophies[0].clube_vencedor) === myClubName);
  }
  console.log("--------------------------");

  // Proteção da Bola de Ouro
  const ballonDor = data?.ballonDor || {
    winner: null,
    finalists: []
  }
  // -------------------------------------------------------

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Coluna Esquerda - Panorama Mundial */}
      <div className="space-y-6">
        
        {/* Sala de Troféus do Clube */}
        <div className="bg-[#0d1a0d] rounded-xl border border-[#11d411]/20 overflow-hidden">
          <div className="p-6 border-b border-[#11d411]/20 bg-[#11d411]/10 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-[#11d411]" />
              <h2 className="text-xl font-bold uppercase italic">
                Sala de Troféus
              </h2>
            </div>
            {/* Botão para abrir o modal de adicionar título */}
            <button
              onClick={onAddTitle}
              className="p-2 bg-[#11d411]/20 hover:bg-[#11d411] text-[#11d411] hover:text-[#102210] rounded-lg transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6">
            {myTrophies.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myTrophies.map((trophy, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gradient-to-r from-[#11d411]/10 to-transparent rounded-xl border border-[#11d411]/20 hover:border-[#11d411]/50 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#11d411]/20 rounded-full flex items-center justify-center shadow-lg shadow-[#11d411]/10">
                        <Trophy className="w-5 h-5 text-[#11d411]" />
                      </div>
                      <div>
                        <div className="font-black uppercase text-sm text-white">
                          {trophy.nome_titulo}
                        </div>
                        <div className="text-[10px] text-[#11d411] font-bold uppercase tracking-widest">
                          {trophy.season || 'Temporada Atual'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-2xl">
                <Trophy className="w-12 h-12 mx-auto mb-3 opacity-20 text-white" />
                <p className="text-xs font-bold uppercase text-white/30 tracking-widest">
                  Gabinete Vazio
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Prêmios Individuais (Usa 'individualAwards') */}
        <div className="bg-[#0d1a0d] rounded-xl border border-[#11d411]/20 overflow-hidden">
          <div className="p-6 border-b border-[#11d411]/20 bg-[#11d411]/5">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-[#11d411]" />
              <h2 className="text-xl font-bold uppercase italic tracking-tighter">
                Prêmios do Clube
              </h2>
            </div>
          </div>
          <div className="p-6">
            {individualAwards.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {individualAwards.map((award, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white/[0.03] rounded-xl border border-white/5 flex items-center justify-between group hover:border-[#11d411]/30 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#11d411]/10 rounded-full flex items-center justify-center border border-[#11d411]/20">
                        {award.icon === 'Target' ? (
                          <Target className="text-[#11d411] w-6 h-6" />
                        ) : (
                          <TrendingUp className="text-[#11d411] w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <div className="font-black text-white uppercase">
                          {award.player}
                        </div>
                        <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                          {award.award}
                        </div>
                      </div>
                    </div>
                    <div className="text-[#11d411] font-black italic">
                      {award.stats}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 border border-dashed border-white/5 rounded-xl">
                <p className="text-xs font-bold uppercase text-white/20 tracking-widest">
                  Sem estatísticas registradas
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Campeões da Temporada (PELO MUNDO) */}
        <div className="bg-[#0d1a0d] rounded-xl border border-[#11d411]/20 overflow-hidden shadow-lg shadow-blue-500/5">
          <div className="p-6 border-b border-[#11d411]/20 bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Globe className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-bold uppercase italic tracking-tighter">
                Campeões da Temporada
              </h2>
            </div>

            <button
              onClick={onAddWorldTitle}
              className="p-2 bg-blue-500/20 hover:bg-blue-400 text-blue-400 hover:text-[#102210] rounded-lg transition-all border border-blue-500/30"
              title="Registrar Campeão Mundial"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-3">
            {worldTrophies.length > 0 ? (
              worldTrophies.map((trophy, index) => (
                <div
                  key={index}
                  className="p-4 bg-white/[0.02] rounded-xl border border-white/5 group hover:border-blue-400/30 transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="text-[10px] text-blue-400/60 font-black uppercase tracking-[0.2em]">
                        {trophy.nome_titulo}
                      </div>
                      <div className="font-black text-white uppercase text-lg italic tracking-tighter leading-tight">
                        {trophy.clube_vencedor}
                      </div>

                      {trophy.clube_vice && (
                        <div className="text-[10px] text-white/30 font-bold uppercase mt-1 flex items-center gap-1">
                          <span className="w-4 h-[1px] bg-white/10"></span>
                          Vice: {trophy.clube_vice}
                        </div>
                      )}
                    </div>
                    <Trophy className="w-6 h-6 text-blue-500/20 group-hover:text-blue-500/50 transition-all" />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 border border-dashed border-white/5 rounded-xl">
                <p className="text-xs font-bold uppercase text-white/20 tracking-widest italic">
                  Nenhum campeão mundial registrado nesta temporada
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Coluna Direita - Premiações Individuais (Usa 'ballonDor') */}
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-yellow-600/30 via-yellow-500/20 to-orange-600/30 rounded-xl border-2 border-yellow-500/50 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-yellow-500/30 bg-gradient-to-r from-yellow-600/40 to-orange-600/40">
            <div className="flex items-center gap-3">
              <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
              <h2 className="text-2xl font-bold text-yellow-100">
                Ballon d'Or
              </h2>
            </div>

            {/* Só mostra o botão se NÃO houver vencedor */}
            {!ballonDor.winner && (
                <button
                onClick={onCalculateWinner}
                className="flex items-center gap-2 px-3 py-2 bg-yellow-500 hover:bg-yellow-400 text-[#0d1a0d] rounded-lg transition-all font-black uppercase text-[10px] tracking-widest shadow-lg shadow-yellow-500/20 border border-yellow-300"
                title="Processar Votos"
                >
                <Calculator className="w-4 h-4" /> Calcular
                </button>
            )}
          </div>

          <div className="p-8 text-center">
            {ballonDor.winner ? (
              <>
                <div className="w-32 h-32 bg-gradient-to-br from-yellow-500/40 to-yellow-600/60 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-yellow-400/50">
                  <Star className="w-16 h-16 text-yellow-200 fill-yellow-200" />
                </div>
                <h3 className="text-3xl font-bold text-yellow-100 mb-2">
                  {ballonDor.winner.name}
                </h3>
                <div className="px-4 py-2 bg-yellow-500/30 rounded-full border border-yellow-400/50 inline-block mb-4">
                  <span className="font-semibold text-yellow-200">
                    {ballonDor.winner.club}
                  </span>
                </div>
              </>
            ) : (
              <p className="text-yellow-100/50">Vencedor não anunciado</p>
            )}
          </div>
        </div>

        {/* Finalistas (Usa 'ballonDor.finalists') */}
        <div className="bg-[#0d1a0d] rounded-xl border border-yellow-500/30 overflow-hidden">
          <div className="p-6 border-b border-yellow-500/20 bg-yellow-500/10">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-yellow-400" />
              <h2 className="text-xl font-bold">Finalistas</h2>
            </div>

            <button
              onClick={onAddCandidate}
              className="p-2 bg-yellow-500/10 hover:bg-yellow-500 text-yellow-500 hover:text-black rounded-lg transition-all border border-yellow-500/30"
              title="Adicionar Candidato"
            >
              <Plus className="w-4 h-4" />
            </button>

          </div>
          <div className="p-6 space-y-4">
            {ballonDor.finalists.map((finalist, idx) => (
              <div
                key={idx}
                className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between"
              >
                <div className="font-bold">{finalist.name}</div>
                <div className="text-[#11d411]">{finalist.goals} Gols</div>
              </div>
            ))}
            {ballonDor.finalists.length === 0 && (
              <p className="text-white/40 text-center">
                Dados de finalistas indisponíveis.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}