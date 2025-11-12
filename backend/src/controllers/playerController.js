const prisma = require('../prismaClient');

const criarJogador = async (req, res) =>{
  try{
    const {nome_completo, posicao, nacionalidade, carreira_id} = req.body;

    const usuarioId = req.user.id;

    if(!nome_completo || !posicao || !carreira_id){
      return res.status(400).json({error: 'Os campos nome completo, posição e carreira são obrigatórios.'});
    }

    const carreira = await prisma.carreiras.findUnique({
      where: {
        id: parseInt(carreira_id),
        usuario_id: usuarioId
      },
    });

    if(!carreira){
      return res.status(404).json({error: 'Carreira não encontrada para o usuário logado.'});
    }

    const novoJogador = await prisma.jogadores.create({
      data: {
        nome_completo,
        posicao,
        nacionalidade,
        carreira_id: parseInt(carreira_id),
      },
    });

    res.status(201).json(novoJogador);
  }catch(error){
    console.error(error);
    res.status(500).json({error: 'Erro ao criar jogador.'});
  }
};

const listarJogadoresDaCarreira = async (req, res) =>{
  try {
    const {carreiraId} = req.params;
    const usuarioId = req.user.id;

    const carreira = await prisma.carreiras.findFirst({
      where: {
        id: parseInt(carreiraId),
        usuario_id: usuarioId
      },
    });
    if(!carreira){
      return res.status(404).json({error: 'Carreira não encontrada para o usuário logado.'});
    }

    const jogadores = await prisma.jogadores.findMany({
      where: {
        carreira_id: parseInt(carreiraId),
      },
    });

    res.status(200).json(jogadores);
  }catch (error) {
    console.error(error);
    res.status(500).json({error: 'Erro ao listar jogadores da carreira.'});
  }
};

const atualizarJogador = async (req, res) => {
  try{
    const {jogadorId } = req.params;
    const {nome_completo, posicao, nacionalidade} = req.body;
    const usuarioId = req.user.id;

    const jogador = await prisma.jogadores.findFirst({
      where: {
        id: parseInt(jogadorId),
        carreira: {
          usuario_id: usuarioId
        },
      },
    });

    if(!jogador){
      return res.status(404).json({error: 'Jogador não encontrado para o usuário logado.'});
    }

    const jogadorAtualizado = await prisma.jogadores.update({
      where: {
        id: parseInt(jogadorId),
      },
      data: {
        nome_completo,
        posicao,
        nacionalidade,
      },
    });

    res.status(200).json(jogadorAtualizado);

  }catch(error){
    console.error(error);
    res.status(500).json({error: 'Erro ao atualizar jogador.'});
  }
};

const deletarJogador = async (req, res) => {
  try{
    const {jogadorId } = req.params;
    const usuarioId = req.user.id;

    const jogador = await prisma.jogadores.findFirst({
      where: {
        id: parseInt(jogadorId),
        carreira: {
          usuario_id: usuarioId,
        },
      },
    });

    if(!jogador){
      return res.status(404).json({error: 'Jogador não encontrado para o usuário logado.'});
    }

    await prisma.jogadores.delete({
      where: {
        id: parseInt(jogadorId),
      },
    });

    res.status(200).json({mensagem: 'Jogador deletado com sucesso.'});

  }catch(error){
    console.error(error);
    res.status(500).json({error: 'Erro ao deletar jogador.'});
  }
};

module.exports = {
  criarJogador,
  listarJogadoresDaCarreira,
  atualizarJogador,
  deletarJogador,
};