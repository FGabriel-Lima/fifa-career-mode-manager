const prisma = require('../prismaClient');

const adicionarTitulo = async (req, res) => {
  try {
    const { temporada_id, nome_titulo, clube_vencedor } = req.body;
    const usuarioId = req.user.id;

    if (!temporada_id || !nome_titulo) {
      return res.status(400).json({ error: 'Dados incompletos.' });
    }

    // 1. Busca a temporada para garantir que pertence ao usuário e pegar o nome do clube se não enviado
    const temporada = await prisma.temporadas.findFirst({
      where: { id: parseInt(temporada_id), carreira: { usuario_id: usuarioId } }
    });
    
    if (!temporada) return res.status(404).json({ error: 'Temporada não encontrada.' });

    // 2. Cria o título usando o nome do clube da temporada como padrão
    const novoTitulo = await prisma.titulos_conquistados.create({
      data: {
        temporada_id: parseInt(temporada_id),
        nome_titulo,
        clube_vencedor: clube_vencedor || temporada.clube_nome // DINÂMICO
      }
    });

    res.status(201).json(novoTitulo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao adicionar título.' });
  }
};

// --- NOVIDADE: Listar todos os títulos da CARREIRA toda (Para o Almanaque Histórico) ---
const listarHistoricoTitulos = async (req, res) => {
  try {
    const { carreiraId } = req.params;
    
    const titulos = await prisma.titulos_conquistados.findMany({
      where: {
        temporada: {
          carreira_id: parseInt(carreiraId)
        }
      },
      include: {
        temporada: {
          select: { nome: true } // Para saber em qual temporada ganhou
        }
      },
      orderBy: { temporada_id: 'asc' }
    });

    res.status(200).json(titulos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar histórico.' });
  }
};

const listarTitulos = async (req, res) => {
  try {
    const { temporadaId } = req.params;
    const titulos = await prisma.titulos_conquistados.findMany({
      where: { temporada_id: parseInt(temporadaId) }
    });
    res.status(200).json(titulos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar títulos.' });
  }
};

// 1. Inicializa o prêmio (cria a "caixa" vazia para a temporada)
const inicializarPremio = async (req, res) => {
  try {
    const { temporada_id } = req.body;
    
    // Verifica se já existe
    let premio = await prisma.premios_temporada.findUnique({
      where: { temporada_id: parseInt(temporada_id) }
    });

    if (!premio) {
      premio = await prisma.premios_temporada.create({
        data: { temporada_id: parseInt(temporada_id) }
      });
    }

    res.status(200).json(premio);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao inicializar prêmio.' });
  }
};

// 2. Adiciona um Candidato (Ex: Mbappé, Haaland ou seu jogador)
const adicionarCandidato = async (req, res) => {
  try {
    const { premio_id, nome, clube, gols_ch, assist_ch, titulos } = req.body;

    const candidato = await prisma.candidatos_premio.create({
      data: {
        premio_id: parseInt(premio_id),
        nome_jogador: nome,
        clube: clube,
        gols_champions: parseInt(gols_ch || 0),
        assist_champions: parseInt(assist_ch || 0),
        // Checkboxes vindos do Frontend
        ganhou_liga: titulos.ganhou_liga || false,
        vice_liga: titulos.vice_liga || false,
        ganhou_champions: titulos.ganhou_champions || false,
        vice_champions: titulos.vice_champions || false
      }
    });

    res.status(201).json(candidato);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao adicionar candidato.' });
  }
};

// 3. A Mágica: Calcula o Vencedor com a nossa Fórmula
const calcularVencedor = async (req, res) => {
  try {
    const { premioId } = req.params;

    const candidatos = await prisma.candidatos_premio.findMany({
      where: { premio_id: parseInt(premioId) }
    });

    if (candidatos.length === 0) {
      return res.status(400).json({ error: 'Sem candidatos cadastrados.' });
    }

    // A FÓRMULA DE PRESTÍGIO
    const ranking = candidatos.map(c => {
      let pontos = 0;
      
      // Estatísticas (Peso Elite)
      pontos += (c.gols_champions * 15);   // 15 pts por gol na Champions
      pontos += (c.assist_champions * 7);  // 7 pts por assistência

      // Bônus de Conquista
      if (c.ganhou_champions) pontos += 100;
      else if (c.vice_champions) pontos += 40;

      if (c.ganhou_liga) pontos += 50;
      else if (c.vice_liga) pontos += 20;

      return { ...c, pontuacao: pontos };
    });

    // Ordena do maior para o menor
    ranking.sort((a, b) => b.pontuacao - a.pontuacao);
    const vencedor = ranking[0];

    // Salva o vencedor oficial
    await prisma.premios_temporada.update({
      where: { id: parseInt(premioId) },
      data: {
        vencedor_nome: vencedor.nome_jogador,
        vencedor_clube: vencedor.clube
      }
    });

    res.json({ vencedor, finalistas: ranking.slice(0, 3) });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao calcular Bola de Ouro.' });
  }
};

const buscarPremiosClube = async (req, res) => {
  try {
    const { temporadaId } = req.params;
    const tempId = parseInt(temporadaId);

    // 1. Busca o Artilheiro (quem tem mais gols no elenco desta temporada)
    const artilheiro = await prisma.elenco_temporada.findFirst({
      where: { temporada_id: tempId },
      orderBy: { gols: 'desc' },
      include: { jogador: true }
    });

    // 2. Busca o Garçom (quem tem mais assistências)
    const garcom = await prisma.elenco_temporada.findFirst({
      where: { temporada_id: tempId },
      orderBy: { assistencias: 'desc' },
      include: { jogador: true }
    });

    // Formatamos para o Frontend
    const premios = [];
    if (artilheiro && artilheiro.gols > 0) {
      premios.push({
        player: artilheiro.jogador.nome_completo,
        award: "Artilheiro da Temporada",
        stats: `${artilheiro.gols} Gols`,
        icon: "Target"
      });
    }
    if (garcom && garcom.assistencias > 0) {
      premios.push({
        player: garcom.jogador.nome_completo,
        award: "Líder de Assistências",
        stats: `${garcom.assistencias} Assists`,
        icon: "TrendingUp"
      });
    }

    res.status(200).json(premios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar prêmios do clube." });
  }
};

const salvarCampeoesMundo = async (req, res) => {
  try {
    const { temporada_id } = req.params;
    const { campeoes } = req.body; // Agora espera [{nome_titulo, clube_vencedor, clube_vice}]

    const novosRegistros = await Promise.all(
      campeoes.map(c => 
        prisma.titulos_conquistados.create({
          data: {
            temporada_id: parseInt(temporada_id),
            nome_titulo: c.nome_titulo,
            clube_vencedor: c.clube_vencedor,
            clube_vice: c.clube_vice || "" // Salvando o vice
          }
        })
      )
    );
    res.status(201).json(novosRegistros);
  } catch (error) {
    res.status(500).json({ error: "Erro ao registrar títulos com vice." });
  }
};

module.exports = {
  adicionarTitulo,
  listarHistoricoTitulos,
  listarTitulos,
  inicializarPremio,
  adicionarCandidato,
  calcularVencedor,
  buscarPremiosClube,
  salvarCampeoesMundo
};