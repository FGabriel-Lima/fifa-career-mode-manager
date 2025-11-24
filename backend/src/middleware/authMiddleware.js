// /backend/src/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const prisma = require('../prismaClient');

const protect = async (req, res, next) => {
  let token;

  // 1. Verifica se o header existe E se começa com "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Pega apenas o token (remove a palavra "Bearer ")
      token = req.headers.authorization.split(' ')[1];

      // Decodifica o token usando nossa chave secreta
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Busca o usuário no banco (sem a senha)
      req.user = await prisma.usuarios.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          criado_em: true
        }
      });

      // Se o token é válido, mas o usuário foi deletado do banco
      if (!req.user) {
        return res.status(401).json({ mensagem: 'Usuário não encontrado.' });
      }

      // --- SUCESSO TOTAL ---
      // O usuário existe e está anexado ao req.
      // Podemos passar para o próximo passo.
      next();

    } catch (error) {
      console.error("Erro no token:", error.message);
      return res.status(401).json({ mensagem: 'Token inválido ou expirado.' });
    }
  } else {
    // 2. Se não entrou no 'if' lá de cima, é porque não tem token
    return res.status(401).json({ mensagem: 'Não autorizado, sem token.' });
  }
};

module.exports = { protect };