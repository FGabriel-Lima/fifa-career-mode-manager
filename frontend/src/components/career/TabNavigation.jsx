import React from 'react';
import { Icon } from './ui';

const TABS = [
  { id: 'overview', label: 'Visão geral', icon: 'dashboard' },
  { id: 'squad', label: 'Elenco', icon: 'groups' },
  { id: 'transfers', label: 'Transferências', icon: 'swap_horiz' },
  { id: 'trophies', label: 'Almanaque', icon: 'emoji_events' },
];

export function TabNavigation({ activeTab, onTabChange }) {
  return (
    <div role="tablist" className="flex gap-1 overflow-x-auto border-b border-pitch-700/70">
      {TABS.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active}
            onClick={() => onTabChange(tab.id)}
            className={`-mb-px flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
              active ? 'border-neon text-chalk' : 'border-transparent text-muted hover:text-chalk'
            }`}
          >
            <Icon name={tab.icon} className={`text-xl ${active ? 'text-neon' : ''}`} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
