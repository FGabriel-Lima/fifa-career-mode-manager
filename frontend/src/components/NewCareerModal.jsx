import React, { useState, useEffect } from 'react';
import api from '../services/api';

  const initialData = {
    nome_carreira: '',
    clube_nome: '',
    nome_temporada: '',
    orcamento_transferencia: ''
  };

function NewCareerModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState(initialData);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData);
    }
  }, [isOpen]);

  // Se não estiver aberto, não renderiza nada
  if (!isOpen) return null;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Função para fechar e limpar (usada no Cancelar e no X)
  const handleClose = () => {
    setFormData(initialData); 
    onClose(); 
  };

  const handleSubmit = async () => {
    if (!formData.nome_carreira || !formData.clube_nome || !formData.nome_temporada) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    setCreating(true);
    try {
      const response = await api.post('/carreiras', {
        ...formData,
        orcamento_transferencia: parseFloat(formData.orcamento_transferencia || 0)
      });
      
      onSuccess(response.data);
      setFormData(initialData); // Limpa também no sucesso
      
    } catch (error) {
      alert("Erro ao criar carreira. Tente novamente.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex h-screen w-full items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="flex w-full max-w-xl flex-col rounded-xl border border-[#11d411]/20 bg-[#102210] shadow-2xl shadow-[#11d411]/10 animate-in fade-in zoom-in duration-200">
        <div className="flex flex-col gap-6 p-6 sm:p-8">
          
          <div className="flex justify-between items-center">
            <p className="text-white tracking-light text-2xl sm:text-[32px] font-bold leading-tight">
              Iniciar Nova Jornada
            </p>
            <button onClick={handleClose} className="text-white/50 hover:text-white transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-white/80 text-base font-medium leading-normal pb-2">Nome do Save</p>
              <input name="nome_carreira" value={formData.nome_carreira} onChange={handleInputChange} className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-[#11d411]/80 border border-[#11d411]/30 bg-[#1A331A] focus:border-[#11d411] h-14 placeholder:text-[#11d411]/40 p-[15px] text-base font-normal leading-normal transition-all duration-200" placeholder="Rumo ao Estrelato" />
            </label>
            
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-white/80 text-base font-medium leading-normal pb-2">Nome do Clube</p>
              <input name="clube_nome" value={formData.clube_nome} onChange={handleInputChange} className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-[#11d411]/80 border border-[#11d411]/30 bg-[#1A331A] focus:border-[#11d411] h-14 placeholder:text-[#11d411]/40 p-[15px] text-base font-normal leading-normal transition-all duration-200" placeholder="Santos FC" />
            </label>
            
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-white/80 text-base font-medium leading-normal pb-2">Temporada Inicial</p>
              <input name="nome_temporada" value={formData.nome_temporada} onChange={handleInputChange} className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-[#11d411]/80 border border-[#11d411]/30 bg-[#1A331A] focus:border-[#11d411] h-14 placeholder:text-[#11d411]/40 p-[15px] text-base font-normal leading-normal transition-all duration-200" placeholder="2024/2025" />
            </label>
            
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-white/80 text-base font-medium leading-normal pb-2">Orçamento Inicial</p>
              <div className="relative flex w-full items-center">
                <span className="pointer-events-none absolute left-4 text-[#11d411]/40">R$</span>
                <input name="orcamento_transferencia" type="number" value={formData.orcamento_transferencia} onChange={handleInputChange} className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-[#11d411]/80 border border-[#11d411]/30 bg-[#1A331A] focus:border-[#11d411] h-14 placeholder:text-[#11d411]/40 pl-10 pr-4 text-base font-normal leading-normal transition-all duration-200" placeholder="50.000.000" />
              </div>
            </label>
          </div>

          <div className="mt-4 flex flex-col-reverse items-center gap-4 sm:flex-row sm:justify-end">
            <button onClick={handleClose} className="flex h-12 w-full items-center justify-center rounded-lg px-6 text-base font-bold text-white/80 transition-colors hover:bg-white/10 sm:w-auto">
              Cancelar
            </button>
            <button onClick={handleSubmit} disabled={creating} className="flex h-12 w-full items-center justify-center rounded-lg bg-[#11d411] px-6 text-base font-bold text-[#102210] transition-transform hover:scale-105 sm:w-auto disabled:opacity-50">
              {creating ? 'Criando...' : 'Criar Carreira'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default NewCareerModal;