import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Field, FormError } from '../AuthLayout';
import { Modal, ModalActions, useSubmit } from './ui';

const initial = { tipo: 'compra', jogador: '', clube: '', valor: '' };

export default function AddTransferModal({ isOpen, onClose, seasonId, clubName, onSuccess }) {
  const [form, setForm] = useState(initial);
  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const compra = form.tipo === 'compra';

  const { busy, error, setError, submit } = useSubmit(async () => {
    await api.post(`/carreiras/temporadas/${seasonId}/transferencias`, {
      tipo_transferencia: form.tipo,
      valor_transferencia: Number(form.valor) || 0,
      nome_jogador_externo: form.jogador,
      time_origem: compra ? form.clube : clubName,
      time_destino: compra ? clubName : form.clube,
      jogador_id: null,
    });
    onSuccess();
    onClose();
  }, 'Não foi possível registrar a transferência. Tente de novo.');

  useEffect(() => {
    if (!isOpen) return;
    setForm(initial);
    setError('');
  }, [isOpen, setError]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} onSubmit={submit} title="Registrar transferência" subtitle="O valor ajusta o orçamento da temporada.">
      <div role="radiogroup" aria-label="Tipo" className="grid grid-cols-2 gap-2 rounded-lg bg-pitch-950 p-1">
        {[['compra', 'Contratação'], ['venda', 'Venda']].map(([value, label]) => (
          <label
            key={value}
            className={`cursor-pointer rounded-md py-2 text-center text-sm font-semibold transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-neon ${
              form.tipo === value ? 'bg-neon text-pitch-950' : 'text-muted hover:text-chalk'
            }`}
          >
            <input type="radio" name="tipo" value={value} checked={form.tipo === value} onChange={set} className="sr-only" />
            {label}
          </label>
        ))}
      </div>

      <div className="mt-5 grid gap-5">
        <Field id="transf-jogador" name="jogador" label="Jogador" value={form.jogador} onChange={set} required autoFocus />
        <Field
          id="transf-clube"
          name="clube"
          label={compra ? 'Vem de qual clube?' : 'Vai para qual clube?'}
          value={form.clube}
          onChange={set}
        />
        <Field id="transf-valor" name="valor" label="Valor (R$)" type="number" min="0" inputMode="numeric" value={form.valor} onChange={set} required />
      </div>
      <div className="mt-5"><FormError>{error}</FormError></div>
      <ModalActions submitLabel={compra ? 'Registrar contratação' : 'Registrar venda'} busy={busy} onCancel={onClose} />
    </Modal>
  );
}
