const express = require("express");
const pool = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let { nome, telefone } = req.query;

    nome = nome ? `%${nome}%` : "%";
    telefone = telefone ? `%${telefone}%` : "%";

    const query = `
      SELECT * FROM professores
      WHERE nome ILIKE $1
      AND telefone ILIKE $2
      ORDER BY id
    `;

    const result = await pool.query(query, [nome, telefone]);
    res.json(result.rows);
  } catch (erro) {
    res.status(500).json({
      error: "Erro ao buscar",
      detalhes: erro.message
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await pool.query(
      "SELECT * FROM professores WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Professor não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar professor" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { nome, telefone } = req.body;

    if (!nome || !telefone) {
      return res.status(400).json({
        error: "Todos os campos são obrigatórios"
      });
    }

    const result = await pool.query(
      "INSERT INTO professores (nome, telefone) VALUES ($1, $2) RETURNING *",
      [nome, telefone]
    );

    res.status(201).json(result.rows[0]);
  } catch (erro) {
    res.status(500).json({ erro: "Erro" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const result = await pool.query(
      "DELETE FROM professores WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Professor não encontrado" });
    }

    res.json({ mensagem: "Professor deletado com sucesso" });
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao deletar professor" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nome, telefone } = req.body;

    const result = await pool.query(
      "UPDATE professores SET nome=$1, telefone=$2 WHERE id=$3 RETURNING *",
      [nome, telefone, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Professor não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar professor" });
  }
});

module.exports = router;