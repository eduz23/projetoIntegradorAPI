const express = require("express");
const pool = require("../db");
const router = express.Router();

router.post("/", async (req, res) => {
  const { cpf, senha } = req.body;

  const result = await pool.query(
    "SELECT * FROM usuario WHERE cpf = $1 AND senha = $2",
    [cpf, senha]
  );

  if (result.rows.length === 0) {
    return res.status(401).json({ erro: "CPF ou senha inválidos" });
  }

  const user = result.rows[0];

  if (user.perfil === "usuario") {
    const aluno = await pool.query(
      "SELECT id FROM alunos WHERE cpf = $1",
      [cpf]
    );

    if (aluno.rows.length === 0) {
      return res.status(400).json({ erro: "Aluno não encontrado" });
    }

    return res.json({
      perfil: "aluno",
      alunoId: aluno.rows[0].id,
      nome: user.nome
    });
  }

  if (user.perfil === "adm") {
    return res.json({
      perfil: "professor",
      nome: user.nome
    });
  }

  res.status(403).json({ erro: "Perfil inválido" });
});

module.exports = router;
