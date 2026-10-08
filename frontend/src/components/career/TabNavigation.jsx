import React from 'react';
import { LayoutDashboard, Users, ArrowLeftRight, Award } from 'lucide-react';


export function TabNavigation({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'squad', label: 'Elenco', icon: Users },
    { id: 'transfers', label: 'Transferências', icon: ArrowLeftRight },
    { id: 'trophies', label: 'Almanaque', icon: Award },
  ];

  return (
    <div className="flex gap-2 mt-6 border-b border-[#11d411]/20">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-t-xl font-medium transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-[#11d411] text-[#102210] shadow-lg shadow-[#11d411]/50'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white hover:shadow-md hover:shadow-[#11d411]/30'
            }`}
          >
            <Icon className="w-5 h-5" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
