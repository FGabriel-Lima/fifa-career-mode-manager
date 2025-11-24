const express = require('express');
const router = express.Router();
const {
  adicionarTitulo,
  listarTitulos,
  inicializarPremio,
  adicionarCandidato,
  calcularVencedor
} = require('../controllers/awardController');

const { protect } = require('../middleware/authMiddleware');

router.use(protect);

// --- ROTAS DE TÍTULOS (Gabinete) ---
router.post('/titulos', adicionarTitulo);
router.get('/titulos/:temporadaId', listarTitulos);

// --- ROTAS DE MELHOR DO MUNDO ---
router.post('/melhor-do-mundo/init', inicializarPremio);

router.post('/candidato', adicionarCandidato);

router.post('/calcular/:premioId', calcularVencedor);

module.exports = router;