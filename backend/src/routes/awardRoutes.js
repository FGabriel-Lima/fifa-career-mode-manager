const express = require('express');
const router = express.Router();
const {
  adicionarTitulo,
  listarHistoricoTitulos,
  listarTitulos,
  inicializarPremio,
  adicionarCandidato,
  calcularVencedor,
  buscarPremiosClube,
  salvarCampeoesMundo
} = require('../controllers/awardController');

const { protect } = require('../middleware/authMiddleware');

router.use(protect);

// --- ROTAS DE TÍTULOS (Gabinete) ---
router.post('/titulos', adicionarTitulo);
router.get('/titulos/historico/:carreiraId', listarHistoricoTitulos);
router.get('/titulos/:temporadaId', listarTitulos);
router.get('/clube/:temporadaId', buscarPremiosClube);
// Rota para salvar campeões mundiais (competitções que seu time não ganhou)
router.post('/mundo/:temporada_id', salvarCampeoesMundo);

// --- ROTAS DE MELHOR DO MUNDO ---
router.post('/inicializar', inicializarPremio);
router.post('/candidato', adicionarCandidato);
router.post('/calcular/:premioId', calcularVencedor);

module.exports = router;