import React, { useState } from 'react';
import api from '../../services/api';
import { Trophy, X } from 'lucide-react';

export default function AddTitleModal({ isOpen, onClose, seasonId, currentClubName, onSuccess }) {
  const [nomeTitulo, setNomeTitulo] = useState('');
  const [clubeVencedor, setClubeVencedor] = useState(currentClubName || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/premios/titulos', {
        temporada_id: seasonId,
        nome_titulo: nomeTitulo,
        clube_vencedor: clubeVencedor
      });
      
      setNomeTitulo(''); // Limpa o campo
      onSuccess();       // Recarrega a lista de troféus
      onClose();         // Fecha o modal
    } catch (err) {
      console.error("Erro ao registrar título:", err);
      alert("Erro ao salvar a conquista.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-[#0d1a0d] border border-[#11d411]/30 p-8 rounded-2xl w-full max-w-md shadow-2xl shadow-[#11d411]/10 relative">
        
        {/* Botão Fechar */}
        <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white">
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-[#11d411]/20 rounded-full flex items-center justify-center">
            <Trophy className="w-6 h-6 text-[#11d411]" />
          </div>
          <div>
            <h2 className="text-white text-xl font-black uppercase italic tracking-tighter">Grito de Campeão</h2>
            <p className="text-[#11d411] text-[10px] font-bold uppercase">Adicionar ao Almanaque</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-white/60 text-xs font-bold uppercase mb-2 block ml-1 italic">
              Nome da Competição
            </label>
            <input 
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-[#11d411] outline-none transition-all placeholder:text-white/10"
              placeholder="Ex: Premier League, FA Cup..."
              value={nomeTitulo}
              onChange={e => setNomeTitulo(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div>
            <label className="text-white/60 text-xs font-bold uppercase mb-2 block ml-1 italic">
              Clube Vencedor
            </label>
            <input 
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-[#11d411] outline-none transition-all"
              value={clubeVencedor}
              onChange={e => setClubeVencedor(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-4 pt-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 text-white/40 font-black uppercase text-xs tracking-widest hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="flex-[2] bg-[#11d411] text-[#102210] py-4 rounded-xl font-black uppercase text-sm tracking-tighter hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#11d411]/20"
            >
              ERGUER TROFÉU
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}