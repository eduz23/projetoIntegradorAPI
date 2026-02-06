const API = "http://127.0.0.1:3000/professores";

const lista = document.getElementById('lista');
const btnCarregar = document.getElementById('btn');
const btnSalvar = document.getElementById('btnSalvar');
const btnAlterar = document.getElementById('btn-alterar');
const alterar = document.getElementById("lista_alterar");
const fechar = document.getElementById('fechar-janela')

btnCarregar.addEventListener("click", carregarProfessores)
btnSalvar.addEventListener("click", postProfessor)
btnAlterar.addEventListener("click", () =>{
    alterarProfessor(idEditar)
})

let idEditar = null;

fechar.addEventListener("click", () => {
  alterar.style.display = "none";
  lista.style.pointerEvents = "auto";
});


function criarCard(m) {
    const card = document.createElement("div")
    card.classList.add("card")

    card.innerHTML = `
    <h3>${m.nome} (${m.disciplina}), ${m.telefone}</h3>
    
    <button class="btn-alterar" onclick="alterarJanela(${m.id})">Alterar</button>
    <button class="btn-delete" onclick="deletar(${m.id})">Deletar</button>
    
    `;  

    lista.appendChild(card);
}

async function carregarProfessores() {
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

async function postProfessor() {
    const nome = document.getElementById("campoNome").value;
    const disciplina = document.getElementById("campoDisciplina").value;
    const telefone = document.getElementById("campoTelefone").value;

    const novoProf = { nome, disciplina, telefone };

    try {
        const resposta = await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(novoProf)
        });

        if (!resposta.ok) {
            throw new Error('Erro ao inserir');
        }

        carregarProfessores();
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
        carregarProfessores();
    }
    catch (erro) {
        console.error(erro.message);
    }
};

async function alterarProfessor(id) {
    const nome = document.getElementById("editNome").value;
    const disciplina = document.getElementById("editDisciplina").value;
    const telefone = document.getElementById("editTelefone").value;

    try {
        await fetch(`${API}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, disciplina, telefone }),
        });

        alterar.style.display = "none";
        lista.style.pointerEvents = "auto";
        carregarProfessores();
    } catch (err) {
        console.error(err.message);
    }
};

async function alterarJanela(id) {
    alterar.style.display = "block";
    lista.style.pointerEvents = "none";
    idEditar = id;

    const resposta = await fetch(`${API}/${id}`);
    const professor = await resposta.json();

    document.getElementById("editNome").value = professor.nome;
    document.getElementById("editDisciplina").value = professor.disciplina;
    document.getElementById("editTelefone").value = professor.telefone;
};