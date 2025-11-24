const prisma = require('../prismaClient');

const criarTransferencia = async (req, res) => {
  try {
    const {
      temporada_id,
      tipo_transferencia,
      valor_transferencia,
      jogador_id,
      nome_jogador_externo,
      time_origem,
      time_destino,
    } = req.body;

    const usuarioId = req.user.id;
    const tempIdNum = parseInt(temporada_id);

    // Validação
    if (!tempIdNum || isNaN(tempIdNum)) {
      return res.status(400).json({ error: 'temporada_id é obrigatório e deve ser um número.' });
    }
    if (!tipo_transferencia || valor_transferencia == undefined){
      return res.status(400).json({ error: 'Os campos tipo_transferencia e valor_transferencia são obrigatórios.' });
    }

    const temporada = await prisma.temporadas.findFirst({
      where: {
        id: tempIdNum,
        carreira: {
          usuario_id: usuarioId,
        },
      },
    });

    if (!temporada) {
      return res.status(404).json({ error: 'Temporada não encontrada para o usuário logado.' });
    }

    const novaTransferencia = await prisma.transferencias.create({
      data: {
        temporada_id: tempIdNum,
        tipo_transferencia,
        valor_transferencia,
        jogador_id: jogador_id ? parseInt(jogador_id) : null,
        nome_jogador_externo,
        time_origem,
        time_destino,
      },
    });

    res.status(201).json(novaTransferencia);

  }catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao processar transferência.' });
  }
};

const listarTransferenciasDaTemporada = async (req, res) => {
  try {
    const { temporadaId } = req.params;
    const usuarioId = req.user.id;


    // Validação Robusta
    if (!temporadaId) {
      return res.status(400).json({ error: "ID da temporada não foi enviado na URL." });
    }
    const idNumerico = parseInt(temporadaId);
    if (isNaN(idNumerico)) {
      return res.status(400).json({ error: "ID da temporada inválido, não é um número." });
    }

    const temporada = await prisma.temporadas.findFirst({
      where: {
        id: idNumerico,
        carreira: {
          usuario_id: usuarioId, 
        },
      },
    });

    if (!temporada) {
      return res.status(404).json({ error: 'Temporada não encontrada para o usuário logado.' });
    }

    const transferencias = await prisma.transferencias.findMany({
      where: {
        temporada_id: idNumerico,
      },
      orderBy: {
        data_transferencia: 'desc',
      },
    });

    res.status(200).json(transferencias);

  }catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao listar transferências da temporada.' });
  }
};

module.exports = {
  criarTransferencia,
  listarTransferenciasDaTemporada,
};