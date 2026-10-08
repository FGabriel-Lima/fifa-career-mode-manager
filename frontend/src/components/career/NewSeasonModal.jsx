import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Field, FormError } from '../AuthLayout';
import { Modal, ModalActions, useSubmit } from './ui';

// "2025/26" -> "2026/27", "2025" -> "2026"; qualquer outro formato fica como está.
const nextSeason = (name = '') =>
  /^\d+(\/\d+)?$/.test(name.trim()) ? name.trim().split('/').map((y) => String(Number(y) + 1).padStart(y.length, '0')).join('/') : name;

export default function NewSeasonModal({ isOpen, onClose, careerId, currentSeason, onSuccess }) {
  const [form, setForm] = useState({ nome: '', liga: '', orcamento: '' });
  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const { busy, error, setError, submit } = useSubmit(async () => {
    const res = await api.post(`/carreiras/${careerId}/avancar/${currentSeason.id}`, {
      nome_nova_temporada: form.nome,
      novo_orcamento: form.orcamento,
      nome_nova_liga: form.liga,
    });
    onSuccess(res.data.novaTemporada.id);
    onClose();
  }, 'Não foi possível começar a nova temporada. Tente de novo.');

  useEffect(() => {
    if (!isOpen || !currentSeason) return;
    setForm({
      nome: nextSeason(currentSeason.nome),
      liga: currentSeason.leagueName || '',
      orcamento: currentSeason.orcamento_transferencia || '',
    });
    setError('');
  }, [isOpen, currentSeason, setError]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={submit}
      title="Encerrar temporada"
      subtitle={`O elenco de ${currentSeason?.nome || 'agora'} passa para a próxima com estatísticas zeradas e um ano a mais de idade.`}
    >
      <div className="grid gap-5">
        <Field id="temp-nome" name="nome" label="Próxima temporada" placeholder="2026/27" value={form.nome} onChange={set} required autoFocus />
        <Field id="temp-liga" name="liga" label="Liga" value={form.liga} onChange={set} />
        <Field id="temp-orcamento" name="orcamento" label="Orçamento de transferências (R$)" type="number" min="0" inputMode="numeric" value={form.orcamento} onChange={set} />
      </div>
      <div className="mt-5"><FormError>{error}</FormError></div>
      <ModalActions submitLabel={`Começar ${form.nome || 'temporada'}`} busy={busy} onCancel={onClose} />
    </Modal>
  );
}
