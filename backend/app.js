const express = require("express");
const mongoose = require("mongoose");
const { errors } = require("celebrate");
const cors = require("cors");
const { createUser, login } = require("./controllers/users");
const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");
const auth = require("./middlewares/auth");
const errorHandler = require("./middlewares/errorHandler");
const { validateSignup, validateSignin } = require("./middlewares/validations");
const { requestLogger, errorLogger } = require("./middlewares/logger");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const { NODE_ENV, JWT_SECRET } = process.env;

if (NODE_ENV === "production" && !JWT_SECRET) {
  throw new Error("JWT_SECRET é obrigatório em produção");
}

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("O servidor travará agora");
  }, 0);
});

app.post("/signin", validateSignin, login);
app.post("/signup", validateSignup, createUser);

app.use(auth);

app.use("/users", usersRouter);
app.use("/cards", cardsRouter);

app.use((req, res) => {
  const error = new Error("A solicitacao nao foi encontrada");
  error.statusCode = 404;
  throw error;
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

mongoose
  .connect(
    `mongodb+srv://marcelomarangoni767_db_user:${process.env.DB_PASSWORD}@cluster0.prse0q9.mongodb.net/aroundb`
  )
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor ouvindo na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Erro ao conectar ao MongoDB", error);
  });
