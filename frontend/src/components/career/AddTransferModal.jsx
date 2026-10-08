// frontend/src/components/career/AddTransferModal.jsx
import React, { useState } from 'react';
import api from '../../services/api';

export default function AddTransferModal({ isOpen, onClose, seasonId, onSuccess }) {
  const [formData, setFormData] = useState({
    nome_jogador: '',
    tipo_transferencia: 'compra',
    valor: 0,
    clube_envolvido: ''
  });

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Garantir que os valores sejam números e os nomes batam com o Controller
  const payload = {
    tipo_transferencia: formData.tipo_transferencia, // Deve ser 'compra' ou 'venda'
    valor_transferencia: Number(formData.valor),
    nome_jogador_externo: formData.nome_jogador,
    time_origem: formData.tipo_transferencia === 'compra' ? formData.clube_envolvido : 'Portsmouth',
    time_destino: formData.tipo_transferencia === 'venda' ? formData.clube_envolvido : 'Portsmouth',
    jogador_id: null // Opcional
  };

  try {
    // Note que não enviamos temporada_id no corpo, pois ele já vai na URL (/temporadas/8/...)
    await api.post(`/carreiras/temporadas/${seasonId}/transferencias`, payload);
    
    onSuccess();
    onClose();
  } catch (err) {
    // Se der erro 400, esse log vai mostrar o que o servidor respondeu
    console.error("Erro ao salvar transferência:", err.response?.data || err.message);
  }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0d1a0d] border border-[#11d411]/30 p-8 rounded-2xl w-full max-w-md">
        <h2 className="text-[#11d411] text-2xl font-black mb-6 uppercase">Registrar Movimentação</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-white/60 text-xs font-bold uppercase mb-1 block">Nome do Jogador</label>
            <input className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white"
              value={formData.nome_jogador} onChange={e => setFormData({...formData, nome_jogador: e.target.value})} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-white/60 text-xs font-bold uppercase mb-1 block">Tipo</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white"
                value={formData.tipo_transferencia} onChange={e => setFormData({...formData, tipo_transferencia: e.target.value})}>
                <option value="compra" className="bg-[#0d1a0d]">Compra / Entrada</option>
                <option value="venda" className="bg-[#0d1a0d]">Venda / Saída</option>
              </select>
            </div>
            <div>
              <label className="text-white/60 text-xs font-bold uppercase mb-1 block">Valor (€)</label>
              <input type="number" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white"
                value={formData.valor} onChange={e => setFormData({...formData, valor: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="text-white/60 text-xs font-bold uppercase mb-1 block">Clube (Origem/Destino)</label>
            <input className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white"
              value={formData.clube_envolvido} onChange={e => setFormData({...formData, clube_envolvido: e.target.value})} />
          </div>

          <div className="flex gap-3 mt-6">
            <button type="button" onClick={onClose} className="flex-1 text-white/50">Cancelar</button>
            <button type="submit" className="flex-1 bg-[#11d411] text-[#102210] py-3 rounded-xl font-black">REGISTRAR</button>
          </div>
        </form>
      </div>
    </div>
  );
}