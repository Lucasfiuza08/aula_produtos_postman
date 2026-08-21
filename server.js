const express = require ('express')
const app = express()

const produtos = [
    {id: 1, descricao: "Banana Prata", preco: 8.99},
    {id: 2, descricao: "Leite integral 1L", preco: 2.99},
    {id: 3, descricao: "Paçoca", preco: 1.99}
]

app.get ('/produtos', (req, res) => {
    res.json (produtos)
})

app.put ('/produtos/:id', (req, res)=> {
    const id = parseInt(req.params.id);
    const index = produtos.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ erro: "Produto não encontrado" });
    }

    const { descricao, preco, categoria, estoque } = req.body;

    produtos[index] = {
        id,
        descricao,
        preco,
        categoria,
        estoque
    };

    res.json(produtos[index]);
})

app.post('/produtos', (req, res) => {
    const { descricao, preco, categoria, estoque } = req.body;
    const novoId = produtos.length > 0 ? produtos[produtos.length - 1].id + 1 : 1;

    const novoProduto = { id: novoId, descricao, preco, categoria, estoque };
    produtos.push(novoProduto);

    res.status(201).json(novoProduto);
});

app.delete('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = produtos.findIndex(produto => produto.id === id);

    if (index === -1) {
        return res.status(404).json({ erro: "Id não foi encontrado" });
    }
    produtos.splice(index, 1);

    res.status(204).send();
});

app.listen(3000, () => {
    console.log('Servidor ouvindo em http://localhost:3000');
});