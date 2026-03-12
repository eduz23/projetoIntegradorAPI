const API = window.location.hostname === "localhost"
    ? "http://127.0.0.1:3000"
    : "https://projetointegradorapi-back.onrender.com/professores";


const corpoTabela = document.getElementById("corpo-tabela");
const btnCarregar = document.getElementById('btn');
const btnSalvar = document.getElementById('btnSalvar');
const btnAlterar = document.getElementById('btn-alterar');
const alterar = document.getElementById("lista_alterar");
const fechar = document.getElementById('fechar-janela');
const inputBuscar = document.getElementById("buscar");

let idEditar = null;

btnCarregar.addEventListener("click", carregarProfessores);
btnSalvar.addEventListener("click", postProfessor);
btnAlterar.addEventListener("click", () => alterarProfessor(idEditar));
fechar.addEventListener("click", () => { alterar.style.display = "none"; });

function criarLinha(m) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td>${m.nome}</td>
            <td>${m.disciplina}</td>
            <td>${m.telefone}</td>
            <td class="acoes">
                <button class="btn-alterar" onclick="alterarJanela(${m.id})">Editar</button>
                <button class="btn-delete" onclick="deletar(${m.id})">Excluir</button>
            </td>
        `;
    corpoTabela.appendChild(tr);
}

async function carregarProfessores() {
    try {
        const resposta = await fetch(API);
        const dados = await resposta.json();
        corpoTabela.innerHTML = '';
        dados.forEach(m => criarLinha(m));
    } catch (erro) {
        console.error("Erro ao carregar:", erro.message);
    }
}

async function postProfessor() {
    const nome = document.getElementById("campoNome").value;
    const disciplina = document.getElementById("campoDisciplina").value;
    const telefone = document.getElementById("campoTelefone").value;

    try {
        const resposta = await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, disciplina, telefone })
        });

        if (resposta.ok) {
            carregarProfessores();
            // Limpa os campos após salvar
            document.getElementById("campoNome").value = "";
            document.getElementById("campoDisciplina").value = "";
            document.getElementById("campoTelefone").value = "";
        }
    } catch (erro) {
        console.error(erro.message);
    }
}

async function deletar(id) {
    if (!confirm("Deseja realmente excluir este professor?")) return;
    try {
        await fetch(`${API}/${id}`, { method: "DELETE" });
        carregarProfessores();
    } catch (erro) {
        console.error(erro.message);
    }
}

async function alterarJanela(id) {
    idEditar = id;
    try {
        const resposta = await fetch(`${API}/${id}`);
        const prof = await resposta.json();

        // Preenche o modal com os dados atuais
        document.getElementById("editNome").value = prof.nome;
        document.getElementById("editDisciplina").value = prof.disciplina;
        document.getElementById("editTelefone").value = prof.telefone;

        alterar.style.display = "block";
    } catch (err) {
        console.error(err.message);
    }
}

async function alterarProfessor(id) {
    const nome = document.getElementById("editNome").value;
    const disciplina = document.getElementById("editDisciplina").value;
    const telefone = document.getElementById("editTelefone").value;

    try {
        const res = await fetch(`${API}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, disciplina, telefone }),
        });

        if (res.ok) {
            alterar.style.display = "none";
            carregarProfessores();
        }
    } catch (err) {
        console.error(err.message);
    }
}

inputBuscar.addEventListener("keyup", function () {
    const filtro = inputBuscar.value.toLowerCase();
    const linhas = corpoTabela.getElementsByTagName("tr");

    for (let i = 0; i < linhas.length; i++) {

        const colunaNome = linhas[i].getElementsByTagName("td")[0];

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