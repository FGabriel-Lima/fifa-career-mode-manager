// Buscas que só retornam o registro se ele pertencer ao usuário logado.
const prisma = require('./prismaClient');

const doUsuario = (usuarioId) => ({ carreira: { usuario_id: usuarioId } });

const carreiraDoUsuario = (id, usuarioId) =>
  prisma.carreiras.findFirst({ where: { id: parseInt(id), usuario_id: usuarioId } });

const temporadaDoUsuario = (id, usuarioId) =>
  prisma.temporadas.findFirst({ where: { id: parseInt(id), ...doUsuario(usuarioId) } });

const premioDoUsuario = (id, usuarioId) =>
  prisma.premios_temporada.findFirst({ where: { id: parseInt(id), temporada: doUsuario(usuarioId) } });

const elencoDoUsuario = (id, usuarioId) =>
  prisma.elenco_temporada.findFirst({ where: { id: parseInt(id), temporada: doUsuario(usuarioId) } });

module.exports = { carreiraDoUsuario, temporadaDoUsuario, premioDoUsuario, elencoDoUsuario };
