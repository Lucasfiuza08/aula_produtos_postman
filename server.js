const express = require('express');
const app = express();
app.use(express.json());

const produtos = [
    { id: 1, descricao: "Banana Prata", preco: 8.99, categoria: "Frutas", estoque: 21 },
    { id: 2, descricao: "Leite Integral 1L", preco: 2.99, categoria: "Leites", estoque: 16 },
    { id: 3, descricao: "Paçoca", preco: 1.99, categoria: "Doces", estoque: 10 },
];

app.get('/produtos', (req, res) => {
    res.json(produtos);
});

app.get('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const produto = produtos.find(p => p.id === id);

    if (!produto) {
        return res.status(404).json({ erro: "Produto não encontrado" });
    }

    res.json(produto);
});

app.post('/produtos', (req, res) => {
    const { descricao, preco, categoria, estoque } = req.body;

    let novoId = 0;
    produtos.forEach((produto) => {
        if (produto.id >= novoId) {
            novoId = produto.id + 1;
        }
    });

    const novoProduto = { id: novoId, descricao, preco, categoria, estoque };
    produtos.push(novoProduto);

    res.status(201).json(novoProduto);
});
app.put('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = produtos.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ erro: "Produto não encontrado" });
    }

    const { descricao, preco, categoria, estoque } = req.body;
    produtos[index] = { id, descricao, preco, categoria, estoque };

    res.json(produtos[index]);
});
app.delete('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = produtos.findIndex(p => p.id === id);
    if (index === -1) {
        return res.status(404).json({ erro: "Produto não encontrado" });
    }
    produtos.splice(index, 1);
    res.status(204).send();
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor ouvindo na porta ${PORT}`);
});