const express = require('express');
const router = express.Router();
const { criarCarreira, listarCarreiras, obterHallDaFama, buscarCarreiraPorId, atualizarClassificacao, deletarCarreira, avancarTemporada, atualizarCores } = require('../controllers/careerController');
const playerController = require('../controllers/playerController');
const transferController = require('../controllers/transferController');

// Importando o middleware de autenticação
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, criarCarreira);
router.get('/', protect, listarCarreiras);
router.get('/:id/hall-of-fame', protect, obterHallDaFama);
router.get('/:id', protect, buscarCarreiraPorId);
router.post('/:carreira_id/temporadas/:temporada_id/jogadores', protect, playerController.criarJogador);
router.put('/temporadas/:temporada_id/classificacao', protect, atualizarClassificacao);
router.put('/temporadas/:temporada_id/cores', protect, atualizarCores);
router.post('/temporadas/:temporada_id/transferencias', protect, transferController.criarTransferencia);
router.delete('/:id', protect, deletarCarreira);
router.put('/elenco/:id', protect, playerController.atualizarDadosElenco);
router.delete('/elenco/:id', protect, playerController.removerDoElenco);
router.post('/:carreira_id/avancar/:temporada_anterior_id', protect, avancarTemporada);
module.exports = router;