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

module.exports = {
  criarJogador,
   listarJogadoresDaCarreira,
};