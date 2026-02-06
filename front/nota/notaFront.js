const API = "http://127.0.0.1:3000/notas";

const lista = document.getElementById("lista");
const btnCarregar = document.getElementById("btn");
const btnSalvar = document.getElementById("btnSalvar");
const btnAlterar = document.getElementById("btn-alterar")
const alterar = document.getElementById('lista_alterar')
const fechar = document.getElementById('fechar-janela')

btnCarregar.addEventListener("click", carregarNotas)
btnSalvar.addEventListener("click", postNota)
btnAlterar.addEventListener("click", () => {
    alterarNota(idEditar);
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
    <h3>${m.id_aluno}, ${m.id_disciplina}, ${m.nota}</h3>
    <button class="btn-alterar" onclick="alterarJanela(${m.id})">Alterar</button>
    <button class="btn-delete" onclick="deletar(${m.id})">Deletar</button>
    
    `;

    lista.appendChild(card);
}

async function carregarNotas() {
    try {
        const resposta = await fetch(`${API}`);

        const dados = await resposta.json();

        lista.innerHTML = '';

        dados.forEach((m) => criarCard(m));
    }
    catch (erro) {
        console.error(erro.message);
    }
}

async function postNota() {
    const id_aluno = document.getElementById("alunoID").value;
    const id_disciplina = document.getElementById("disciplinaID").value;
    const nota = document.getElementById("nota").value;

    const novaNota = { id_aluno, id_disciplina, nota };

    try {
        const resposta = await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(novaNota)
        });

        if (!resposta.ok) {
            throw new Error('Erro ao inserir');
        }

        carregarNotas();
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
        carregarNotas();
    }
    catch (erro) {
        console.error(erro.message);
    }
}

async function alterarNota(id) {
    const id_aluno = document.getElementById("editAluno").value;
    const id_disciplina = document.getElementById("editDisciplina").value;
    const nota = document.getElementById("editNota").value;

    try {
        await fetch(`${API}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({id_aluno, id_disciplina, nota}),
        });

        alterar.style.display = "none";
        lista.style.pointerEvents = "auto";
        carregarNotas();
    } catch (err) {
        console.error(err.message);
    }
};

async function alterarJanela(id) {
    alterar.style.display = "block";
    lista.style.pointerEvents = "none";
    idEditar = id;

    const resposta = await fetch(`${API}/${id}`);
    const nota = await resposta.json();

    document.getElementById("editAluno").value = nota.id_aluno;
    document.getElementById("editDisciplina").value = nota.id_disciplina;
    document.getElementById("editNota").value = nota.nota;
}