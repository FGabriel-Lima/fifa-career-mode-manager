// frontend/src/components/career/AddPlayerModal.jsx
import React, { useState } from 'react';
import api from '../../services/api';

export default function AddPlayerModal({ isOpen, onClose, careerId, seasonId, onSuccess }) {
  const [formData, setFormData] = useState({
    nome_completo: '',
    posicao: '',
    overall: 70,
    idade: 20,
    gols: 0,
    assistencias: 0
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Endpoint que vamos criar no backend para salvar tudo de uma vez
      const res = await api.post(`/carreiras/${careerId}/temporadas/${seasonId}/jogadores`, formData);
      onSuccess(res.data);
      onClose();
    } catch (err) {
      console.error("Erro ao salvar jogador", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0d1a0d] border border-[#11d411]/30 p-8 rounded-2xl w-full max-w-md shadow-2xl shadow-[#11d411]/10">
        <h2 className="text-[#11d411] text-2xl font-black mb-6 uppercase tracking-tighter">Novo Jogador</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-white/60 text-xs font-bold uppercase mb-1 block">Nome Completo</label>
            <input 
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-[#11d411] outline-none transition-all"
              value={formData.nome_completo}
              onChange={e => setFormData({...formData, nome_completo: e.target.value})}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-white/60 text-xs font-bold uppercase mb-1 block">Posição (ex: ST, GK)</label>
              <input 
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-[#11d411] outline-none"
                value={formData.posicao}
                onChange={e => setFormData({...formData, posicao: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="text-white/60 text-xs font-bold uppercase mb-1 block">Overall (OVR)</label>
              <input 
                type="number"
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-[#11d411] outline-none"
                value={formData.overall}
                onChange={e => setFormData({...formData, overall: parseInt(e.target.value)})}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl font-bold text-white/50 hover:bg-white/5 transition-all"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="flex-1 bg-[#11d411] text-[#102210] px-6 py-3 rounded-xl font-black hover:shadow-lg hover:shadow-[#11d411]/30 transition-all"
            >
              SALVAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}