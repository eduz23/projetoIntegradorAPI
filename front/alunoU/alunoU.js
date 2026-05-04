const alunoId = localStorage.getItem("alunoId");

const API = window.location.hostname === "localhost"
    ? "http://localhost:3000/notas/aluno"
    : "https://projetointegradorapi-back.onrender.com/notas/aluno";

if (!alunoId) location.href = "../login/index.html";

/* 🔥 função simples pra imagem */
function getImagem(disciplina) {
    if (disciplina === "Biologia") return "../assets/biologia.jpg";
    if (disciplina === "Física") return "../assets/fisica.webp";
    if (disciplina === "Geografia") return "../assets/geografia.png";
    if (disciplina === "Matemática") return "../assets/matematica.jpg";
    if (disciplina === 'História') return "../assets/historia.jpg"
    if (disciplina === 'Português') return "../assets/portugues.jpg"
    if (disciplina === 'Educação Física') return "../assets/educacaoFisica.webp"

    else return "../assets/disciplinaDefault.jpg"
    return "../assets/disciplinaImagem.jpg";
}

fetch(`${API}/${alunoId}`)
    .then(r => r.json())
    .then(data => {
        const container = document.getElementById("lista-materias");

        const agrupado = {};

        data.forEach(item => {
            if (!agrupado[item.disciplina]) agrupado[item.disciplina] = [];
            agrupado[item.disciplina].push(item.nota);
        });

        container.innerHTML = "";

        Object.entries(agrupado).forEach(([materia, notas], index) => {

            const linhas = notas.map((n, i) => `
                <div class="nota-linha">
                    <span>Avaliação ${i + 1}</span>
                    <strong>${n.toFixed(1)}/10</strong>
                </div>
            `).join("");

            let media = "";
            if (notas.length >= 3) {
                const m = notas.reduce((a, b) => a + b) / notas.length;
                media = `
                    <div class="media">
                        <span>Média:</span>
                        <strong>${m.toFixed(1)}</strong>
                    </div>
                `;
            }

            container.innerHTML += `
                <div class="materia-card">

                    <img src="${getImagem(materia)}" 
                    class="imagemDisciplina 
                    ${materia === 'História' ? 'historia-img' : ''} 
                    ${materia === 'Educação Física' ? 'ed-fisica-img' : ''}" 
                    alt="${materia}">

                    <div class="materia-header">
                        <span class="materia-nome">${materia}</span>
                    </div>
                    
                    <div class="avaliacoes-btn" onclick="toggleNotas(${index})">
                        <span>Avaliações</span>
                        <span class="seta" id="seta-${index}">▼</span>
                    </div>

                    <div class="notas-lista" id="notas-${index}">
                        ${linhas}
                        ${media}
                    </div>
                </div>
            `;
        });
    });

function toggleNotas(index) {
    const lista = document.getElementById(`notas-${index}`);
    const seta = document.getElementById(`seta-${index}`);

    lista.classList.toggle("show");
    seta.classList.toggle("rotate");
}

function abrirModal() {
    const modal = document.getElementById("modalUser");
    modal.style.display = "flex";

    const nome = localStorage.getItem("nomeUsuario");
    const cpf = localStorage.getItem('cpf');

    document.getElementById("nomeUser").innerText = nome;
    document.getElementById("tipoUser").innerText = "Aluno";
    document.getElementById('cpf').innerHTML = cpf;
}

function fecharModal() {
    document.getElementById("modalUser").style.display = "none";
}

window.onclick = function (event) {
    const modal = document.getElementById("modalUser");
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

function logout() {
    localStorage.clear();
    window.location.href = "../index.html";
}