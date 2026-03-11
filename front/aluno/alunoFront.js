const API = window.location.hostname === "localhost"
  ? "http://127.0.0.1:3000/alunos"
  : "https://projetointegradorapi-ks3p.onrender.com/alunos";

// Selecionamos o corpo da tabela em vez da div
const corpoTabela = document.getElementById("corpo-tabela");
const btnCarregar = document.getElementById("btn");
const btnSalvar = document.getElementById("btnSalvar");
const alterar = document.getElementById('lista_alterar');
const btnAlterar = document.getElementById("btn-alterar");
const fechar = document.getElementById('fechar-janela');
const inputBuscar = document.getElementById("buscar");

let idEditar = null;

btnCarregar.addEventListener("click", carregarAlunos);
btnSalvar.addEventListener("click", postAluno);
btnAlterar.addEventListener("click", () => alterarAluno(idEditar));
fechar.addEventListener("click", () => {
    alterar.style.display = "none";
});

// Mudamos a lógica para criar uma linha (tr)
function criarLinha(m) {
    const tr = document.createElement("tr");

    tr.innerHTML = `
        <td>${m.nome}</td>
        <td>${m.idade}</td>
        <td>${m.cpf}</td>
        <td class="acoes">
            <button class="btn-alterar" onclick="alterarJanela(${m.id})">Editar</button>
            <button type="button" class="btn-delete" onclick="deletar(${m.id})">Excluir</button>
        </td>
    `;
    corpoTabela.appendChild(tr);
}

async function carregarAlunos() {
    try {
        const resposta = await fetch(API);
        const dados = await resposta.json();
        corpoTabela.innerHTML = ''; // Limpa o corpo da tabela
        dados.forEach((m) => criarLinha(m));
    } catch (erro) {
        console.error("Erro ao carregar:", erro.message);
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
    if (!confirm("Tem certeza que deseja excluir este aluno?")) return;

    try {
        const resposta = await fetch(`${API}/${id}`, {
            method: "DELETE"
        });

        if (!resposta.ok) throw new Error();

        alert("Aluno deletado com sucesso!");

        await carregarAlunos(); // espera terminar

    } catch (erro) {
        alert("Erro ao deletar aluno!");
    }
}


async function alterarJanela(id) {
    alterar.style.display = "block";
    idEditar = id; 

    try {

        const resposta = await fetch(`${API}/${id}`);
        
        if (!resposta.ok) {
            throw new Error("Não foi possível recuperar os dados do aluno.");
        }
        const aluno = await resposta.json();

        document.getElementById("editNome").value = aluno.nome;
        document.getElementById("editIdade").value = aluno.idade;
        document.getElementById("editCPF").value = aluno.cpf;

    } catch (erro) {
        console.error("Erro ao buscar aluno:", erro.message);
        alert("Erro ao carregar dados do aluno.");
        alterar.style.display = "none"; 
    }
};

async function alterarAluno(id) {
    const nome = document.getElementById("editNome").value;
    const idade = document.getElementById("editIdade").value;
    const cpf = document.getElementById("editCPF").value;

    const alunoAtualizado = { nome, idade, cpf };

    try {
        const resposta = await fetch(`${API}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(alunoAtualizado),
        });

        if (resposta.ok) {
            alterar.style.display = "none";
            carregarAlunos();
        }
    } catch (err) {
        console.error("Erro ao atualizar:", err.message);
    }
};

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
