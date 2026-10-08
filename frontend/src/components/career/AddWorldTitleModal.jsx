import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Field, FormError } from '../AuthLayout';
import Crest from '../Crest';
import { Modal, ModalActions, useSubmit } from './ui';

const initial = { nome_titulo: '', clube_vencedor: '', clube_vice: '' };

export default function AddWorldTitleModal({ isOpen, onClose, seasonId, onSuccess }) {
  const [form, setForm] = useState(initial);
  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const { busy, error, setError, submit } = useSubmit(async () => {
    await api.post(`/premios/mundo/${seasonId}`, { campeoes: [form] });
    onSuccess();
    onClose();
  }, 'Não foi possível registrar o campeão. Tente de novo.');

  useEffect(() => {
    if (!isOpen) return;
    setForm(initial);
    setError('');
  }, [isOpen, setError]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={submit}
      title="Registrar campeão"
      subtitle="Quem venceu as outras competições da temporada."
      icon={<Crest name={form.clube_vencedor || '?'} className="h-14 w-12 shrink-0" />}
    >
      <div className="grid gap-5">
        <Field id="mundo-titulo" name="nome_titulo" label="Competição" placeholder="Champions League" value={form.nome_titulo} onChange={set} required autoFocus />
        <Field id="mundo-campeao" name="clube_vencedor" label="Campeão" placeholder="Real Madrid" value={form.clube_vencedor} onChange={set} required />
        <Field id="mundo-vice" name="clube_vice" label="Vice (opcional)" placeholder="Manchester City" value={form.clube_vice} onChange={set} />
      </div>
      <div className="mt-5"><FormError>{error}</FormError></div>
      <ModalActions submitLabel="Registrar campeão" busy={busy} onCancel={onClose} />
    </Modal>
  );
}
