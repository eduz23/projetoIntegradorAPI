const API = "http://127.0.0.1:3000/disciplinas";

const lista = document.getElementById('listagem');
const btnCarregar = document.getElementById('btn');
const btnSalvar = document.getElementById('btnSalvar');
const btnAlterar = document.getElementById('btn-alterar');
const fechar = document.getElementById('fechar-janela');
const alterar = document.getElementById('lista_alterar')

btnCarregar.addEventListener("click", carregarDisciplinas)
btnSalvar.addEventListener("click", postDisciplina)
btnAlterar.addEventListener("click", () => {
    alterarDisciplina(idEditar);
});

let idEditar = null;

fechar.addEventListener("click", () => {
  alterar.style.display = "none";
  lista.style.pointerEvents = "auto";
});

function criarCard(m) {
    const card = document.createElement("div")
    card.classList.add("card")

    card.innerHTML = `
    <h3>${m.id_professor}, ${m.nome}</h3>

    <button class="btn-alterar" onclick="alterarJanela(${m.id})">Alterar</button>
    <button class="btn-delete" onclick="deletar(${m.id})">Deletar</button>
    
    `;

    lista.appendChild(card);
}

async function carregarDisciplinas() {
    try {
        const resposta = await fetch(`${API}`)

        const dados = await resposta.json();

        lista.innerHTML = '';

        dados.forEach((m) => criarCard(m));
    }
    catch (erro) {
        console.error(erro.message)
    }
}

async function postDisciplina() {
    let nome = document.getElementById("campoDisciplina").value;
    let id_professor = document.getElementById("campoID").value;

    const novaDisciplina = { id_professor, nome }

    try {
        const resposta = await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(novaDisciplina)
        });

        if (!resposta.ok) {
            throw new Error('Erro ao inserir')
        }
        carregarDisciplinas();
    }
    catch (erro) {
        console.error(erro.message)
    }
}

async function deletar(id) {
    try {
        const resposta = await fetch(`${API}/${id}`, {
            method: "DELETE"
        });
        carregarDisciplinas();
    }
    catch (erro) {
        console.erro(erro.message)
    }
}

async function alterarDisciplina(id) {
    let nome = document.getElementById("editDisciplina").value;
    let id_professor = document.getElementById("editProf").value;

    const disciplinaAtualizada = { id_professor, nome };

    try {
        await fetch(`${API}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(disciplinaAtualizada),
        });

        alterar.style.display = "none";
        lista.style.pointerEvents = "auto";
        carregarDisciplinas();
    } catch (err) {
        console.error(err.message);
    }
};

async function alterarJanela(id) {
    alterar.style.display = "block";
    lista.style.pointerEvents = "none";
    idEditar = id;

    const resposta = await fetch(`${API}/${id}`);
    const disciplina = await resposta.json();

    document.getElementById("editProf").value = disciplina.id_professor;
    document.getElementById("editDisciplina").value = disciplina.nome;
};