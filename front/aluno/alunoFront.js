const API = "http://127.0.0.1:3000/alunos";

const lista = document.getElementById("listagem");
const btnCarregar = document.getElementById("btn");
const btnSalvar = document.getElementById("btnSalvar");
const alterar = document.getElementById('lista_alterar')
const btnAlterar = document.getElementById("btn-alterar")
const fechar = document.getElementById('fechar-janela')

btnCarregar.addEventListener("click", carregarAlunos)
btnSalvar.addEventListener("click", postAluno)
btnAlterar.addEventListener("click", () => {
    alterarAluno(idEditar);
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
    <h3>${m.nome} (${m.idade}), ${m.cpf}</h3>
    <button class="btn-alterar" onclick="alterarJanela(${m.id})">Alterar</button>
    <button class="btn-delete" onclick="deletar(${m.id})">Deletar</button>
    
    `;

    lista.appendChild(card);
};

async function carregarAlunos() {
    try {
        const resposta = await fetch(`${API}`);

        const dados = await resposta.json();

        lista.innerHTML = '';

        dados.forEach((m) => criarCard(m));
    }
    catch (erro) {
        console.error(erro.message);
    }
};

async function postAluno() {
    const nome = document.getElementById("campoNome").value;
    const cpf = document.getElementById("campoCPF").value;
    const idade = document.getElementById("campoIdade").value;

    const novoAluno = { nome, cpf, idade };

    try {
        const resposta = await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(novoAluno)
        });

        if (!resposta.ok) {
            throw new Error('Erro ao inserir');
        }

        carregarAlunos();
    }
    catch (erro) {
        console.error(erro.message)
    }
};

async function deletar(id) {
    try {
        const resposta = await fetch(`${API}/${id}`, {
            method: "DELETE"
        });
        carregarAlunos();
    }
    catch (erro) {
        console.error(erro.message);
    }
};

async function alterarAluno(id) {
    const nome = document.getElementById("editNome").value;
    const idade = document.getElementById("editIdade").value;
    const cpf = document.getElementById("editCPF").value;

    const alunoAtualizado = { nome, idade, cpf };

    try {
        await fetch(`${API}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(alunoAtualizado),
        });

        alterar.style.display = "none";
        lista.style.pointerEvents = "auto";
        carregarAlunos();
    } catch (err) {
        console.error(err.message);
    }
};

async function alterarJanela(id) {
    alterar.style.display = "block";
    lista.style.pointerEvents = "none";
    idEditar = id;

    const resposta = await fetch(`${API}/${id}`);
    const aluno = await resposta.json();

    document.getElementById("editNome").value = aluno.nome;
    document.getElementById("editIdade").value = aluno.idade;
    document.getElementById("editCPF").value = aluno.cpf;
};