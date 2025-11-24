const express = require('express');
const router = express.Router();
const { criarTransferencia, listarTransferenciasDaTemporada } = require('../controllers/transferController');
const {protect} = require('../middleware/authMiddleware')

router.use(protect);

router.post('/', criarTransferencia);
router.get('/:temporadaId', listarTransferenciasDaTemporada);

module.exports = router;