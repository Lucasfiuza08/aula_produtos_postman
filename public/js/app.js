let idEmEdicao = null;

async function verificarLogin() {
    const resposta = await fetch("/usuario");

    if (resposta.status === 401) {
        window.location.href = "/login.html";
        return;
    }

    const usuario = await resposta.json();
    document.getElementById("usuario-logado").textContent = `Olá, ${usuario.nome}`;
}

async function carregarProdutos() {
    const resposta = await fetch("/produtos");
    const produtos = await resposta.json();

    const corpoTabela = document.getElementById("tabela-corpo");
    corpoTabela.innerHTML = " ";
    produtos.forEach((produto) => {
        const linha = `
                <tr>
                    <td>${produto.id}</td>
                    <td>${produto.descricao}</td>
                    <td>${produto.preco}</td>
                    <td>${produto.categoria}</td>
                    <td>${produto.estoque}</td>
                    <td>
                        <button onclick="editarProduto(${produto.id})">Editar</button>
                        <button onclick="excluirProduto(${produto.id})">Excluir</button>
                    </td>
                </tr>    
        `
        corpoTabela.innerHTML += linha;
    });
}

async function salvarProduto() {
    const descricao = document.getElementById("descricao").value;
    const preco = document.getElementById("preco").value;
    const categoria = document.getElementById("categoria").value;
    const estoque = document.getElementById("estoque").value;
    const produto = { descricao, preco, categoria, estoque };

    if (idEmEdicao) {
        await fetch(`/produtos/${idEmEdicao}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(produto)
        });
        idEmEdicao = null;
    } else {
        await fetch("/produtos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(produto)
        });
    }

    document.getElementById("descricao").value = "";
    document.getElementById("preco").value = "";
    document.getElementById("categoria").value = "";
    document.getElementById("estoque").value = "";

    carregarProdutos();
}

async function editarProduto(id) {
    const resposta = await fetch(`/produtos/${id}`);
    const produto = await resposta.json();

    document.getElementById("descricao").value = produto.descricao;
    document.getElementById("preco").value = produto.preco;
    document.getElementById("categoria").value = produto.categoria;
    document.getElementById("estoque").value = produto.estoque;

    idEmEdicao = id;
}

async function excluirProduto(id) {
    await fetch(`/produtos/${id}`, {
        method: "DELETE"
    });

    carregarProdutos();
}

document.getElementById("logout").addEventListener("click", async () => {
    await fetch("/logout", { method: "POST" });
    window.location.href = "/login.html";
});

verificarLogin();
carregarProdutos();