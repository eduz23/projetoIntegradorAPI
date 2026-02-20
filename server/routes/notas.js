const express = require("express");
const pool = require("../db");

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let { id_aluno, id_disciplina, nota } = req.query;

    id_aluno = id_aluno || null;
    id_disciplina = id_disciplina || null;
    nota = nota !== undefined && nota !== "" ? nota : null;

    const query = `
        SELECT 
  notas.id,
  alunos.nome AS aluno,
  disciplinas.nome AS disciplina,
  notas.nota
FROM notas
JOIN alunos ON notas.id_aluno = alunos.id
JOIN disciplinas ON notas.id_disciplina = disciplinas.id
WHERE ($1::int IS NULL OR notas.id_aluno = $1)
AND ($2::int IS NULL OR notas.id_disciplina = $2)
AND ($3::numeric IS NULL OR notas.nota = $3)
ORDER BY notas.id
        `

    const result = await pool.query(query, [id_aluno, id_disciplina, nota]);
    res.json(result.rows);
  }
  catch (erro) {
    res.status(500).json({
      error: "Erro ao buscar notas",
      detalhes: erro.message
    })
  }
});

router.get("/aluno/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const result = await pool.query(
      `
      SELECT 
        notas.id,
        disciplinas.nome AS disciplina,
        notas.nota
      FROM notas
      JOIN disciplinas 
        ON notas.id_disciplina = disciplinas.id
      WHERE notas.id_aluno = $1
      ORDER BY disciplinas.nome
      `,
      [id]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar notas do aluno" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await pool.query("SELECT * FROM notas WHERE id = $1 order by id desc", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Nota não encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar nota" });
  }
});

router.post("/", async (req, res) => {
  try {
    let { id_aluno, id_disciplina, nota } = req.body;
    if (!id_aluno || !id_disciplina || !nota) return res.status(400).json({ error: "Todos os campos são obrigatórios" });

    let result = await pool.query(
      "INSERT INTO notas (id_aluno, id_disciplina, nota) VALUES ($1, $2, $3) RETURNING*",
      [id_aluno, id_disciplina, nota]
    );
    res.status(201).json(result.rows[0]);
  }
  catch (erro) {
    res.status(500).json({ erro: 'Erro' })
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const result = await pool.query("DELETE FROM notas where id = $1 RETURNING*", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Nota não encontrado" })
  }
  catch (erro) {
    res.status(500).json({ erro: "Erro ao deletar nota" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { id_aluno, id_disciplina, nota } = req.body;
    const result = await pool.query(
      "UPDATE notas SET id_aluno=$1, id_disciplina=$2, nota=$3 WHERE id=$4 RETURNING *",
      [id_aluno, id_disciplina, nota, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Nota não encontrada" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar nota" });
  }
});


module.exports = router;