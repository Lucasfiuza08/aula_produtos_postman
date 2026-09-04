async function carregarProdutos() {
    const resposta = await fetch("/produtos");    
    const produtos = resposta.json;
}

const  corpoTabela = document.getElementById("tabela-corpo");
corpoTabela.innerHTML = " ";
produtos.array.forEach(Element => {
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
corpoTabela.innerHTML = corpoTabela + linha;
});