const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// Rota Hello World
app.get("/hello", (req, res) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Servidor ouvindo na porta ${PORT}`);
});
