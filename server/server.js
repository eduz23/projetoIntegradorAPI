const express = require("express");
require("dotenv").config();
const cors = require('cors');

const alunosRouter = require("./routes/alunos");
const professoresRouter = require("./routes/professores");
const disciplinasRouter = require("./routes/disciplinas");
const notasRouter = require("./routes/notas");
const loginRouter = require("./routes/login")

const app = express();
app.use(cors());
app.use(express.json());


// =====================
// Rotas principais
// =====================
app.use("/alunos", alunosRouter);
app.use("/professores", professoresRouter)
app.use("/disciplinas", disciplinasRouter)
app.use("/notas", notasRouter)
app.use("/login", loginRouter)

// Rota raiz
app.get("/", (req, res) => {
  res.send("🌎 API EduGrade rodando! Acesse a documentação em");
});

// =====================
// Servidor
// =====================
const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
  console.log("✅ Servidor rodando em http://127.0.0.1:3000");
})