import React, { useEffect, useState } from 'react';
import api, { apiError } from '../services/api';
import { btnPrimary, FormError, inputClass } from './AuthLayout';
import Crest from './Crest';

const initialData = {
  nome_carreira: '',
  clube_nome: '',
  nome_temporada: '',
  orcamento_transferencia: '',
};

function NewCareerModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState(initialData);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  // Limpa o formulário só quando o modal abre.
  useEffect(() => {
    if (!isOpen) return;
    setFormData(initialData);
    setError('');
  }, [isOpen]);

  // Esc fecha o modal.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError('');
    try {
      const response = await api.post('/carreiras', {
        ...formData,
        orcamento_transferencia: parseFloat(formData.orcamento_transferencia || 0),
      });
      onSuccess(response.data);
    } catch (err) {
      setError(apiError(err, 'Não foi possível criar a carreira. Tente de novo.'));
    } finally {
      setCreating(false);
    }
  };

  const field = (name, label, placeholder, extra = {}) => (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-muted">{label}</span>
      <input
        name={name}
        value={formData[name]}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={inputClass}
        {...extra}
      />
    </label>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="nova-carreira-titulo"
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-2xl border border-pitch-700 bg-pitch-900 p-6 font-display text-chalk shadow-2xl sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Crest name={formData.clube_nome || '?'} className="h-14 w-12 shrink-0" />
            <div>
              <h2 id="nova-carreira-titulo" className="font-kit text-3xl font-bold uppercase leading-none">
                Nova carreira
              </h2>
              <p className="mt-1 text-sm text-muted">O escudo muda conforme o nome do clube.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="grid h-9 w-9 place-items-center rounded-lg text-muted transition hover:bg-pitch-800 hover:text-chalk"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          {field('nome_carreira', 'Nome do save', 'Rumo ao estrelato', { required: true, autoFocus: true })}
          {field('clube_nome', 'Clube', 'Santos FC', { required: true })}
          {field('nome_temporada', 'Temporada inicial', '2025/26', { required: true })}
          {field('orcamento_transferencia', 'Orçamento de transferências (R$)', '50000000', {
            type: 'number',
            min: 0,
            inputMode: 'numeric',
          })}
        </div>

        <div className="mt-5">
          <FormError>{error}</FormError>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="h-12 rounded-lg px-6 font-semibold text-muted transition hover:bg-pitch-800 hover:text-chalk"
          >
            Cancelar
          </button>
          <button type="submit" disabled={creating} className={`${btnPrimary} sm:w-auto`}>
            {creating ? 'Criando…' : 'Criar carreira'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewCareerModal;
