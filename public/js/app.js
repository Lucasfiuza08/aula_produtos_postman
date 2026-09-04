async function carregarProdutos() {
    const resposta = await fetch("/produtos");    
    const produtos = await resposta.json();


    const  corpoTabela = document.getElementById("tabela-corpo");
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
carregarProdutos();

async function salvarProduto() {
    const descricao = document.getElementById("descricao").value;
    const preco = document.getElementById("preco").value;
    const categoria = document.getElementById("categoria").value;
    const estoque = document.getElementById("estoque").value;
    const novoProduto = {
        descricao,
        preco,
        categoria,
        estoque
    };
        await fetch("/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(produto)
    });
    
}