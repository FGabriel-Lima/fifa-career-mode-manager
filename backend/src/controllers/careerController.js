// /backend/src/controllers/careerController.js

const prisma = require('../prismaClient');


const criarCarreira = async (req, res) => {
  try {

    const { nome_carreira, nome_temporada, clube_nome, orcamento_transferencia } = req.body;

    const usuarioId = req.user.id; 

    if (!nome_carreira || !nome_temporada || !clube_nome) {
      return res.status(400).json({ error: 'Todos os campos (nome da carreira, nome da temporada, nome do clube) são obrigatórios.' });
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
          }
        }
      },
      include: {
        temporadas: true, 
      }
    });

    res.status(201).json(novaCarreira);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar nova carreira.' });
  }
};

const listarCarreiras = async (req, res) => {
  try {
    const usuarioId = req.user.id;

    const carreiras = await prisma.carreiras.findMany({
      where: {
        usuario_id: usuarioId,
      },
      include: {
        temporadas: true, 
      },
      orderBy: {
        id: 'desc',
      }
    });

    res.status(200).json(carreiras);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar carreiras.' });
  }
};

module.exports = {
  criarCarreira,
  listarCarreiras,
};