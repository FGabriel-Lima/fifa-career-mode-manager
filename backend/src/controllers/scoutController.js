const prisma = require('../prismaClient');

const adicionarObservacao = async (req, res) => {
  console.log("--- DEBUG CONTROLLER ---");
  console.log("Tem User?", !!req.user); // Vai imprimir true ou false
  console.log("Conteúdo de req.user:", req.user);
  try {
    const {
      carreira_id, 
      nome_jogador,
      clube_atual,
      posicao,
      notas,
      idade_aprox
    } = req.body;

    const usuarioId = req.user.id;

    if( !carreira_id || !nome_jogador) {
      return res.status(400).json({ error: 'carreira_id e nome_jogador são obrigatórios' });
    }

    const carreira = await prisma.carreiras.findFirst({
      where: {
        id: parseInt(carreira_id),
        usuario_id: usuarioId
      },
    });

    if (!carreira) {
      return res.status(404).json({ error: 'Carreira não encontrada para o usuário autenticado' });
    }

    const novaObservacao = await prisma.observacao.create({
      data: {
        carreira_id: parseInt(carreira_id),
        nome_jogador,
        clube_atual,
        idade_aprox: idade_aprox ? parseInt(idade_aprox) : null,
        posicao,
        notas,
      },
    });

    res.status(201).json(novaObservacao);

  }catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao adicionar observação' });
  }
};

const listarObservacao = async (req, res) => {
  try {
    const {carreiraId} = req.params;
    const usuarioId = req.user.id;

    const carreira = await prisma.carreiras.findFirst({
      where: {
        id: parseInt(carreiraId),
        usuario_id: usuarioId,
      },
    });

    if (!carreira) {
      return res.status(404).json({ error: 'Carreira não encontrada para o usuário autenticado' });
    }

    const lista = await prisma.observacao.findMany({
      where: {
        carreira_id: parseInt(carreiraId),
      },
      orderBy: {
        id: 'desc',

      },
    });

    res.status(200).json(lista);

  }catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao listar observações' });
  }
};

const removerObservacao = async (req, res) => {
  try {
    const {observacaoId} = req.params;
    const usuarioId = req.user.id;

    const observacao = await prisma.observacao.findFirst({
      where: {
        id: parseInt(observacaoId),
        carreira: {
          usuario_id: usuarioId,
        },
      },
    });

    if (!observacao) {
      return res.status(404).json({ error: 'Observação não encontrada para o usuário autenticado' });
    }

    await prisma.observacao.delete({
      where: {
        id: parseInt(observacaoId),
      },
    });

    res.status(200).json({ message: 'Observação removida com sucesso' });

  }catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao remover observação' });
  }
};

module.exports = {
  adicionarObservacao,
  listarObservacao,
  removerObservacao,
};