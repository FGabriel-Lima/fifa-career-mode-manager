const prisma = require('../prismaClient');

const criarLiga = async (req, res) => {
  try {
    const { temporada_id, nome_liga } = req.body;
    const usuarioId = req.user.id;

    if (!temporada_id || !nome_liga) {
      return res.status(400).json({ error: 'Temporada e nome da liga são obrigatórios.' });
    }

    const temporada = await prisma.temporadas.findFirst({
      where: {
        id: parseInt(temporada_id),
        carreira: { usuario_id: usuarioId },
      },
    });

    if (!temporada) {
      return res.status(404).json({ error: 'Temporada não encontrada.' });
    }

    const novaLiga = await prisma.ligas_temporada.create({
      data: {
        temporada_id: parseInt(temporada_id),
        nome_liga,
      },
    });

    res.status(201).json(novaLiga);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar liga.' });
  }
};

const listarLigasDaTemporada = async (req, res) => {
  try {
    const { temporadaId } = req.params;
    const usuarioId = req.user.id;

    const temporada = await prisma.temporadas.findFirst({
      where: {
        id: parseInt(temporadaId),
        carreira: { usuario_id: usuarioId },
      },
    });

    if (!temporada) {
      return res.status(404).json({ error: 'Temporada não encontrada.' });
    }

    const ligas = await prisma.ligas_temporada.findMany({
      where: { temporada_id: parseInt(temporadaId) },
    });

    res.status(200).json(ligas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao listar ligas.' });
  }
};

const adicionarTimeNaLiga = async (req, res) => {
  try {
    const {
      liga_id,
      posicao,
      nome_time,
      pontos,
      vitorias,
      empates,
      derrotas,
      gols_pro,
      gols_contra
    } = req.body;
    
    const usuarioId = req.user.id;

    const liga = await prisma.ligas_temporada.findFirst({
      where: {
        id: parseInt(liga_id),
        temporada: {
          carreira: { usuario_id: usuarioId }
        }
      }
    });

    if (!liga) {
      return res.status(404).json({ error: 'Liga não encontrada ou permissão negada.' });
    }

    const novoTime = await prisma.classificacao_equipe.create({
      data: {
        liga_temporada_id: parseInt(liga_id),
        posicao: parseInt(posicao),
        nome_time,
        pontos: parseInt(pontos),
        vitorias: vitorias ? parseInt(vitorias) : 0,
        empates: empates ? parseInt(empates) : 0,
        derrotas: derrotas ? parseInt(derrotas) : 0,
        gols_pro: gols_pro ? parseInt(gols_pro) : 0,
        gols_contra: gols_contra ? parseInt(gols_contra) : 0,
      }
    });

    res.status(201).json(novoTime);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao adicionar time na liga.' });
  }
};

const verTabelaLiga = async (req, res) => {
  try {
    const { ligaId } = req.params;
    const usuarioId = req.user.id;

    const liga = await prisma.ligas_temporada.findFirst({
      where: {
        id: parseInt(ligaId),
        temporada: { carreira: { usuario_id: usuarioId } }
      },
      // INCLUIR A CLASSIFICAÇÃO ORDENADA
      include: {
        classificacao: {
          orderBy: {
            posicao: 'asc' // 1º, 2º, 3º...
          }
        }
      }
    });

    if (!liga) {
      return res.status(404).json({ error: 'Liga não encontrada.' });
    }

    res.status(200).json(liga);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar tabela da liga.' });
  }
};

module.exports = {
  criarLiga,
  listarLigasDaTemporada,
  adicionarTimeNaLiga,
  verTabelaLiga
};