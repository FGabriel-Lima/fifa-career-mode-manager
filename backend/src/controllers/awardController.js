const prisma = require('../prismaClient');

const adicionarTitulo = async (req, res) => {
  try {
    const { temporada_id, nome_titulo, clube_vencedor } = req.body;
    const usuarioId = req.user.id;

    if (!temporada_id || !nome_titulo || !clube_vencedor) {
      return res.status(400).json({ error: 'Dados incompletos.' });
    }

    const temporada = await prisma.temporadas.findFirst({
      where: { id: parseInt(temporada_id), carreira: { usuario_id: usuarioId } }
    });
    if (!temporada) return res.status(404).json({ error: 'Temporada não encontrada.' });

    const novoTitulo = await prisma.titulos_conquistados.create({
      data: {
        temporada_id: parseInt(temporada_id),
        nome_titulo,
        clube_vencedor
      }
    });

    res.status(201).json(novoTitulo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao adicionar título.' });
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

const inicializarPremio = async (req, res) => {
  try {
    const { temporada_id } = req.body;
    
    // Tenta achar um prêmio já existente para essa temporada
    let premio = await prisma.premios_temporada.findUnique({
      where: { temporada_id: parseInt(temporada_id) }
    });

    // Se não existir, cria um novo
    if (!premio) {
      premio = await prisma.premios_temporada.create({
        data: {
          temporada_id: parseInt(temporada_id),
          nome_premio: "Melhor do Mundo (CM)"
        }
      });
    }

    res.status(200).json(premio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao inicializar prêmio.' });
  }
};

const adicionarCandidato = async (req, res) => {
  try {
    const {
      premio_id,
      nome_jogador,
      clube,
      gols_liga, assist_liga,
      gols_copas, assist_copas,
      ganhou_liga, ganhou_copa_nacional, ganhou_copa_continental
    } = req.body;

    const candidato = await prisma.candidatos_premio.create({
      data: {
        premio_id: parseInt(premio_id),
        nome_jogador,
        clube,
        gols_liga: parseInt(gols_liga || 0),
        assist_liga: parseInt(assist_liga || 0),
        gols_copas: parseInt(gols_copas || 0),
        assist_copas: parseInt(assist_copas || 0),
        ganhou_liga: !!ganhou_liga,
        ganhou_copa_nacional: !!ganhou_copa_nacional,
        ganhou_copa_continental: !!ganhou_copa_continental
      }
    });

    res.status(201).json(candidato);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao adicionar candidato.' });
  }
};

const calcularVencedor = async (req, res) => {
  try {
    const { premioId } = req.params;

    // 1. Buscar todos os candidatos desse prêmio
    const candidatos = await prisma.candidatos_premio.findMany({
      where: { premio_id: parseInt(premioId) }
    });

    if (candidatos.length === 0) {
      return res.status(400).json({ error: 'Nenhum candidato cadastrado para calcular.' });
    }

    // A FÓRMULA (pode er ajustado os pesos aqui!)
    // Gols na Liga = x1.5
    // Gols em Copas = x2.0 (Valem mais)
    // Título Continental = +30 pontos
    // Título da Liga = +20 pontos
    let melhorPontuacao = -1;
    let vencedor = null;

    candidatos.forEach(jogador => {
      let pontos = 0;
      pontos += (jogador.gols_liga * 1.5);
      pontos += (jogador.assist_liga * 1.0);
      pontos += (jogador.gols_copas * 2.0);
      pontos += (jogador.assist_copas * 1.5);
      
      if (jogador.ganhou_liga) pontos += 20;
      if (jogador.ganhou_copa_nacional) pontos += 10;
      if (jogador.ganhou_copa_continental) pontos += 30;

      // Log para você ver o cálculo no terminal
      console.log(`Candidato: ${jogador.nome_jogador} | Pontos: ${pontos}`);

      if (pontos > melhorPontuacao) {
        melhorPontuacao = pontos;
        vencedor = jogador;
      }
    });

    const premioAtualizado = await prisma.premios_temporada.update({
      where: { id: parseInt(premioId) },
      data: {
        vencedor_nome: vencedor.nome_jogador,
        vencedor_clube: vencedor.clube
      }
    });

    res.status(200).json({
      mensagem: "Vencedor calculado com sucesso!",
      vencedor: vencedor.nome_jogador,
      pontuacao: melhorPontuacao,
      premio: premioAtualizado
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao calcular vencedor.' });
  }
};

module.exports = {
  adicionarTitulo,
  listarTitulos,
  inicializarPremio,
  adicionarCandidato,
  calcularVencedor
};