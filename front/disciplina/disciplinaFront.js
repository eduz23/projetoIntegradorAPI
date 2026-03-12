const BASE_API = window.location.hostname === "localhost"
  ? "http://127.0.0.1:3000"
  : "https://projetointegradorapi-ks3p.onrender.com";

const API = `${BASE_API}/disciplinas`;
const API_PROFESSORES = `${BASE_API}/professores`;

const corpoTabela = document.getElementById("corpo-tabela");
const btnCarregar = document.getElementById("btn");
const btnSalvar = document.getElementById("btnSalvar");
const btnAlterar = document.getElementById("btn-alterar");
const fechar = document.getElementById("fechar-janela");
const alterar = document.getElementById("lista_alterar");
const inputBuscar = document.getElementById("buscar");
const selectProfessor = document.getElementById("campoID");
const selectEditProfessor = document.getElementById("editProf");

let idEditar = null;

btnCarregar.addEventListener("click", carregarDisciplinas);
btnSalvar.addEventListener("click", postDisciplina);
btnAlterar.addEventListener("click", () => alterarDisciplina(idEditar));

fechar.addEventListener("click", () => {
    alterar.style.display = "none";
});

document.addEventListener("DOMContentLoaded", () => {
    carregarProfessores();
});

async function carregarProfessores() {
    try {
        const resposta = await fetch(API_PROFESSORES);
        const professores = await resposta.json();

        selectProfessor.innerHTML = '<option value="">Selecione o professor</option>';
        selectEditProfessor.innerHTML = '<option value="">Selecione o professor</option>';

        professores.forEach((prof) => {
            const option1 = document.createElement("option");
            option1.value = prof.id;
            option1.textContent = prof.nome;

            const option2 = option1.cloneNode(true);

            selectProfessor.appendChild(option1);
            selectEditProfessor.appendChild(option2);
        });

    } catch (erro) {
        console.error("Erro ao carregar professores:", erro.message);
    }
}   

function criarLinha(m) {
    const tr = document.createElement("tr");

    tr.innerHTML = `
        <td>${m.professor}</td>
        <td>${m.nome}</td>
        <td class="acoes">
            <button class="btn-alterar" onclick="alterarJanela(${m.id})">Editar</button>
            <button class="btn-delete" onclick="deletar(${m.id})">Excluir</button>
        </td>
    `;

    corpoTabela.appendChild(tr);
}

async function carregarDisciplinas() {
    try {
        const resposta = await fetch(API);
        const dados = await resposta.json();

        corpoTabela.innerHTML = '';
        dados.forEach((m) => criarLinha(m));

    } catch (erro) {
        console.error("Erro ao carregar:", erro.message);
    }
}

async function postDisciplina() {
    const nome = document.getElementById("campoDisciplina").value;
    const id_professor = selectProfessor.value;

    if (!id_professor || !nome) {
        alert("Preencha todos os campos!");
        return;
    }

    const novaDisciplina = { id_professor, nome };

    try {
        const resposta = await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(novaDisciplina)
        });

        if (resposta.ok) {
            document.getElementById("campoDisciplina").value = "";
            selectProfessor.value = "";
            carregarDisciplinas();
        }

    } catch (erro) {
        console.error(erro.message);
    }
}

async function deletar(id) {
    if (!confirm("Tem certeza que deseja excluir esta disciplina?")) return;

    try {
        const resposta = await fetch(`${API}/${id}`, { method: "DELETE" });

        if (resposta.ok) {
            alert("Disciplina excluída com sucesso!");
            carregarDisciplinas();
        } else {
            alert("Erro ao excluir.");
        }

    } catch (erro) {
        console.error("Erro:", erro.message);
    }
}

async function alterarJanela(id) {
    idEditar = id;

    try {
        const resposta = await fetch(`${API}/${id}`);
        const disciplina = await resposta.json();

        selectEditProfessor.value = disciplina.id_professor;
        document.getElementById("editDisciplina").value = disciplina.nome;

        alterar.style.display = "block";

    } catch (err) {
        alert("Erro ao buscar dados.");
    }
}

async function alterarDisciplina(id) {
    const nome = document.getElementById("editDisciplina").value;
    const id_professor = document.getElementById("editProf").value;

    const disciplinaAtualizada = { id_professor, nome };

    try {
        await fetch(`${API}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(disciplinaAtualizada),
        });

        alterar.style.display = "none";
        carregarDisciplinas();

    } catch (err) {
        console.error(err.message);
    }
}

inputBuscar.addEventListener("keyup", function () {
    const filtro = inputBuscar.value.toLowerCase();
    const linhas = corpoTabela.getElementsByTagName("tr");

    for (let i = 0; i < linhas.length; i++) {
        const colunaNome = linhas[i].getElementsByTagName("td")[1];

        if (colunaNome) {
            const nome = colunaNome.innerText.toLowerCase();

            if (nome.includes(filtro)) {
                linhas[i].style.display = "";
            } else {
                linhas[i].style.display = "none";
            }
        }
    }
});