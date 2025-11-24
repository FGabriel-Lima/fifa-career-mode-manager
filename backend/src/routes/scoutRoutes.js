const express = require('express');
const router = express.Router();
const { adicionarObservacao, listarObservacao, removerObservacao } = require('../controllers/scoutController');

const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', adicionarObservacao);

router.get('/:carreiraId', listarObservacao);

router.delete('/:observacaoId', removerObservacao);

module.exports = router;