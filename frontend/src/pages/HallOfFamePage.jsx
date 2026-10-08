import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { clubColors } from '../components/Crest';
import { BOARDS, rankBy } from '../components/career/HallOfFame';
import { Icon } from '../components/career/ui';

const surname = (name = '') => name.trim().split(/\s+/).pop().toUpperCase().slice(0, 12);

// Camisa "aposentada": o recorde do líder vira o número nas costas, nas cores do clube.
function Jersey({ player, value, colors: [primary, secondary] }) {
  return (
    <svg viewBox="0 0 120 116" className="h-40 w-40" role="img" aria-label={`${player.nome_completo}: ${value}`}>
      <path
        d="M40 6 L20 12 L4 34 L19 47 L28 40 V110 H92 V40 L101 47 L116 34 L100 12 L80 6 C76 13 69 17 60 17 C51 17 44 13 40 6 Z"
        fill={primary}
        stroke={secondary}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <g fontFamily="'Barlow Condensed', sans-serif" fontWeight="700" fill={secondary} textAnchor="middle">
        <text x="60" y="40" fontSize="11" letterSpacing="1.5">{surname(player.nome_completo)}</text>
        <text x="60" y="94" fontSize="48">{value}</text>
      </g>
    </svg>
  );
}

function Board({ ranking, field, title, unit, colors }) {
  const [leader, ...rest] = rankBy(ranking, field, 15);

  return (
    <section className="rounded-xl border border-pitch-700/70 bg-pitch-900">
      <h2 className="border-b border-pitch-700/70 px-5 py-4 font-kit text-2xl font-bold uppercase tracking-wide">
        {title}
      </h2>

      {!leader ? (
        <p className="px-5 py-10 text-center text-sm text-muted">Ninguém pontuou aqui ainda.</p>
      ) : (
        <>
          <figure className="flex flex-col items-center px-5 pb-6 pt-8 text-center">
            <Jersey player={leader} value={leader[field]} colors={colors} />
            <figcaption className="mt-4">
              <p className="text-lg font-semibold">{leader.nome_completo}</p>
              <p className="text-sm text-muted">
                {leader[field]} {unit}
                {field !== 'total_jogos' && ` em ${leader.total_jogos} jogos`}
              </p>
            </figcaption>
          </figure>

          {rest.length > 0 && (
            <ol className="divide-y divide-pitch-700/50 border-t border-pitch-700/70">
              {rest.map((p, idx) => (
                <li key={p.id} className="flex items-center gap-4 px-5 py-3">
                  <span className="w-6 text-right font-kit text-xl font-bold text-muted">{idx + 2}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate">{p.nome_completo}</span>
                    <span className="text-xs uppercase tracking-wider text-muted">{p.posicao}</span>
                  </span>
                  <span className="font-kit text-2xl font-bold text-neon">{p[field]}</span>
                </li>
              ))}
            </ol>
          )}
        </>
      )}
    </section>
  );
}

export default function HallOfFamePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jogadores, setJogadores] = useState([]);
  const [temporada, setTemporada] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasToken = Boolean(localStorage.getItem('token'));

  useEffect(() => {
    if (!hasToken) return;
    Promise.all([api.get(`/carreiras/${id}/hall-of-fame?limit=100`), api.get(`/carreiras/${id}`)])
      .then(([ranking, carreira]) => {
        setJogadores(ranking.data);
        setTemporada(carreira.data.temporadas?.[0] || null);
      })
      .catch((err) => {
        if (err.response?.status === 401) navigate('/');
      })
      .finally(() => setLoading(false));
  }, [id, hasToken, navigate]);

  if (!hasToken) return <Navigate to="/" replace />;

  const colors = clubColors(temporada);
  const clube = temporada?.clube_nome || '';

  return (
    <div className="min-h-screen bg-pitch-950 font-display text-chalk">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-8 sm:py-14">
        <button
          onClick={() => navigate(`/career/${id}`)}
          className="flex items-center gap-1 text-sm font-semibold text-muted transition hover:text-neon"
        >
          <Icon name="arrow_back" className="text-lg" />
          Voltar para a carreira
        </button>

        <p className="mt-8 text-sm font-semibold uppercase tracking-widest text-neon">Galeria de lendas</p>
        <h1 className="mt-1 font-kit text-5xl font-bold uppercase leading-none tracking-tight sm:text-6xl">
          {clube ? `Lendas do ${clube}` : 'Lendas do clube'}
        </h1>
        <p className="mt-3 max-w-xl text-muted">Números somados de todas as temporadas da carreira.</p>

        {loading ? (
          <p className="mt-10 text-muted">Carregando a galeria…</p>
        ) : (
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {BOARDS.map((board) => (
              <Board key={board.field} ranking={jogadores} colors={colors} {...board} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
