const API = "http://127.0.0.1:3000/notas";
const API_ALUNOS = "http://127.0.0.1:3000/alunos";
const API_DISCIPLINAS = "http://127.0.0.1:3000/disciplinas";

const corpoTabela = document.getElementById("corpo-tabela");
const btnCarregar = document.getElementById("btn");
const btnSalvar = document.getElementById("btnSalvar");
const btnAlterar = document.getElementById("btn-alterar");
const alterar = document.getElementById("lista_alterar");
const fechar = document.getElementById("fechar-janela");

const selectAluno = document.getElementById("alunoID");
const selectDisciplina = document.getElementById("disciplinaID");
const editAluno = document.getElementById("editAluno");
const editDisciplina = document.getElementById("editDisciplina");

let idEditar = null;

btnCarregar.addEventListener("click", carregarNotas);
btnSalvar.addEventListener("click", postNota);
btnAlterar.addEventListener("click", () => alterarNota(idEditar));
fechar.addEventListener("click", () => alterar.style.display = "none");

window.onload = () => {
    carregarAlunos();
    carregarDisciplinas();
};

async function carregarAlunos() {
    const res = await fetch(API_ALUNOS);
    const alunos = await res.json();

    selectAluno.innerHTML = '<option value="">Selecione o aluno</option>';
    editAluno.innerHTML = '';

    alunos.forEach(a => {
        selectAluno.innerHTML += `<option value="${a.id}">${a.nome}</option>`;
        editAluno.innerHTML += `<option value="${a.id}">${a.nome}</option>`;
    });
}

async function carregarDisciplinas() {
    const res = await fetch(API_DISCIPLINAS);
    const disciplinas = await res.json();

    selectDisciplina.innerHTML = '<option value="">Selecione a disciplina</option>';
    editDisciplina.innerHTML = '';

    disciplinas.forEach(d => {
        selectDisciplina.innerHTML += `<option value="${d.id}">${d.nome}</option>`;
        editDisciplina.innerHTML += `<option value="${d.id}">${d.nome}</option>`;
    });
}

function criarLinha(m) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${m.aluno}</td>
        <td>${m.disciplina}</td>
        <td><strong>${m.nota}</strong></td>
        <td style="text-align: center;">
            <button onclick="alterarJanela(${m.id})">Editar</button>
            <button class="btn-delete" onclick="deletar(${m.id})">Excluir</button>
        </td>
    `;
    corpoTabela.appendChild(tr);
}

async function carregarNotas() {
    const resposta = await fetch(API);
    const dados = await resposta.json();
    corpoTabela.innerHTML = '';
    dados.forEach(m => criarLinha(m));
}

async function postNota() {
    const id_aluno = selectAluno.value;
    const id_disciplina = selectDisciplina.value;
    const nota = document.getElementById("nota").value;

    const resposta = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_aluno, id_disciplina, nota })
    });

    if (resposta.ok) {
        carregarNotas();
        document.getElementById("nota").value = "";
    }
}

async function deletar(id) {
    if (!confirm("Excluir esta nota?")) return;
    await fetch(`${API}/${id}`, { method: "DELETE" });
    carregarNotas();
}

async function alterarJanela(id) {
    idEditar = id;
    const resposta = await fetch(`${API}/${id}`);
    const n = await resposta.json();

    editAluno.value = n.id_aluno;
    editDisciplina.value = n.id_disciplina;
    document.getElementById("editNota").value = n.nota;

    alterar.style.display = "block";
}

async function alterarNota(id) {
    const id_aluno = editAluno.value;
    const id_disciplina = editDisciplina.value;
    const nota = document.getElementById("editNota").value;

    const res = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_aluno, id_disciplina, nota })
    });

    if (res.ok) {
        alterar.style.display = "none";
        carregarNotas();
    }
}

const inputBuscar = document.getElementById("buscar");

inputBuscar.addEventListener("keyup", function () {
    const filtro = inputBuscar.value.toLowerCase();
    const linhas = corpoTabela.getElementsByTagName("tr");

    for (let i = 0; i < linhas.length; i++) {
        const colunaAluno = linhas[i].getElementsByTagName("td")[0];
        if (colunaAluno) {
            const nome = colunaAluno.innerText.toLowerCase();
            linhas[i].style.display = nome.includes(filtro) ? "" : "none";
        }
    }
});
