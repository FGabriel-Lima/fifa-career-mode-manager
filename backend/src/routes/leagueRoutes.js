const express = require('express');
const router = express.Router();
const {
  criarLiga,
  listarLigasDaTemporada,
  adicionarTimeNaLiga,
  verTabelaLiga
} = require('../controllers/leagueController');

const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', criarLiga);

router.get('/temporada/:temporadaId', listarLigasDaTemporada);

router.post('/time', adicionarTimeNaLiga);

router.get('/:ligaId', verTabelaLiga);

module.exports = router;