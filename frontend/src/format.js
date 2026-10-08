const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  notation: 'compact',
  maximumFractionDigits: 1,
});

export const money = (value) => brl.format(Number(value || 0));

export const shortDate = (value) => (value ? new Date(value).toLocaleDateString('pt-BR') : '—');
