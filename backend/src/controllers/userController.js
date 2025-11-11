const bcrypt = require('bcryptjs');
const prisma = require('../prismaClient');
const jwt = require('jsonwebtoken');

const registrarUsuario = async (req, res) => {
  try{
    const {email, senha} = req.body;

    if( !email || !senha ){
      return res.status(400).json({mensagem: 'Email e senha são obrigatórios.'});
    }
    //checar se o usuário já existe
    const usuarioExistente = await prisma.usuarios.findUnique({
      where: {email}
    });

    if(usuarioExistente){
      return res.status(409).json({mensagem: 'Este email já está em uso.'});
    }

    const salt = await bcrypt.genSalt(10);
    const senhaHashed =  await bcrypt.hash(senha, salt);

    // Salvar o novo usuário no banco de dados
    const novoUsuario = await prisma.usuarios.create({
      data: {
        email,
        senha_hash: senhaHashed
      },
    });

    res.status(201).json({message: 'Usuário registrado com sucesso.',
      usuario: {
        id: novoUsuario.id,
        email: novoUsuario.email,
      },
    });
  }catch(error){
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({mensagem: 'Erro interno do servidor.'});
  }
};

const loginUsuario = async (req, res) => {
  try{
    const {email, senha} = req.body;

    if( !email || !senha ){
      return res.status(400).json({mensagem: 'Email e senha são obrigatórios.'});
    }

    const usuario = await prisma.usuarios.findUnique({
      where: {email}
    });

    const hashComparar = usuario ? usuario.senha_hash : "$2a$10$dummyhashthatwillalwaysfail";
    const senhaCorreta = await bcrypt.compare(senha, hashComparar);

    if(!usuario || !senhaCorreta){
      return res.status(401).json({mensagem: 'Credenciais inválidas.'});
    }

    const token = jwt.sign(
      {id: usuario.id, email: usuario.email},
      process.env.JWT_SECRET,
      {expiresIn: '4h'}
    );
    res.status(200).json({
      message: 'Login realizado com sucesso.',
      token: token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
      },
    });
  }
  catch(error){
    console.error('Erro ao fazer login do usuário:', error);
    res.status(500).json({mensagem: 'Erro interno do servidor.'});
  }
};

module.exports = {
  registrarUsuario,
  loginUsuario,
};