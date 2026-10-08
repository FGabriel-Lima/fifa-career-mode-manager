import React, { useState } from 'react';
import api from '../../services/api';
import { Calendar, ArrowRight, DollarSign } from 'lucide-react';

export default function NewSeasonModal({ isOpen, onClose, careerId, currentSeason, onSuccess }) {
  const [formData, setFormData] = useState({
    nome: '',
    orcamento: '',
    liga: ''
  });
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (currentSeason) {
      setFormData({
        nome: incrementYear(currentSeason.nome),
        orcamento: currentSeason.orcamento_transferencia,
        liga: currentSeason.leagueName
      });
    }
  }, [currentSeason]);

  const incrementYear = (str) => {
    try {
        const parts = str.split('/');
        if(parts.length === 2) {
            const y1 = parseInt(parts[0]) + 1;
            const y2 = parseInt(parts[1]) + 1;
            return `${y1}/${y2}`;
        }
        return str; 
    } catch { return ''; }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post(`/carreiras/${careerId}/avancar/${currentSeason.id}`, {
        nome_nova_temporada: formData.nome,
        novo_orcamento: formData.orcamento,
        nome_nova_liga: formData.liga
      });
      
      alert("Temporada Avançada com Sucesso!");
      
      // --- A CORREÇÃO ESTÁ AQUI ---
      // Pegamos o ID que o backend devolveu e passamos para o pai
      const novoId = response.data.novaTemporada.id;
      onSuccess(novoId); 
      // ----------------------------
      
      onClose();
    } catch (error) {
      alert("Erro ao criar nova temporada.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // ... (O restante do return do JSX continua igual)
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[150] p-4">
      <div className="bg-[#1a1a1a] border border-white/10 p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-black text-white mb-2 flex items-center gap-2">
          <Calendar className="text-green-500" /> Nova Temporada
        </h2>
        <p className="text-white/40 text-sm mb-6">
          Isso irá finalizar a temporada atual, resetar as estatísticas e adicionar +1 ano na idade dos jogadores.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-white/40 uppercase mb-1">Nome da Temporada</label>
            <input 
              value={formData.nome} 
              onChange={e => setFormData({...formData, nome: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-green-500 outline-none"
              placeholder="Ex: 2026/2027"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white/40 uppercase mb-1">Liga (Subiu de divisão?)</label>
            <input 
              value={formData.liga} 
              onChange={e => setFormData({...formData, liga: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-green-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white/40 uppercase mb-1">Orçamento Inicial</label>
            <div className="relative">
                <DollarSign className="absolute left-3 top-3 w-4 h-4 text-white/40" />
                <input 
                type="number"
                value={formData.orcamento} 
                onChange={e => setFormData({...formData, orcamento: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 pl-10 text-white focus:border-green-500 outline-none"
                />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button type="button" onClick={onClose} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold">
              Cancelar
            </button>
            <button 
                type="submit" 
                disabled={loading}
                className="flex-1 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold flex items-center justify-center gap-2"
            >
              {loading ? 'Processando...' : <>Avançar <ArrowRight className="w-4 h-4" /></>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}