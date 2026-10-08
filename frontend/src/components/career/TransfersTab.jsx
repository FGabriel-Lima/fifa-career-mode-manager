import React from 'react';
import { money, shortDate } from '../../format';
import { actionBtn, Empty, Icon, Panel } from './ui';

const total = (list) => list.reduce((s, t) => s + Number(t.valor_transferencia || 0), 0);

function TransferList({ items, clubLabel, clubField, empty }) {
  if (items.length === 0) return <Empty>{empty}</Empty>;
  return (
    <ul className="-my-3 divide-y divide-pitch-700/50">
      {items.map((t) => (
        <li key={t.id} className="flex items-center justify-between gap-4 py-3">
          <div className="min-w-0">
            <p className="truncate font-medium">{t.nome_jogador_externo || 'Jogador sem nome'}</p>
            <p className="truncate text-sm text-muted">
              {clubLabel} {t[clubField] || '—'} · {shortDate(t.data_transferencia)}
            </p>
          </div>
          <p className="shrink-0 font-kit text-2xl font-bold text-gold">{money(t.valor_transferencia)}</p>
        </li>
      ))}
    </ul>
  );
}

export function TransfersTab({ data, onAddTransfer }) {
  const compras = data?.transfers?.in || [];
  const vendas = data?.transfers?.out || [];
  const gasto = total(compras);
  const arrecadado = total(vendas);
  const saldo = arrecadado - gasto;

  const summary = [
    { label: 'Gasto', value: money(gasto) },
    { label: 'Arrecadado', value: money(arrecadado) },
    { label: 'Saldo', value: money(saldo), className: saldo >= 0 ? 'text-neon' : 'text-red-300' },
  ];

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-xl border border-pitch-700/70 bg-pitch-900 p-5 sm:flex-row sm:items-center sm:justify-between">
        <dl className="grid flex-1 grid-cols-3 gap-4">
          {summary.map((s) => (
            <div key={s.label}>
              <dt className="text-[11px] uppercase tracking-wider text-muted">{s.label}</dt>
              <dd className={`font-kit text-2xl font-bold sm:text-3xl ${s.className || ''}`}>{s.value}</dd>
            </div>
          ))}
        </dl>
        <button type="button" onClick={onAddTransfer} className={actionBtn}>
          <Icon name="add" className="text-lg" />
          Registrar transferência
        </button>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title={`Contratações · ${compras.length}`}>
          <TransferList items={compras} clubLabel="de" clubField="time_origem" empty="Nenhuma contratação nesta temporada." />
        </Panel>
        <Panel title={`Vendas · ${vendas.length}`}>
          <TransferList items={vendas} clubLabel="para" clubField="time_destino" empty="Nenhuma venda nesta temporada." />
        </Panel>
      </div>
    </div>
  );
}
