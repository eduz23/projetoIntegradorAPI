const express = require("express");
const pool = require("../db")

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        let { nome, disciplina, telefone } = req.query;

        nome = nome ? `%${nome}%` : "%";
        disciplina = disciplina ? `%${disciplina}%` : "%";
        telefone = telefone ? `%${telefone}%` : "%";

        const query = `
        select * from professores
        where nome ILIKE $1
        AND disciplina ILIKE $2
        AND telefone ILIKE $3
        ORDER BY id
    `;

        const result = await pool.query(query, [nome, disciplina, telefone]);
        res.json(result.rows)
    }
    catch (erro) {
        res.status.json({
            error: "Erro ao buscar",
            detalhes: erro.message
        })
    }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await pool.query("SELECT * FROM professores WHERE id = $1 order by id desc", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Professor não encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar professor" });
  }
});

router.post("/", async (req, res) => {
  try{
    let {nome, disciplina, telefone} = req.body;
    if(!nome || !disciplina || !telefone) return res.status(400).json({error: "Todos os campos são obrigatórios"});

    let result = await pool.query(
      "INSERT INTO professores (nome, disciplina, telefone) VALUES ($1, $2, $3) RETURNING*",
      [nome, disciplina, telefone]
    );
    res.status(201).json(result.rows[0]);
  }
  catch(erro){
    res.status(500).json({erro: 'Erro'})
  }
});

router.delete("/:id", async (req, res) =>{
  try{
    const id = parseInt(req.params.id)
    const result = await pool.query("DELETE FROM professores where id = $1 RETURNING*", [id]);
    if(result.rows.length === 0) return res.status(404).json({error : "Professor não encontrado"})
  }
  catch(erro){
    res.status(500).json({ erro: "Erro ao deletar professor"});
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nome, disciplina, telefone } = req.body;
    const result = await pool.query(
      "UPDATE professores SET nome=$1, disciplina=$2, telefone=$3 WHERE id=$4 RETURNING *",
      [nome, disciplina, telefone, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Professor não encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar professor" });
  }
});

module.exports = router;