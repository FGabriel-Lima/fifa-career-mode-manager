import React from 'react';

// Duas cores do uniforme com o seletor nativo do navegador. value/onChange: [principal, secundária].
function ColorFields({ value, onChange }) {
  const [primary, secondary] = value;
  const field = (label, color, set) => (
    <label className="flex flex-1 items-center gap-3 rounded-lg border border-pitch-700 bg-pitch-950 p-2 pr-4 transition focus-within:border-neon focus-within:ring-2 focus-within:ring-neon/30">
      <input
        type="color"
        value={color}
        onChange={(e) => set(e.target.value)}
        className="h-9 w-12 shrink-0 cursor-pointer rounded border-0 bg-transparent p-0"
      />
      <span className="text-sm">
        <span className="block font-medium text-chalk">{label}</span>
        <span className="font-mono text-xs uppercase text-muted">{color}</span>
      </span>
    </label>
  );

  return (
    <fieldset>
      <legend className="text-sm font-medium text-muted">Cores do uniforme</legend>
      <div className="mt-2 flex gap-3">
        {field('Principal', primary, (c) => onChange([c, secondary]))}
        {field('Detalhes', secondary, (c) => onChange([primary, c]))}
      </div>
    </fieldset>
  );
}

export default ColorFields;
