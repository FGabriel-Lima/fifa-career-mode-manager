import React from 'react';

// Cores de camisa: o clube sempre cai no mesmo par, escolhido pelo próprio nome.
const KITS = [
  ['#0f0f0f', '#f5f5f5'], // preto e branco
  ['#1d4ed8', '#f8fafc'], // azul e branco
  ['#b91c1c', '#111111'], // vermelho e preto
  ['#15803d', '#f8fafc'], // verde e branco
  ['#c2410c', '#1c1917'], // laranja e preto
  ['#6d28d9', '#f5f3ff'], // roxo e branco
  ['#0e7490', '#fde047'], // azul-petróleo e amarelo
  ['#9f1239', '#fef3c7'], // grená e creme
  ['#111827', '#f59e0b'], // preto e amarelo
  ['#1e3a8a', '#dc2626'], // azul e vermelho
  ['#f8fafc', '#111111'], // branco e preto
  ['#065f46', '#facc15'], // verde e amarelo
];

export function kitFor(name = '') {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return KITS[hash % KITS.length];
}

// "Quixadá FC" -> "QU", "Ceará" -> "CE", "Real Madrid" -> "RM" (ignora FC, SC, de...).
export function initialsFor(name = '') {
  const words = name
    .split(/\s+/)
    .filter((w) => w && !/^(fc|sc|ec|ac|cf|clube|de|do|da)$/i.test(w));
  if (words.length === 0) return '?';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

function Crest({ name, className = '' }) {
  const [primary, secondary] = kitFor(name);
  return (
    <svg viewBox="0 0 40 46" className={className} aria-hidden="true">
      <path d="M20 1 L38 7 V22 C38 33 30 41 20 45 C10 41 2 33 2 22 V7 Z" fill={primary} stroke={secondary} strokeWidth="2" />
      <path d="M2 16 H38" stroke={secondary} strokeWidth="1.2" strokeOpacity="0.5" />
      <text
        x="20"
        y="32"
        textAnchor="middle"
        fontFamily="'Barlow Condensed', sans-serif"
        fontWeight="700"
        fontSize="15"
        fill={secondary}
      >
        {initialsFor(name)}
      </text>
    </svg>
  );
}

export default Crest;
