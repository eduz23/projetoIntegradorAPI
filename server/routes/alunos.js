const express = require("express");
const pool = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let { nome, idade, cpf } = req.query;

    nome = nome ? `%${nome}%` : "%";
    cpf = cpf ? `%${cpf}%` : "%";
    idade = idade ? `%${idade}%` : "%";

    const query = `
      SELECT *
      FROM alunos
      WHERE nome ILIKE $1
        AND idade ILIKE $2
        AND cpf ILIKE $3
      ORDER BY id
    `;

    const result = await pool.query(query, [nome, idade, cpf]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({
      error: "Erro ao buscar alunos",
      detalhes: err.message
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await pool.query("SELECT * FROM alunos WHERE id = $1 order by id desc", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Aluno não encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar aluno" });
  }
});


router.post("/", async (req, res) => {
  try{
    let {nome, cpf, idade} = req.body;
    if(!nome || !cpf || !idade) return res.status(400).json({error: "Todos os campos são obrigatórios"});

    let result = await pool.query(
      "INSERT INTO alunos (nome, cpf, idade) VALUES ($1, $2, $3) RETURNING*",
      [nome, cpf, idade]
    );
    res.status(201).json(result.rows[0]);
  }
  catch(erro){
    res.status(500).json({erro: 'Erro'})
  }
})

router.delete("/:id", async (req, res) =>{
  try{
    const id = parseInt(req.params.id)
    const result = await pool.query("DELETE FROM alunos where id = $1 RETURNING*", [id]);
    if(result.rows.length === 0) return res.status(404).json({error : "Aluno não encontrado"})
  }
  catch(erro){
    res.status(500).json({ erro: "Erro ao deletar aluno"});
  }
})

router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nome, idade, cpf } = req.body;
    const result = await pool.query(
      "UPDATE alunos SET nome=$1, idade=$2, cpf=$3 WHERE id=$4 RETURNING *",
      [nome, idade, cpf, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Aluno não encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar aluno" });
  }
});

module.exports = router;
