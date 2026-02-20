document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const cpf = document.getElementById("cpf").value;
  const senha = document.getElementById("senha").value;

  try {
    const res = await fetch("http://localhost:3000/login/login", { // Verifique se a rota é /login ou /login/login
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cpf, senha })
    });

    if (!res.ok) {
      alert("CPF ou senha inválidos");
      return;
    }

    const data = await res.json();

    // Lógica de redirecionamento baseada no perfil retornado pela API
    if (data.perfil === "professor") { // No seu backend, 'adm' retorna perfil: 'professor'
      window.location.href = "../front/home/home.html"; // Ajustado para o nome da pasta que você pediu
    } else if (data.perfil === "aluno") {
      localStorage.setItem("alunoId", data.alunoId);
      localStorage.setItem("nomeUsuario", data.nome);
      window.location.href = "../front/alunoU/alunoU.html"; // Ajustado para o nome da pasta que você pediu
    }
  } catch (error) {
    console.error("Erro ao conectar com o servidor:", error);
    alert("Erro de conexão com o servidor.");
  }
});