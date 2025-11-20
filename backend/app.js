const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { createUser, login } = require('./controllers/users');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const { validateSignup, validateSignin } = require('./middlewares/validations');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(requestLogger);

app.post('/signin', validateSignin, login);
app.post('/signup', validateSignup, createUser);

app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use((req, res) => {
  const error = new Error('A solicitacao nao foi encontrada');
  error.statusCode = 404;
  throw error;
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

mongoose
  .connect('mongodb://localhost:27017/aroundb')
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor ouvindo na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Erro ao conectar ao MongoDB', error);
  });
