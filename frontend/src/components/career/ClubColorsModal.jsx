import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { FormError } from '../AuthLayout';
import ColorFields from '../ColorFields';
import Crest, { clubColors } from '../Crest';
import { Modal, ModalActions, useSubmit } from './ui';

export default function ClubColorsModal({ isOpen, onClose, season, onSuccess }) {
  const [colors, setColors] = useState(['#000000', '#ffffff']);

  const { busy, error, setError, submit } = useSubmit(async () => {
    await api.put(`/carreiras/temporadas/${season.id}/cores`, { cor_primaria: colors[0], cor_secundaria: colors[1] });
    onSuccess();
    onClose();
  }, 'Não foi possível salvar as cores. Tente de novo.');

  useEffect(() => {
    if (!isOpen || !season) return;
    setColors(clubColors(season));
    setError('');
  }, [isOpen, season, setError]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={submit}
      title="Cores do clube"
      subtitle="Valem para todas as temporadas com este clube."
      icon={<Crest name={season?.clube_nome} colors={colors} className="h-14 w-12 shrink-0" />}
    >
      <ColorFields value={colors} onChange={setColors} />
      <div className="mt-5"><FormError>{error}</FormError></div>
      <ModalActions submitLabel="Salvar cores" busy={busy} onCancel={onClose} />
    </Modal>
  );
}
