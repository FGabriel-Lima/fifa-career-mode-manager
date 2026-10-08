import React from 'react';
import Crest from '../Crest';
import { actionBtn, Empty, Icon, Panel } from './ui';

const clean = (str) => (str ? str.toString().toLowerCase().trim() : '');

function AddButton({ onClick, children }) {
  return (
    <button type="button" onClick={onClick} className={actionBtn}>
      <Icon name="add" className="text-lg" />
      {children}
    </button>
  );
}

export function TrophiesTab({ data, onAddTitle, onAddWorldTitle, onAddCandidate, onCalculateWinner }) {
  const allTrophies = data?.trophies || [];
  const individualAwards = data?.individualAwards || [];
  const myClub = clean(data?.clube_nome);
  const myTrophies = allTrophies.filter((t) => clean(t.clube_vencedor) === myClub);
  const worldTrophies = allTrophies.filter((t) => clean(t.clube_vencedor) !== myClub);
  const ballonDor = data?.ballonDor || { winner: null, finalists: [] };

  return (
    <div className="space-y-6">
      <Panel title="Sala de troféus" action={<AddButton onClick={onAddTitle}>Adicionar título</AddButton>}>
        {myTrophies.length === 0 ? (
          <Empty>Nenhum título nesta temporada ainda.</Empty>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {myTrophies.map((t) => (
              <li key={t.id} className="flex items-center gap-3 rounded-lg border border-gold/30 bg-gold/5 p-3">
                <Icon name="emoji_events" className="text-3xl text-gold" />
                <div className="min-w-0">
                  <p className="truncate font-kit text-xl font-bold uppercase leading-tight">{t.nome_titulo}</p>
                  <p className="text-xs text-muted">{t.temporada?.nome || data?.nome}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel title="Bola de Ouro" action={<AddButton onClick={onAddCandidate}>Adicionar candidato</AddButton>}>
        {ballonDor.winner ? (
          <div className="flex items-center gap-5 rounded-lg border border-gold/30 bg-gold/5 p-5">
            <Crest name={ballonDor.winner.club} className="h-20 w-[4.5rem] shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-wider text-gold">Vencedor</p>
              <p className="font-kit text-4xl font-bold uppercase leading-none text-gold">{ballonDor.winner.name}</p>
              <p className="mt-1 text-sm text-muted">{ballonDor.winner.club}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted">
            {ballonDor.finalists.length
              ? 'Candidatos registrados. Calcule para revelar o vencedor.'
              : 'Adicione os candidatos da temporada para disputar o prêmio.'}
          </p>
        )}

        {ballonDor.finalists.length > 0 && (
          <>
            <h3 className="mt-6 text-[11px] uppercase tracking-wider text-muted">Candidatos</h3>
            <ul className="mt-2 divide-y divide-pitch-700/50">
              {ballonDor.finalists.map((f) => (
                <li key={`${f.name}-${f.club}`} className="flex items-center justify-between gap-4 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{f.name}</p>
                    <p className="truncate text-xs text-muted">{f.club}</p>
                  </div>
                  <p className="shrink-0 text-sm text-muted">
                    <span className="font-kit text-xl font-bold text-chalk">{f.goals}</span> gols na Champions
                  </p>
                </li>
              ))}
            </ul>
          </>
        )}

        {!ballonDor.winner && ballonDor.finalists.length > 0 && (
          <button
            type="button"
            onClick={onCalculateWinner}
            className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-gold font-bold text-pitch-950 transition hover:brightness-110"
          >
            <Icon name="calculate" className="text-xl" />
            Calcular vencedor
          </button>
        )}
      </Panel>

      <Panel title="Prêmios do clube">
        {individualAwards.length === 0 ? (
          <Empty>Atualize gols e assistências do elenco para ver o artilheiro e o garçom.</Empty>
        ) : (
          <ul className="-my-3 divide-y divide-pitch-700/50">
            {individualAwards.map((a) => (
              <li key={a.award} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-muted">{a.award}</p>
                  <p className="font-medium">{a.player}</p>
                </div>
                <p className="font-kit text-2xl font-bold text-neon">{a.stats}</p>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel title="Campeões pelo mundo" action={<AddButton onClick={onAddWorldTitle}>Registrar campeão</AddButton>}>
        {worldTrophies.length === 0 ? (
          <Empty>Registre quem venceu as outras competições da temporada.</Empty>
        ) : (
          <ul className="-my-3 divide-y divide-pitch-700/50">
            {worldTrophies.map((t) => (
              <li key={t.id} className="flex items-center gap-4 py-3">
                <Crest name={t.clube_vencedor} className="h-11 w-10 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-wider text-muted">{t.nome_titulo}</p>
                  <p className="truncate font-kit text-xl font-bold uppercase leading-tight">{t.clube_vencedor}</p>
                  {t.clube_vice && <p className="truncate text-xs text-muted">Vice: {t.clube_vice}</p>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
