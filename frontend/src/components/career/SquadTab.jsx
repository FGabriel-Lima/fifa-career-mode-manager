import React, { useMemo } from 'react';
import { actionBtn, Empty, Icon, Panel } from './ui';

// Ordem do gol ao ataque; os sinônimos caem na mesma faixa.
export const POSITIONS = ['GOL', 'LD', 'ZAG', 'LE', 'VOL', 'MC', 'MD', 'ME', 'MEI', 'PD', 'PE', 'SA', 'ATA'];
const ORDER = { ...Object.fromEntries(POSITIONS.map((p, i) => [p, i])), ADD: 1, ADE: 3 };
const rank = (pos) => ORDER[(pos || '').toUpperCase().trim()] ?? 99;

const ovrColor = (ovr) => (ovr >= 80 ? 'text-neon' : ovr >= 70 ? 'text-chalk' : 'text-muted');

export function SquadTab({ data, onAddPlayer, onEditPlayer, onRemovePlayer }) {
  const squad = useMemo(
    () =>
      [...(data?.squad || [])].sort(
        (a, b) => rank(a.position) - rank(b.position) || b.overall - a.overall
      ),
    [data?.squad]
  );

  return (
    <Panel
      title={`Elenco · ${squad.length}`}
      action={
        <button type="button" onClick={onAddPlayer} className={actionBtn}>
          <Icon name="person_add" className="text-lg" />
          Adicionar jogador
        </button>
      }
    >
      {squad.length === 0 ? (
        <Empty>Nenhum jogador nesta temporada. Adicione o primeiro para começar o elenco.</Empty>
      ) : (
        <div className="-mx-5 -my-5 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="border-b border-pitch-700/70 text-[11px] uppercase tracking-wider text-muted">
                <th className="px-5 py-3 font-medium">Jogador</th>
                <th className="px-2 py-3 text-center font-medium">Pos</th>
                <th className="px-2 py-3 text-center font-medium">OVR</th>
                <th className="px-2 py-3 text-center font-medium">Idade</th>
                <th className="px-2 py-3 text-center font-medium">Jogos</th>
                <th className="px-2 py-3 text-center font-medium">Gols</th>
                <th className="px-2 py-3 text-center font-medium">Assist.</th>
                <th className="px-5 py-3"><span className="sr-only">Ações</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pitch-700/50">
              {squad.map((p) => (
                <tr key={p.id} className="group transition hover:bg-pitch-800/50">
                  <td className="px-5 py-3 font-medium">{p.name}</td>
                  <td className="px-2 py-3 text-center">
                    <span className="inline-block w-12 rounded bg-pitch-800 py-0.5 text-xs font-semibold text-muted">
                      {p.position}
                    </span>
                  </td>
                  <td className={`px-2 py-3 text-center font-kit text-2xl font-bold ${ovrColor(p.overall)}`}>{p.overall}</td>
                  <td className="px-2 py-3 text-center text-muted">{p.idade}</td>
                  <td className="px-2 py-3 text-center text-muted">{p.jogos_disputados}</td>
                  <td className="px-2 py-3 text-center font-kit text-xl font-bold">{p.gols}</td>
                  <td className="px-2 py-3 text-center font-kit text-xl font-bold">{p.assistencias}</td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
                      <button
                        onClick={() => onEditPlayer(p)}
                        aria-label={`Editar estatísticas de ${p.name}`}
                        title="Editar estatísticas"
                        className="grid h-8 w-8 place-items-center rounded-lg text-muted transition hover:bg-pitch-700 hover:text-chalk"
                      >
                        <Icon name="edit" className="text-lg" />
                      </button>
                      <button
                        onClick={() => onRemovePlayer(p.id)}
                        aria-label={`Remover ${p.name} do elenco`}
                        title="Remover do elenco"
                        className="grid h-8 w-8 place-items-center rounded-lg text-muted transition hover:bg-red-500/15 hover:text-red-300"
                      >
                        <Icon name="person_remove" className="text-lg" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}
