import React, { useState } from 'react';
import api from '../../services/api'; // Ajuste o caminho conforme seu projeto
import { Star, X, Trophy, Medal } from 'lucide-react';

export default function AddCandidateModal({ isOpen, onClose, seasonId, premioId, onSuccess }) {
  const [formData, setFormData] = useState({
    nome: '',
    clube: '',
    gols_ch: 0,
    assist_ch: 0,
    ganhou_liga: false,
    vice_liga: false,
    ganhou_champions: false,
    vice_champions: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  // 1. VERIFICAÇÃO VISUAL DOS DADOS
  console.log("--- DEBUGGING ---");
  console.log("Season ID recebido:", seasonId);
  console.log("Premio ID recebido:", premioId);
  console.log("Dados do Form:", formData);

  if (!seasonId) {
    alert("ERRO CRÍTICO: 'seasonId' está indefinido. O Modal não recebeu o ID da temporada.");
    return;
  }

  try {
    let currentPremioId = premioId;

    // Se não tem ID do prêmio, tenta inicializar
    if (!currentPremioId) {
      console.log("Tentando inicializar prêmio para a temporada:", seasonId);
      
      const res = await api.post('/premios/inicializar', { temporada_id: seasonId });
      console.log("Resposta da inicialização:", res.data);
      
      currentPremioId = res.data.id;
    }

    // Envia o candidato
    console.log("Enviando candidato para premio_id:", currentPremioId);
    
    await api.post('/premios/candidato', {
      premio_id: currentPremioId,
      nome: formData.nome,
      clube: formData.clube,
      gols_ch: formData.gols_ch,
      assist_ch: formData.assist_ch,
      titulos: {
        ganhou_liga: formData.ganhou_liga,
        vice_liga: formData.vice_liga,
        ganhou_champions: formData.ganhou_champions,
        vice_champions: formData.vice_champions
      }
    });
    
    alert("SUCESSO! Candidato enviado."); // Se chegar aqui, funcionou
    
    setFormData({
      nome: '', clube: '', gols_ch: 0, assist_ch: 0,
      ganhou_liga: false, vice_liga: false, ganhou_champions: false, vice_champions: false
    });
    onSuccess();
    onClose();

  } catch (err) {
    // 2. PEGAR O ERRO REAL
    console.error("ERRO COMPLETO:", err);
    
    // Mostra o erro na tela
    if (err.response) {
      alert(`ERRO DO SERVIDOR (${err.response.status}): ${JSON.stringify(err.response.data)}`);
    } else {
      alert(`ERRO DE REDE/CÓDIGO: ${err.message}`);
    }
  }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[120] p-4">
      <div className="bg-[#0d1a0d] border-2 border-yellow-500/30 p-8 rounded-2xl w-full max-w-lg shadow-2xl shadow-yellow-500/10">
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-black uppercase text-yellow-100 italic flex items-center gap-2">
            <Star className="text-yellow-400 fill-yellow-400 w-5 h-5" /> Candidato Bola de Ouro
          </h2>
          <button onClick={onClose}><X className="text-white/30 hover:text-white" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados Básicos */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase text-white/40 mb-1 block">Nome do Jogador</label>
              <input name="nome" value={formData.nome} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white font-bold outline-none focus:border-yellow-500" placeholder="Ex: Vini Jr" required />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-white/40 mb-1 block">Clube</label>
              <input name="clube" value={formData.clube} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white font-bold outline-none focus:border-yellow-500" placeholder="Ex: Real Madrid" required />
            </div>
          </div>

          {/* Estatísticas Champions */}
          <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-500/20">
            <h3 className="text-blue-300 font-bold uppercase text-xs mb-3 flex items-center gap-2"><Trophy className="w-3 h-3" /> Champions League Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-blue-200/60 mb-1 block">Gols</label>
                <input type="number" name="gols_ch" value={formData.gols_ch} onChange={handleChange} className="w-full bg-[#0d1a0d] border border-blue-500/30 rounded-lg p-2 text-white text-center font-mono" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-blue-200/60 mb-1 block">Assistências</label>
                <input type="number" name="assist_ch" value={formData.assist_ch} onChange={handleChange} className="w-full bg-[#0d1a0d] border border-blue-500/30 rounded-lg p-2 text-white text-center font-mono" />
              </div>
            </div>
          </div>

          {/* Conquistas (Checkboxes) */}
          <div className="grid grid-cols-2 gap-4">
            {/* Liga Nacional */}
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase text-white/30">Liga Nacional</p>
              <label className="flex items-center gap-2 p-3 bg-white/5 rounded-lg border border-white/5 cursor-pointer hover:border-[#11d411]/50">
                <input type="checkbox" name="ganhou_liga" checked={formData.ganhou_liga} onChange={handleChange} className="accent-[#11d411]" />
                <span className="text-xs font-bold text-white uppercase">Campeão</span>
              </label>
              <label className="flex items-center gap-2 p-3 bg-white/5 rounded-lg border border-white/5 cursor-pointer hover:border-white/20">
                <input type="checkbox" name="vice_liga" checked={formData.vice_liga} onChange={handleChange} className="accent-gray-400" />
                <span className="text-xs font-bold text-white uppercase">Vice</span>
              </label>
            </div>

            {/* Champions League */}
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase text-white/30">Champions League</p>
              <label className="flex items-center gap-2 p-3 bg-white/5 rounded-lg border border-white/5 cursor-pointer hover:border-yellow-500">
                <input type="checkbox" name="ganhou_champions" checked={formData.ganhou_champions} onChange={handleChange} className="accent-yellow-500" />
                <span className="text-xs font-bold text-white uppercase">Campeão</span>
              </label>
              <label className="flex items-center gap-2 p-3 bg-white/5 rounded-lg border border-white/5 cursor-pointer hover:border-blue-400">
                <input type="checkbox" name="vice_champions" checked={formData.vice_champions} onChange={handleChange} className="accent-blue-400" />
                <span className="text-xs font-bold text-white uppercase">Vice</span>
              </label>
            </div>
          </div>

          <button type="submit" className="w-full py-4 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-xl text-black font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-yellow-500/20">
            Adicionar Candidato
          </button>
        </form>
      </div>
    </div>
  );
}