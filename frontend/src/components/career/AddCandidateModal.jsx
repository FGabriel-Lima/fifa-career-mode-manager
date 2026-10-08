import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Field, FormError } from '../AuthLayout';
import { Modal, ModalActions, useSubmit } from './ui';

const initial = {
  nome: '',
  clube: '',
  gols_ch: 0,
  assist_ch: 0,
  ganhou_liga: false,
  vice_liga: false,
  ganhou_champions: false,
  vice_champions: false,
};

const CONQUISTAS = [
  ['Liga nacional', [['ganhou_liga', 'Campeão'], ['vice_liga', 'Vice']]],
  ['Champions League', [['ganhou_champions', 'Campeão'], ['vice_champions', 'Vice']]],
];

export default function AddCandidateModal({ isOpen, onClose, seasonId, premioId, onSuccess }) {
  const [form, setForm] = useState(initial);
  const set = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const { busy, error, setError, submit } = useSubmit(async () => {
    // O prêmio da temporada é criado na primeira candidatura.
    const id = premioId || (await api.post('/premios/inicializar', { temporada_id: seasonId })).data.id;
    const { nome, clube, gols_ch, assist_ch, ...titulos } = form;
    await api.post('/premios/candidato', { premio_id: id, nome, clube, gols_ch, assist_ch, titulos });
    onSuccess();
    onClose();
  }, 'Não foi possível adicionar o candidato. Tente de novo.');

  useEffect(() => {
    if (!isOpen) return;
    setForm(initial);
    setError('');
  }, [isOpen, setError]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} onSubmit={submit} wide title="Adicionar candidato" subtitle="Disputa a Bola de Ouro desta temporada.">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="cand-nome" name="nome" label="Jogador" placeholder="Vini Jr." value={form.nome} onChange={set} required autoFocus />
        <Field id="cand-clube" name="clube" label="Clube" placeholder="Real Madrid" value={form.clube} onChange={set} required />
        <Field id="cand-gols" name="gols_ch" label="Gols na Champions" type="number" min="0" value={form.gols_ch} onChange={set} />
        <Field id="cand-assist" name="assist_ch" label="Assistências na Champions" type="number" min="0" value={form.assist_ch} onChange={set} />
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {CONQUISTAS.map(([grupo, opcoes]) => (
          <fieldset key={grupo}>
            <legend className="text-sm font-medium text-muted">{grupo}</legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {opcoes.map(([name, label]) => (
                <label
                  key={name}
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-semibold transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-neon ${
                    form[name] ? 'border-gold bg-gold/10 text-gold' : 'border-pitch-700 text-muted hover:text-chalk'
                  }`}
                >
                  <input type="checkbox" name={name} checked={form[name]} onChange={set} className="sr-only" />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>
      <div className="mt-5"><FormError>{error}</FormError></div>
      <ModalActions submitLabel="Adicionar candidato" busy={busy} onCancel={onClose} />
    </Modal>
  );
}
