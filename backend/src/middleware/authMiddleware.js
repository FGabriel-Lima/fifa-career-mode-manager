const jwt = require('jsonwebtoken');
const prisma = require('../prismaClient');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    try{
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await prisma.usuarios.findUnique({
        where: {id: decoded.id},
        select: {id: true, email: true, criado_em: true}
      });

      if(!req.user){
        return res.status(401).json({mensagem: 'Usuário não encontrado.'});
      }
      next();
    } catch (error) {
      return res.status(401).json({mensagem: 'Token inválido.'});
    }
  }
};

module.exports = {protect};