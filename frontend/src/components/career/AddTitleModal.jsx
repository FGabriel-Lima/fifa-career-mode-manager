import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Field, FormError } from '../AuthLayout';
import { Icon, Modal, ModalActions, useSubmit } from './ui';

export default function AddTitleModal({ isOpen, onClose, seasonId, currentClubName, onSuccess }) {
  const [nomeTitulo, setNomeTitulo] = useState('');
  const [clubeVencedor, setClubeVencedor] = useState('');

  const { busy, error, setError, submit } = useSubmit(async () => {
    await api.post('/premios/titulos', {
      temporada_id: seasonId,
      nome_titulo: nomeTitulo,
      clube_vencedor: clubeVencedor,
    });
    onSuccess();
    onClose();
  }, 'Não foi possível salvar o título. Tente de novo.');

  useEffect(() => {
    if (!isOpen) return;
    setNomeTitulo('');
    setClubeVencedor(currentClubName || '');
    setError('');
  }, [isOpen, currentClubName, setError]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={submit}
      title="Adicionar título"
      subtitle="Vai para a sala de troféus desta temporada."
      icon={<Icon name="emoji_events" className="text-4xl text-gold" />}
    >
      <div className="grid gap-5">
        <Field id="titulo-nome" label="Competição" placeholder="Brasileirão, Copa do Brasil…" value={nomeTitulo} onChange={(e) => setNomeTitulo(e.target.value)} required autoFocus />
        <Field id="titulo-clube" label="Clube campeão" value={clubeVencedor} onChange={(e) => setClubeVencedor(e.target.value)} required />
      </div>
      <div className="mt-5"><FormError>{error}</FormError></div>
      <ModalActions submitLabel="Adicionar título" busy={busy} onCancel={onClose} />
    </Modal>
  );
}
