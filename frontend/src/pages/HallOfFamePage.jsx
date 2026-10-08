import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Target, TrendingUp, ArrowLeft, Trophy, Activity } from 'lucide-react';

export default function HallOfFamePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jogadores, setJogadores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFullHall = async () => {
      try {
        const res = await api.get(`/carreiras/${id}/hall-of-fame?limit=100`);
        setJogadores(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFullHall();
  }, [id]);

  // Lógica de Ordenação
  const artilheiros = [...jogadores].sort((a, b) => b.total_gols - a.total_gols).slice(0, 15);
  const garcons = [...jogadores].sort((a, b) => b.total_assistencias - a.total_assistencias).slice(0, 15);
  const veteranos = [...jogadores].sort((a, b) => b.total_jogos - a.total_jogos).slice(0, 15);

  if (loading) return <div className="p-10 text-white font-black italic">Carregando Galeria Histórica...</div>;

  return (
    <div className="min-h-screen bg-[#050a05] text-white p-4 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header de Navegação */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/30 hover:text-[#11d411] transition-all mb-10 font-black uppercase text-[10px] tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Dashboard
        </button>

        <header className="mb-16">
          <h1 className="text-6xl font-black uppercase italic tracking-tighter leading-none mb-4">Galeria de Lendas</h1>
          <div className="h-1 w-24 bg-[#11d411]" />
        </header>

        {/* GRID DE TABELAS */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* TABELA 1: ARTILHEIROS (VERDE) */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 px-2">
              <div className="p-2 bg-[#11d411]/20 rounded-lg">
                <Target className="text-[#11d411] w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black uppercase italic tracking-tight">Maiores Artilheiros</h2>
            </div>

            <div className="bg-[#0d1a0d] border border-[#11d411]/20 rounded-3xl overflow-hidden shadow-2xl shadow-[#11d411]/5">
              <table className="w-full">
                <thead className="bg-[#11d411]/10 border-b border-[#11d411]/20">
                  <tr>
                    <th className="p-5 text-[#11d411] uppercase text-[10px] font-black tracking-widest text-center w-16">#</th>
                    <th className="p-5 text-[#11d411] uppercase text-[10px] font-black tracking-widest text-left">Atleta</th>
                    <th className="p-5 text-[#11d411] uppercase text-[10px] font-black tracking-widest text-center">Jogos</th>
                    <th className="p-5 text-[#11d411] uppercase text-[10px] font-black tracking-widest text-center">Gols</th>
                  </tr>
                </thead>
                <tbody>
                  {artilheiros.map((p, idx) => (
                    <tr key={p.id} className="border-b border-white/5 hover:bg-[#11d411]/5 transition-colors group">
                      <td className="p-5 text-center font-black text-white/10 group-hover:text-[#11d411] italic text-xl">
                        {idx + 1}
                      </td>
                      <td className="p-5">
                        <p className="font-black uppercase text-base">{p.nome_completo}</p>
                        <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{p.posicao}</p>
                      </td>
                      <td className="p-5 text-center font-bold text-white/40">{p.total_jogos}</td>
                      <td className="p-5 text-center font-black text-[#11d411] text-2xl italic tracking-tighter">{p.total_gols}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* TABELA 2: GARÇONS (AZUL) */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 px-2">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <TrendingUp className="text-blue-400 w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black uppercase italic tracking-tight text-blue-100">Líderes de Assistências</h2>
            </div>

            <div className="bg-[#0d1a0d] border border-blue-500/20 rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/5">
              <table className="w-full">
                <thead className="bg-blue-500/10 border-b border-blue-500/20">
                  <tr>
                    <th className="p-5 text-blue-400 uppercase text-[10px] font-black tracking-widest text-center w-16">#</th>
                    <th className="p-5 text-blue-400 uppercase text-[10px] font-black tracking-widest text-left">Atleta</th>
                    <th className="p-5 text-blue-400 uppercase text-[10px] font-black tracking-widest text-center">Jogos</th>
                    <th className="p-5 text-blue-400 uppercase text-[10px] font-black tracking-widest text-center">Assists</th>
                  </tr>
                </thead>
                <tbody>
                  {garcons.map((p, idx) => (
                    <tr key={p.id} className="border-b border-white/5 hover:bg-blue-500/5 transition-colors group">
                      <td className="p-5 text-center font-black text-white/10 group-hover:text-blue-400 italic text-xl">
                        {idx + 1}
                      </td>
                      <td className="p-5">
                        <p className="font-black uppercase text-base">{p.nome_completo}</p>
                        <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{p.posicao}</p>
                      </td>
                      <td className="p-5 text-center font-bold text-white/40">{p.total_jogos}</td>
                      <td className="p-5 text-center font-black text-blue-400 text-2xl italic tracking-tighter">{p.total_assistencias}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>


          <section className="space-y-6">
    <div className="flex items-center gap-3 px-2">
      <div className="p-2 bg-purple-500/20 rounded-lg">
        <Activity className="text-purple-400 w-6 h-6" />
      </div>
      <h2 className="text-2xl font-black uppercase italic tracking-tight text-purple-100">Presença em Campo</h2>
    </div>

    <div className="bg-[#0d1a0d] border border-purple-500/20 rounded-3xl overflow-hidden shadow-2xl shadow-purple-500/5">
      <table className="w-full">
        <thead className="bg-purple-500/10 border-b border-purple-500/20">
          <tr>
            <th className="p-5 text-purple-400 uppercase text-[10px] font-black tracking-widest text-center w-16">#</th>
            <th className="p-5 text-purple-400 uppercase text-[10px] font-black tracking-widest text-left">Atleta</th>
            <th className="p-5 text-purple-400 uppercase text-[10px] font-black tracking-widest text-center">Total Partidas</th>
          </tr>
        </thead>
        <tbody>
          {veteranos.map((p, idx) => (
            <tr key={p.id} className="border-b border-white/5 hover:bg-purple-500/5 transition-colors group">
              <td className="p-5 text-center font-black text-white/10 group-hover:text-purple-400 italic text-xl">
                {idx + 1}
              </td>
              <td className="p-5">
                <p className="font-black uppercase text-base">{p.nome_completo}</p>
                <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{p.posicao}</p>
              </td>
              <td className="p-5 text-center font-black text-purple-400 text-2xl italic tracking-tighter">
                {p.total_jogos}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>

        </div>
      </div>
    </div>
  );
}