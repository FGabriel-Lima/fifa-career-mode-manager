const express = require('express');
const router = express.Router();
const { criarCarreira, listarCarreiras } = require('../controllers/careerController');

// Importando o middleware de autenticação
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, criarCarreira);
router.get('/', protect, listarCarreiras);

module.exports = router;