const API = window.location.hostname === "localhost"
  ? "http://127.0.0.1:3000"
  : "https://projetointegradorapi-ks3p.onrender.com";

document.addEventListener("DOMContentLoaded", () => {

  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const cpf = document.getElementById("cpf").value;
    const senha = document.getElementById("senha").value;

    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpf, senha })
      });

      if (!res.ok) {
        alert("CPF ou senha inválidos");
        return;
      }

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (data.perfil === "professor") { 
        window.location.href = "../front/home/home.html";
      } 
      else if (data.perfil === "aluno") {
        localStorage.setItem("alunoId", data.alunoId);
        localStorage.setItem("nomeUsuario", data.nome);
        window.location.href = "../front/alunoU/alunoU.html";
      }

    } catch (error) {
      console.error("Erro ao conectar com o servidor:", error);
      alert("Erro de conexão com o servidor.");
    }

    console.log(cpf, senha)
  });

});