// backend/src/routes/playerRoutes.js

const express = require('express');
const router = express.Router();
const { 
  criarJogador, 
  listarJogadoresDaCarreira, 
  atualizarJogador, 
  deletarJogador, 
  atualizarDadosElenco, 
  removerDoElenco // Adicione esta importação
} = require('../controllers/playerController');

const { protect } = require('../middleware/authMiddleware');

router.use(protect);

// 1. ROTAS ESPECÍFICAS PRIMEIRO (Evita o 404/Conflito)
router.put('/elenco/:id', atualizarDadosElenco);
router.delete('/elenco/:id', removerDoElenco); // Rota que faltava para o onRemovePlayer

// 2. ROTAS COM PARÂMETROS GENÉRICOS DEPOIS
// Ajuste na rota de POST para aceitar os params que o seu controller espera
router.post('/:carreira_id/:temporada_id', criarJogador); 

router.get('/:carreiraId', listarJogadoresDaCarreira);
router.put('/:jogadorId', atualizarJogador);
router.delete('/:jogadorId', deletarJogador); 

module.exports = router;