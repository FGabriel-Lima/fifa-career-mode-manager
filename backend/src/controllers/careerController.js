// backend/src/controllers/careerController.js
const prisma = require('../prismaClient')
const { carreiraDoUsuario, temporadaDoUsuario } = require('../ownership')

// 1. Criar Carreira (Já inicializa a Temporada e a Liga)
const criarCarreira = async (req, res) => {
  try {
    const {
      nome_carreira,
      nome_temporada,
      clube_nome,
      orcamento_transferencia,
      nome_liga
    } = req.body
    const usuarioId = req.user.id

    if (!nome_carreira || !nome_temporada || !clube_nome) {
      return res
        .status(400)
        .json({ error: 'Todos os campos são obrigatórios.' })
    }

    const novaCarreira = await prisma.carreiras.create({
      data: {
        nome_carreira: nome_carreira,
        usuario_id: usuarioId,
        temporadas: {
          create: {
            nome: nome_temporada,
            clube_nome: clube_nome,
            orcamento_transferencia: orcamento_transferencia || 0,
            ligas: {
              create: { nome_liga: nome_liga || 'EFL League Two' }
            }
          }
        }
      },
      include: {
        temporadas: {
          include: { ligas: true }
        }
      }
    })

    res.status(201).json(novaCarreira)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao criar nova carreira.' })
  }
}

// 2. Listar Carreiras do Usuário
const listarCarreiras = async (req, res) => {
  try {
    const usuarioId = req.user.id

    const carreiras = await prisma.carreiras.findMany({
      where: { usuario_id: usuarioId },
      include: { temporadas: true },
      orderBy: { id: 'desc' }
    })

    res.status(200).json(carreiras)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao buscar carreiras.' })
  }
}

// 3. Obter Ranking Geral (Hall da Fama)
const obterHallDaFama = async (req, res) => {
  try {
    const { id } = req.params
    const { limit, orderBy } = req.query
    if (!(await carreiraDoUsuario(id, req.user.id))) {
      return res.status(404).json({ error: 'Carreira não encontrada.' })
    }

    const sortField = orderBy || 'total_gols'

    const queryOptions = {
      where: {
        carreira_id: parseInt(id),
        total_jogos: { gt: 0 }
      },
      orderBy: [
        { [sortField]: 'desc' },
        { total_jogos: 'asc' },
        { nome_completo: 'asc' }
      ],
      take: parseInt(limit) || 10,
      select: {
        id: true,
        nome_completo: true,
        posicao: true,
        total_gols: true,
        total_assistencias: true,
        total_jogos: true
      }
    }

    const ranking = await prisma.jogadores.findMany(queryOptions)
    res.status(200).json(ranking)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao obter ranking.' })
  }
}

// 4. Buscar Detalhes da Carreira (COM A CORREÇÃO DA BOLA DE OURO)
const buscarCarreiraPorId = async (req, res) => {
  try {
    const { id } = req.params

    const carreira = await prisma.carreiras.findUnique({
      where: { id: parseInt(id) },
      include: {
        temporadas: {
          orderBy: { id: 'desc' },
          include: {
            ligas: { include: { classificacao: true } },
            elenco: { include: { jogador: true } },
            transferencias: true,
            titulos_conquistados: true,
            
            // CORREÇÃO AQUI: Nome no singular (como o Prisma sugere no erro)
            premio_temporada: { 
              include: { candidatos: true } 
            }
          }
        }
      }
    })

    if (!carreira || carreira.usuario_id !== req.user.id) {
      return res.status(404).json({ error: 'Carreira não encontrada.' })
    }

    const temporadasFormatadas = carreira.temporadas.map(temp => {
      const ligaAtiva = temp.ligas[0] || {}
      const minhaClassificacao = ligaAtiva.classificacao?.[0] || {}

      // CORREÇÃO AQUI: Acessando a propriedade correta no singular
      // Como é relação 1-para-1, ele retorna um objeto ou null (não array)
      const premioDados = temp.premio_temporada; 

      return {
        ...temp,
        orcamento_transferencia: temp.orcamento_transferencia || 0,
        clube_nome: minhaClassificacao.nome_time || temp.clube_nome || 'Clube',
        leagueName: ligaAtiva.nome_liga || 'Liga Desconhecida',
        currentPosition: minhaClassificacao.posicao || '--',
        
        stats: {
          wins: minhaClassificacao.vitorias || 0,
          draws: minhaClassificacao.empates || 0,
          losses: minhaClassificacao.derrotas || 0,
          games: (minhaClassificacao.vitorias + minhaClassificacao.empates + minhaClassificacao.derrotas) || 0,
          points: minhaClassificacao.pontos || 0
        },

        transfers: {
          in: temp.transferencias.filter(t => t.tipo_transferencia === 'compra'),
          out: temp.transferencias.filter(t => t.tipo_transferencia === 'venda')
        },

        squad: temp.elenco.map(e => ({
          id: e.id,
          name: e.jogador.nome_completo,
          position: e.jogador.posicao,
          overall: e.overall,
          idade: e.idade,
          gols: e.gols,
          assistencias: e.assistencias,
          jogos_disputados: e.jogos_disputados || 0,
          valor_mercado: e.valor_mercado || 0,
          onLoan: false
        })),

        trophies: temp.titulos_conquistados.map(t => ({
          id: t.id,
          nome_titulo: t.nome_titulo,
          clube_vencedor: t.clube_vencedor,
          clube_vice: t.clube_vice || '',
          season: temp.nome
        })),

        // Mapeamento corrigido da Bola de Ouro
        ballonDor: { 
          winner: premioDados?.vencedor_nome ? {
            name: premioDados.vencedor_nome,
            club: premioDados.vencedor_clube
          } : null,
          
          finalists: premioDados?.candidatos?.map(c => ({
            name: c.nome_jogador,
            club: c.clube,
            goals: c.gols_champions
          })) || [] 
        }
      }
    })

    res.status(200).json({ ...carreira, temporadas: temporadasFormatadas })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao buscar detalhes da carreira.' })
  }
}

const atualizarClassificacao = async (req, res) => {
  try {
    const { temporada_id } = req.params
    const {
      vitorias,
      empates,
      derrotas,
      pontos,
      posicao,
      nome_liga,
      orcamento_transferencia
    } = req.body
    if (!(await temporadaDoUsuario(temporada_id, req.user.id))) {
      return res.status(404).json({ error: 'Temporada não encontrada.' })
    }

    await prisma.temporadas.update({
      where: { id: parseInt(temporada_id) },
      data: {
        orcamento_transferencia: parseFloat(orcamento_transferencia) || 0
      }
    })

    const temporada = await prisma.temporadas.findUnique({
      where: { id: parseInt(temporada_id) },
      include: { carreira: true }
    })

    const nomeRealDoClube = temporada.clube_nome || temporada.carreira.nome

    let liga = await prisma.ligas_temporada.findFirst({
      where: { temporada_id: parseInt(temporada_id) }
    })

    if (!liga) {
      liga = await prisma.ligas_temporada.create({
        data: {
          temporada_id: parseInt(temporada_id),
          nome_liga: nome_liga || 'Liga Desconhecida'
        }
      })
    } else if (nome_liga) {
      await prisma.ligas_temporada.update({
        where: { id: liga.id },
        data: { nome_liga: nome_liga }
      })
    }

    const classificacaoExistente = await prisma.classificacao_equipe.findFirst({
      where: { liga_temporada_id: liga.id }
    })

    const dadosParaSalvar = {
      vitorias: parseInt(vitorias) || 0,
      empates: parseInt(empates) || 0,
      derrotas: parseInt(derrotas) || 0,
      pontos: parseInt(pontos) || 0,
      posicao: parseInt(posicao) || 1,
      nome_time: nomeRealDoClube
    }

    let resultado

    if (classificacaoExistente) {
      resultado = await prisma.classificacao_equipe.update({
        where: { id: classificacaoExistente.id },
        data: dadosParaSalvar
      })
    } else {
      resultado = await prisma.classificacao_equipe.create({
        data: {
          liga_temporada_id: liga.id,
          ...dadosParaSalvar
        }
      })
    }

    res.status(200).json(resultado)
  } catch (error) {
    console.error('ERRO DETALHADO:', error)
    res.status(500).json({ error: 'Erro ao atualizar classificação.' })
  }
}

const deletarCarreira = async (req, res) => {
  try {
    const { id } = req.params
    const usuarioId = req.user.id

    const carreira = await prisma.carreiras.findFirst({
      where: {
        id: parseInt(id),
        usuario_id: usuarioId
      }
    })

    if (!carreira) {
      return res
        .status(404)
        .json({ error: 'Carreira não encontrada ou permissão negada.' })
    }

    await prisma.carreiras.delete({
      where: { id: parseInt(id) }
    })

    res.status(200).json({
      mensagem:
        'Carreira e todos os dados vinculados foram apagados com sucesso.'
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao apagar a carreira.' })
  }
}

const avancarTemporada = async (req, res) => {
  try {
    const { carreira_id, temporada_anterior_id } = req.params;
    const { nome_nova_temporada, novo_orcamento, nome_nova_liga } = req.body;

    // 1. Busca a temporada anterior (da mesma carreira do usuário) para pegar dados do clube e elenco
    const temporadaAnterior = await prisma.temporadas.findFirst({
      where: {
        id: parseInt(temporada_anterior_id),
        carreira: { id: parseInt(carreira_id), usuario_id: req.user.id }
      },
      include: { elenco: true }
    });

    if (!temporadaAnterior) {
      return res.status(404).json({ error: "Temporada anterior não encontrada." });
    }

    // 2. Cria a NOVA Temporada
    const novaTemporada = await prisma.temporadas.create({
      data: {
        carreira_id: parseInt(carreira_id),
        nome: nome_nova_temporada, // Ex: "2025/2026"
        clube_nome: temporadaAnterior.clube_nome, // Mantém o mesmo clube
        orcamento_transferencia: parseFloat(novo_orcamento || temporadaAnterior.orcamento_transferencia),
        
        // Cria a Liga (pode ser a mesma ou nova se subiu de divisão)
        ligas: {
          create: {
            nome_liga: nome_nova_liga || "Liga Desconhecida"
          }
        },
        
        // Inicializa o prêmio (Bola de Ouro) vazio
        premio_temporada: {
            create: {} 
        }
      }
    });

    // 3. A MÁGICA: Migrar o Elenco (Clonar jogadores, resetar stats, +1 ano de idade)
    if (temporadaAnterior.elenco.length > 0) {
      const elencoNovo = temporadaAnterior.elenco.map(jogador => ({
        temporada_id: novaTemporada.id,
        jogador_id: jogador.jogador_id,
        // Mantém overall, mas aumenta idade e zera stats
        overall: jogador.overall,
        idade: jogador.idade + 1, // Envelhece o jogador
        gols: 0,
        assistencias: 0,
        jogos_disputados: 0,
        valor_mercado: jogador.valor_mercado // Mantém valor (pode ajustar depois)
      }));

      // Salva todo mundo de uma vez
      await prisma.elenco_temporada.createMany({
        data: elencoNovo
      });
    }

    res.status(201).json({ message: "Nova temporada iniciada!", novaTemporada });

  } catch (error) {
    console.error("Erro ao avançar temporada:", error);
    res.status(500).json({ error: "Erro ao processar nova temporada." });
  }
};

module.exports = {
  criarCarreira,
  listarCarreiras,
  obterHallDaFama,
  buscarCarreiraPorId,
  atualizarClassificacao,
  deletarCarreira,
  avancarTemporada
}