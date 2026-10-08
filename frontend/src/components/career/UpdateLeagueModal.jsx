import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Field, FormError } from '../AuthLayout';
import { Modal, ModalActions, useSubmit } from './ui';

const NUMBERS = [
  ['posicao', 'Posição'],
  ['pontos', 'Pontos'],
  ['vitorias', 'Vitórias'],
  ['empates', 'Empates'],
  ['derrotas', 'Derrotas'],
];

export default function UpdateLeagueModal({ isOpen, onClose, seasonId, seasonData, onSuccess }) {
  const [form, setForm] = useState({});
  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const { busy, error, setError, submit } = useSubmit(async () => {
    await api.put(`/carreiras/temporadas/${seasonId}/classificacao`, form);
    onSuccess();
    onClose();
  }, 'Não foi possível atualizar a classificação. Tente de novo.');

  useEffect(() => {
    if (!isOpen || !seasonData) return;
    const position = Number(seasonData.currentPosition);
    setForm({
      nome_liga: seasonData.leagueName || '',
      orcamento_transferencia: seasonData.orcamento_transferencia || 0,
      posicao: Number.isNaN(position) ? 1 : position,
      pontos: seasonData.stats?.points || 0,
      vitorias: seasonData.stats?.wins || 0,
      empates: seasonData.stats?.draws || 0,
      derrotas: seasonData.stats?.losses || 0,
    });
    setError('');
  }, [isOpen, seasonData, setError]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} onSubmit={submit} wide title="Atualizar classificação" subtitle="Copie os números da tabela do jogo.">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="liga-nome" name="nome_liga" label="Liga" placeholder="Brasileirão Série A" value={form.nome_liga || ''} onChange={set} required />
        <Field id="liga-orcamento" name="orcamento_transferencia" label="Orçamento de transferências (R$)" type="number" min="0" value={form.orcamento_transferencia ?? 0} onChange={set} />
      </div>
      <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-5">
        {NUMBERS.map(([key, label]) => (
          <Field key={key} id={`liga-${key}`} name={key} label={label} type="number" min="0" value={form[key] ?? 0} onChange={set} />
        ))}
      </div>
      <div className="mt-5"><FormError>{error}</FormError></div>
      <ModalActions submitLabel="Salvar classificação" busy={busy} onCancel={onClose} />
    </Modal>
  );
}
