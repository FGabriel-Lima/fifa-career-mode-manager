const express = require('express');

const userRoutes = require('./routes/userRoutes');
const carrerRoutes = require('./routes/careerRoutes');
const playerRoutes = require('./routes/playerRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Olá mundo! O servidor do FIFA Manager está funcionando corretamente.');
});

app.use('/api/usuarios', userRoutes);
app.use('/api/carreiras', carrerRoutes);
app.use('/api/jogadores', playerRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});