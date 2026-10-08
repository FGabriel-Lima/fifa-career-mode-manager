const prisma = require('../prismaClient');
const { elencoDoUsuario } = require('../ownership');

const criarJogador = async (req, res) => {
  try {
    // Adicionamos os campos de temporada e estatísticas no corpo da requisição
    const { carreira_id, temporada_id } = req.params;
    const { 
      nome_completo, posicao, nacionalidade, overall, idade, gols, assistencias, jogos_disputados 
    } = req.body;

    const usuarioId = req.user.id;

    // Validação básica
    if (!nome_completo || !posicao || !carreira_id || !temporada_id) {
      return res.status(400).json({ error: 'Campos obrigatórios: Nome, Posição, Carreira e Temporada.' });
    }

    // Verifica se a temporada é da carreira informada e pertence ao usuário
    const temporada = await prisma.temporadas.findFirst({
      where: {
        id: parseInt(temporada_id),
        carreira: { id: parseInt(carreira_id), usuario_id: usuarioId },
      },
    });

    if (!temporada) {
      return res.status(404).json({ error: 'Carreira ou temporada não encontrada.' });
    }

    // CRIAÇÃO DUPLA (Transaction): Cria o Jogador E o registro dele na Temporada
    const novoJogador = await prisma.jogadores.create({
      data: {
        nome_completo,
        posicao,
        nacionalidade,
        carreira_id: parseInt(carreira_id),
        // Inicializa o Hall da Fama com os dados enviados
        total_gols: parseInt(gols) || 0,
        total_assistencias: parseInt(assistencias) || 0,
        total_jogos: parseInt(jogos_disputados) || 0,
        
        // Cria automaticamente a entrada na tabela elenco_temporada
        temporadas_elenco: {
          create: {
            temporada_id: parseInt(temporada_id),
            overall: parseInt(overall) || 70,
            idade: parseInt(idade) || 20,
            gols: parseInt(gols) || 0,
            assistencias: parseInt(assistencias) || 0,
            jogos_disputados: parseInt(jogos_disputados) || 0
          }
        }
      },
      include: {
        temporadas_elenco: true // Retorna os dados da temporada junto
      }
    });

    res.status(201).json(novoJogador);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar jogador e vincular à temporada.' });
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

const atualizarDadosElenco = async (req, res) => {
  try {
    const { id } = req.params; // ID da entrada no elenco_temporada
    const { overall, idade, valor_mercado, jogos_disputados, gols, assistencias } = req.body;
    if (!(await elencoDoUsuario(id, req.user.id))) {
      return res.status(404).json({ error: 'Registro de elenco não encontrado.' });
    }

    // 1. Atualiza os dados da temporada atual (o que você já fazia)
    const registroAtualizado = await prisma.elenco_temporada.update({
      where: { id: parseInt(id) },
      data: {
        overall: parseInt(overall) || 0,
        idade: parseInt(idade) || 0,
        valor_mercado: parseFloat(valor_mercado) || 0,
        jogos_disputados: parseInt(jogos_disputados) || 0,
        gols: parseInt(gols) || 0,
        assistencias: parseInt(assistencias) || 0,
      },
      select: { jogador_id: true } // Pegamos o ID do jogador para o próximo passo
    });

    const jogadorId = registroAtualizado.jogador_id;

    // 2. BUSCA E SOMA: Somamos todas as temporadas que este jogador participou
    const agregados = await prisma.elenco_temporada.aggregate({
      where: { jogador_id: jogadorId },
      _sum: {
        gols: true,
        assistencias: true,
        jogos_disputados: true
      }
    });

    // 3. SINCRONIZA: Atualizamos a tabela principal (Hall da Fama)
    await prisma.jogadores.update({
      where: { id: jogadorId },
      data: {
        total_gols: agregados._sum.gols || 0,
        total_assistencias: agregados._sum.assistencias || 0,
        total_jogos: agregados._sum.jogos_disputados || 0
      }
    });

    res.status(200).json({ 
      message: "Estatísticas da temporada e Hall da Fama atualizados!",
      registroAtualizado 
    });

  } catch (error) {
    console.error("Erro na sincronização do Hall da Fama:", error);
    res.status(500).json({ error: "Erro ao atualizar estatísticas." });
  }
};

// REMOVER JOGADOR APENAS DESTA TEMPORADA (Venda/Fim de Contrato)
const removerDoElenco = async (req, res) => {
  try {
    const { id } = req.params;
    if (!(await elencoDoUsuario(id, req.user.id))) {
      return res.status(404).json({ error: 'Registro de elenco não encontrado.' });
    }

    await prisma.elenco_temporada.delete({
      where: { id: parseInt(id) }
    });

    res.status(200).json({ message: "Jogador removido do elenco da temporada." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao remover jogador do elenco." });
  }
};

module.exports = {
  criarJogador,
  listarJogadoresDaCarreira,
  atualizarJogador,
  deletarJogador,
  atualizarDadosElenco,
  removerDoElenco
};