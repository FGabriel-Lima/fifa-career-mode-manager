// frontend/src/components/career/UpdateLeagueModal.jsx
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function UpdateLeagueModal({ isOpen, onClose, seasonId, seasonData, onSuccess }) {
  const [formData, setFormData] = useState({
    nome_liga: '',
    orcamento_transferencia: 0,
    orcamento_salarios: 0,
    vitorias: 0,
    empates: 0,
    derrotas: 0,
    pontos: 0,
    posicao: 1
  });

  // ESTA É A CHAVE: Sempre que o modal abrir, ele reseta os campos com os dados atuais
  useEffect(() => {
    if (isOpen && seasonData) {
      setFormData({
        nome_liga: seasonData.leagueName || '',
        orcamento_transferencia: seasonData.orcamento_transferencia || 0,
        orcamento_salarios: seasonData.orcamento_salarios || 0,
        vitorias: seasonData.stats?.wins || 0,
        empates: seasonData.stats?.draws || 0,
        derrotas: seasonData.stats?.losses || 0,
        pontos: seasonData.stats?.points || 0,
        posicao: seasonData.currentPosition || 1
      });
    }
  }, [isOpen, seasonData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Rota que vamos criar para atualizar a classificação
      await api.put(`/carreiras/temporadas/${seasonId}/classificacao`, formData);
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Erro ao atualizar liga", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0d1a0d] border border-[#11d411]/30 p-8 rounded-2xl w-full max-w-md">
        <h2 className="text-[#11d411] text-2xl font-black mb-6 uppercase">Atualizar Classificação</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
      <label className="text-white/60 text-xs font-bold uppercase mb-1 block">Nome da Competição / Liga</label>
      <input 
        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-[#11d411] outline-none mb-4"
        placeholder="Ex: Premier League, EFL League Two..."
        value={formData.nome_liga}
        onChange={e => setFormData({...formData, nome_liga: e.target.value})}
        required
      />
    </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
    <label className="text-white/60 text-xs font-bold uppercase mb-1 block italic">Orç. Transf. (€)</label>
    <input 
      type="number"
      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-[#11d411] outline-none"
      value={formData.orcamento_transferencia}
      onChange={e => setFormData({...formData, orcamento_transferencia: e.target.value})}
    />
  </div>
            <div>
              <label className="text-white/60 text-xs font-bold block mb-1">Vitórias</label>
              <input type="number" className="w-full bg-white/5 border border-white/10 rounded p-2 text-white"
                value={formData.vitorias} onChange={e => setFormData({...formData, vitorias: parseInt(e.target.value)})}/>
            </div>
            <div>
              <label className="text-white/60 text-xs font-bold block mb-1">Empates</label>
              <input type="number" className="w-full bg-white/5 border border-white/10 rounded p-2 text-white"
                value={formData.empates} onChange={e => setFormData({...formData, empates: parseInt(e.target.value)})}/>
            </div>
            <div>
              <label className="text-white/60 text-xs font-bold block mb-1">Derrotas</label>
              <input type="number" className="w-full bg-white/5 border border-white/10 rounded p-2 text-white"
                value={formData.derrotas} onChange={e => setFormData({...formData, derrotas: parseInt(e.target.value)})}/>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-white/60 text-xs font-bold block mb-1">Pontos Totais</label>
              <input type="number" className="w-full bg-white/5 border border-white/10 rounded p-2 text-white"
                value={formData.pontos} onChange={e => setFormData({...formData, pontos: parseInt(e.target.value)})}/>
            </div>
            <div>
              <label className="text-white/60 text-xs font-bold block mb-1">Posição Atual</label>
              <input type="number" className="w-full bg-white/5 border border-white/10 rounded p-2 text-white"
                value={formData.posicao} onChange={e => setFormData({...formData, posicao: parseInt(e.target.value)})}/>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button type="button" onClick={onClose} className="flex-1 text-white/50">Cancelar</button>
            <button type="submit" className="flex-1 bg-[#11d411] text-[#102210] py-3 rounded-xl font-black">ATUALIZAR</button>
          </div>
        </form>
      </div>
    </div>
  );
}