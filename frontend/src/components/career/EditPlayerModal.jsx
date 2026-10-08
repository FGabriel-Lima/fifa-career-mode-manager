import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Field, FormError } from '../AuthLayout';
import { Modal, ModalActions, useSubmit } from './ui';

const FIELDS = [
  ['overall', 'Overall'],
  ['idade', 'Idade'],
  ['jogos_disputados', 'Jogos'],
  ['gols', 'Gols'],
  ['assistencias', 'Assistências'],
  ['valor_mercado', 'Valor de mercado (R$)'],
];

export default function EditPlayerModal({ isOpen, onClose, player, onSuccess }) {
  const [form, setForm] = useState({});
  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const { busy, error, setError, submit } = useSubmit(async () => {
    const payload = Object.fromEntries(FIELDS.map(([key]) => [key, Number(form[key]) || 0]));
    await api.put(`/jogadores/elenco/${player.id}`, payload);
    onSuccess();
    onClose();
  }, 'Não foi possível salvar as estatísticas. Tente de novo.');

  useEffect(() => {
    if (!isOpen || !player) return;
    setForm(Object.fromEntries(FIELDS.map(([key]) => [key, Number(player[key]) || 0])));
    setError('');
  }, [isOpen, player, setError]);

  if (!player) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} onSubmit={submit} title="Editar estatísticas" subtitle={player.name}>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
        {FIELDS.map(([key, label]) => (
          <Field key={key} id={`editar-${key}`} name={key} label={label} type="number" min="0" value={form[key] ?? 0} onChange={set} />
        ))}
      </div>
      <div className="mt-5"><FormError>{error}</FormError></div>
      <ModalActions submitLabel="Salvar estatísticas" busy={busy} onCancel={onClose} />
    </Modal>
  );
}
