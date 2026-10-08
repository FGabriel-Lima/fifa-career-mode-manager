import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Field, FormError } from '../AuthLayout';
import { POSITIONS } from './SquadTab';
import { Modal, ModalActions, selectClass, useSubmit } from './ui';

const initial = { nome_completo: '', posicao: 'ATA', overall: 70, idade: 20 };

export default function AddPlayerModal({ isOpen, onClose, careerId, seasonId, onSuccess }) {
  const [form, setForm] = useState(initial);
  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const { busy, error, setError, submit } = useSubmit(async () => {
    await api.post(`/carreiras/${careerId}/temporadas/${seasonId}/jogadores`, {
      ...form,
      overall: Number(form.overall),
      idade: Number(form.idade),
    });
    onSuccess();
    onClose();
  }, 'Não foi possível adicionar o jogador. Tente de novo.');

  useEffect(() => {
    if (!isOpen) return;
    setForm(initial);
    setError('');
  }, [isOpen, setError]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} onSubmit={submit} title="Adicionar jogador" subtitle="Entra no elenco desta temporada.">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field id="jogador-nome" name="nome_completo" label="Nome" value={form.nome_completo} onChange={set} required autoFocus />
        </div>
        <label className="flex flex-col gap-2" htmlFor="jogador-posicao">
          <span className="text-sm font-medium text-muted">Posição</span>
          <select id="jogador-posicao" name="posicao" value={form.posicao} onChange={set} className={selectClass}>
            {POSITIONS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </label>
        <Field id="jogador-ovr" name="overall" label="Overall" type="number" min="1" max="99" value={form.overall} onChange={set} />
        <Field id="jogador-idade" name="idade" label="Idade" type="number" min="14" max="50" value={form.idade} onChange={set} />
      </div>
      <div className="mt-5"><FormError>{error}</FormError></div>
      <ModalActions submitLabel="Adicionar jogador" busy={busy} onCancel={onClose} />
    </Modal>
  );
}
