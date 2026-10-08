import React from 'react';
import { ArrowDownCircle, ArrowUpCircle, Plus, Calendar, ArrowRight } from 'lucide-react';

export function TransfersTab({ data, onAddTransfer }) {
  // Proteção contra dados indefinidos
  const transfersIn = data?.transfers?.in || [];
  const transfersOut = data?.transfers?.out || [];

  // Função para formatar o valor monetário
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(value || 0);
  };

  // Função para formatar a data
  const formatDate = (dateString) => {
    if (!dateString) return '--/--';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho com Botão de Ação */}
      <div className="flex justify-between items-center bg-[#0d1a0d] p-6 rounded-xl border border-[#11d411]/20">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Mercado da Bola</h2>
          <p className="text-white/50 text-sm">Gerencie as entradas e saídas do clube</p>
        </div>
        <button 
          onClick={onAddTransfer}
          className="flex items-center gap-2 bg-[#11d411] text-[#102210] px-6 py-3 rounded-xl font-black hover:bg-[#11d411]/80 hover:scale-105 transition-all shadow-lg shadow-[#11d411]/20"
        >
          <Plus className="w-5 h-5" />
          REGISTRAR TRANSFERÊNCIA
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coluna de Entradas (Compras) */}
        <div className="bg-[#0d1a0d] rounded-xl border border-[#11d411]/20 overflow-hidden">
          <div className="p-6 border-b border-[#11d411]/20 bg-[#11d411]/10">
            <div className="flex items-center gap-3">
              <ArrowDownCircle className="w-6 h-6 text-[#11d411]" />
              <h2 className="text-xl font-bold">Entradas / Compras</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {transfersIn.length > 0 ? (
              transfersIn.map((transfer, index) => {
                const value = transfer.valor_transferencia || 0;
                const isHighlight = value >= 1000000;
                
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border transition-all hover:shadow-lg ${
                      isHighlight
                        ? 'bg-[#11d411]/10 border-[#11d411]/50 shadow-[#11d411]/5'
                        : 'bg-white/5 border-white/10 hover:border-[#11d411]/30'
                    }`}
                  >
                    <div className="font-bold text-lg mb-2">{transfer.nome_jogador_externo || 'Jogador Desconhecido'}</div>
                    <div className="text-sm text-white/70 mb-3 flex items-center gap-2">
                      <span className="opacity-50 text-xs uppercase font-bold">Origem:</span>
                      <span className="text-white font-medium">{transfer.time_origem || '---'}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-white/5 pt-3">
                      <span className={`text-lg font-black ${isHighlight ? 'text-[#11d411]' : 'text-white'}`}>
                        {formatCurrency(value)}
                      </span>
                      <div className="flex items-center gap-1 text-white/40 text-xs">
                        <Calendar className="w-3 h-3" />
                        {formatDate(transfer.data_transferencia)}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10 text-white/30 border-2 border-dashed border-white/5 rounded-xl">
                Nenhuma compra registrada.
              </div>
            )}
          </div>
        </div>

        {/* Coluna de Saídas (Vendas) */}
        <div className="bg-[#0d1a0d] rounded-xl border border-red-500/20 overflow-hidden">
          <div className="p-6 border-b border-red-500/20 bg-red-500/10">
            <div className="flex items-center gap-3">
              <ArrowUpCircle className="w-6 h-6 text-red-400" />
              <h2 className="text-xl font-bold">Saídas / Vendas</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {transfersOut.length > 0 ? (
              transfersOut.map((transfer, index) => {
                const value = transfer.valor_transferencia || 0;
                const isHighlight = value >= 1000000;

                return (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border transition-all hover:shadow-lg ${
                      isHighlight
                        ? 'bg-red-500/10 border-red-500/50 shadow-red-500/5'
                        : 'bg-white/5 border-white/10 hover:border-red-400/30'
                    }`}
                  >
                    <div className="font-bold text-lg mb-2">{transfer.nome_jogador_externo || 'Jogador Desconhecido'}</div>
                    <div className="text-sm text-white/70 mb-3 flex items-center gap-2">
                      <span className="opacity-50 text-xs uppercase font-bold">Destino:</span>
                      <span className="text-white font-medium">{transfer.time_destino || '---'}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-white/5 pt-3">
                      <span className={`text-lg font-black ${isHighlight ? 'text-red-400' : 'text-white'}`}>
                        {formatCurrency(value)}
                      </span>
                      <div className="flex items-center gap-1 text-white/40 text-xs">
                        <Calendar className="w-3 h-3" />
                        {formatDate(transfer.data_transferencia)}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10 text-white/30 border-2 border-dashed border-white/5 rounded-xl">
                Nenhuma venda registrada.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}