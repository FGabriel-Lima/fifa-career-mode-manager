const express = require('express');
const router = express.Router();
const { criarJogador, listarJogadoresDaCarreira } = require('../controllers/playerController');

const { protect } = require('../middleware/authMiddleware');

// Aplicando o middleware de autenticação a todas as rotas deste arquivo
router.use(protect);

router.post('/', criarJogador);
router.get('/:carreiraId', listarJogadoresDaCarreira);

module.exports = router;