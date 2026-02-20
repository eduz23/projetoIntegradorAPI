const alunoId = localStorage.getItem("alunoId");

if (!alunoId) {
    window.location.href = "../login/index.html";
}

fetch(`http://localhost:3000/notas/aluno/${alunoId}`)
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById("lista-materias");
        
        // 1. Agrupar notas por matéria
        const agrupado = data.reduce((acc, item) => {
            if (!acc[item.disciplina]) acc[item.disciplina] = [];
            acc[item.disciplina].push(item.nota);
            return acc;
        }, {});

        // 2. Criar HTML
        container.innerHTML = "";
        Object.keys(agrupado).forEach((materia, index) => {
            const notas = agrupado[materia];
            
            // Gerar linhas de notas
            const linhasNotas = notas.map((n, i) => `
                <div class="nota-linha">
                    <span>Avaliação ${i + 1}</span>
                    <strong>${n.toFixed(2)}/10</strong>
                </div>
            `).join("");

            container.innerHTML += `
                <div class="materia-card">
                    <div class="materia-header">
                        <span class="materia-nome">${materia}</span>
                    </div>
                    
                    <div class="avaliacoes-btn" onclick="toggleNotas(${index})">
                        <span>Avaliações</span>
                        <span class="seta" id="seta-${index}">▼</span>
                    </div>

                    <div class="notas-lista" id="notas-${index}">
                        ${linhasNotas}
                    </div>
                </div>
            `;
        });
    });

// Função para abrir/fechar o acordeão
function toggleNotas(index) {
    const lista = document.getElementById(`notas-${index}`);
    const seta = document.getElementById(`seta-${index}`);
    
    lista.classList.toggle("show");
    seta.classList.toggle("rotate");
}