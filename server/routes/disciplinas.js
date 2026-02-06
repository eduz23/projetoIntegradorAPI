const express = require("express");
const pool = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        let { id_professor, nome } = req.query;

        id_professor = id_professor || null
        nome = nome ? `%${nome}%` : "%";

        const query = `
      SELECT *
      FROM disciplinas
      WHERE nome ILIKE $1 
      AND ($2::int IS NULL OR id_professor = $2)
      ORDER BY id
    `;

        const result = await pool.query(query, [nome, id_professor]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({
            error: "Erro ao buscar disciplinas",
            detalhes: err.message
        });
    }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await pool.query("SELECT * FROM disciplinas WHERE id = $1 order by id desc", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Disciplina não encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar disciplina" });
  }
});

router.post("/", async (req, res) =>{
    try{
        let {id_professor, nome} = req.body;

        if(!id_professor || !nome) return res.status(400).json({error: "Todos os campos são obrigatórios"})

        let result = await pool.query(
            "INSERT INTO disciplinas (id_professor, nome) VALUES ($1, $2) RETURNING*",
            [id_professor, nome]
        );
        res.status(201).json(result.rows[0]);
    }
    catch(erro){
        res.status(500).json({erro: erro.message})
    }
})

router.delete("/:id", async (req, res) =>{
  try{
    const id = parseInt(req.params.id)
    const result = await pool.query("DELETE FROM disciplinas where id = $1 RETURNING*", [id]);
    if(result.rows.length === 0) return res.status(404).json({error : "Disciplina não encontrado"})
  }
  catch(erro){
    res.status(500).json({ erro: "Erro ao deletar disciplina"});
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { id_professor, nome  } = req.body;
    const result = await pool.query(
      "UPDATE disciplinas SET id_professor=$1, nome=$2 WHERE id=$3 RETURNING *",
      [id_professor, nome, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Disciplina não encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar disciplina" });
  }
});

module.exports = router;