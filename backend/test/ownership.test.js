// Garante que rotas com ID de outro usuário respondem 404 sem ler/gravar dados.
// Roda com: node --test backend/test
const test = require('node:test');
const assert = require('node:assert');
const path = require('path');

const calls = [];
const fakePrisma = new Proxy({}, {
  get: (_, model) => new Proxy({}, {
    get: (_, op) => async () => {
      calls.push(`${model}.${op}`);
      return op === 'findFirst' ? null : [];
    },
  }),
});
require.cache[path.resolve(__dirname, '../src/prismaClient.js')] = { exports: fakePrisma };

const award = require('../src/controllers/awardController');
const career = require('../src/controllers/careerController');
const player = require('../src/controllers/playerController');

const call = async (handler, params = {}, body = {}) => {
  const res = { code: 200, status(c) { this.code = c; return this; }, json() { return this; } };
  await handler({ params, body, query: {}, user: { id: 1 } }, res);
  return res.code;
};

const cases = {
  listarHistoricoTitulos: [award.listarHistoricoTitulos, { carreiraId: 9 }],
  listarTitulos: [award.listarTitulos, { temporadaId: 9 }],
  buscarPremiosClube: [award.buscarPremiosClube, { temporadaId: 9 }],
  salvarCampeoesMundo: [award.salvarCampeoesMundo, { temporada_id: 9 }, { campeoes: [{}] }],
  inicializarPremio: [award.inicializarPremio, {}, { temporada_id: 9 }],
  adicionarCandidato: [award.adicionarCandidato, {}, { premio_id: 9, titulos: {} }],
  calcularVencedor: [award.calcularVencedor, { premioId: 9 }],
  obterHallDaFama: [career.obterHallDaFama, { id: 9 }],
  atualizarClassificacao: [career.atualizarClassificacao, { temporada_id: 9 }],
  avancarTemporada: [career.avancarTemporada, { carreira_id: 9, temporada_anterior_id: 9 }],
  atualizarDadosElenco: [player.atualizarDadosElenco, { id: 9 }],
  removerDoElenco: [player.removerDoElenco, { id: 9 }],
  criarJogador: [player.criarJogador, { carreira_id: 9, temporada_id: 9 }, { nome_completo: 'X', posicao: 'ATA' }],
};

for (const [name, [handler, params, body]] of Object.entries(cases)) {
  test(`${name} bloqueia recurso de outro usuário`, async () => {
    calls.length = 0;
    assert.strictEqual(await call(handler, params, body), 404);
    assert.deepStrictEqual(calls.filter((c) => !c.endsWith('.findFirst')), []);
  });
}
