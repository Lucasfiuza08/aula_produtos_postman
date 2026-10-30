const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // middleware que lê os cookies enviados pelo navegador e os coloca em req.cookies

const app = express();

app.use(cors());                // libera o acesso do front-end (React) de outra origem
app.use(express.json());        // permite ler req.body quando o cliente manda JSON
app.use(cookieParser());        // ativa req.cookies
app.use(express.static("public")); // serve os arquivos da pasta public (html, css, js do front)

// --- dados em memória (sem banco de dados) ---

const produtos = [
    { id: 1, descricao: "Banana Prata", preco: 8.99, categoria: "Frutas", estoque: 21 },
    { id: 2, descricao: "Leite Integral 1L", preco: 2.99, categoria: "Leites", estoque: 16 },
    { id: 3, descricao: "Paçoca", preco: 1.99, categoria: "Doces", estoque: 10 },
];

const users = [
    { id: 1, user: "lucasfiuza", senha: "123" } // senha como string, pra bater com o que vem do JSON
];

// --- rotas de produtos (já existiam, sem mudança) ---

app.get('/produtos', (req, res) => {
    res.json(produtos);
});

app.get('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const produto = produtos.find(p => p.id === id);
    if (!produto) return res.status(404).json({ erro: "Produto não encontrado" });
    res.json(produto);
});

app.post('/produtos', (req, res) => {
    const { descricao, preco, categoria, estoque } = req.body;
    let novoId = 0;
    produtos.forEach((produto) => {
        if (produto.id >= novoId) novoId = produto.id + 1;
    });
    const novoProduto = { id: novoId, descricao, preco, categoria, estoque };
    produtos.push(novoProduto);
    res.status(201).json(novoProduto);
});

app.put('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = produtos.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ erro: "Produto não encontrado" });
    const { descricao, preco, categoria, estoque } = req.body;
    produtos[index] = { id, descricao, preco, categoria, estoque };
    res.json(produtos[index]);
});

app.delete('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = produtos.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ erro: "Produto não encontrado" });
    produtos.splice(index, 1);
    res.status(204).send();
});

//login com cookie

app.post('/login', (req, res) => {
    const { user, senha } = req.body; // dados enviados pelo formulário

    // procura, dentro de users, alguém cujo login E senha batam com o que foi enviado
    const usuarioEncontrado = users.find(
        u => u.user === user && u.senha === senha
    );

    if (!usuarioEncontrado) {
        // 401 = não autorizado. Credenciais erradas.
        return res.status(401).json({ mensagem: "Login ou senha inválidos" });
    }

    // cria o cookie "usuario" no navegador de quem fez a requisição.
    res.cookie("usuario", usuarioEncontrado.id.toString(), {
        httpOnly: true,
        sameSite: "strict",
        secure: false
    });

    res.json({ mensagem: "Login realizado com sucesso" });
});

//verifica quem está logado

app.get('/usuario', (req, res) => {
    const usuarioId = req.cookies.usuario; // o cookie-parser preencheu req.cookies a partir do que veio no cabeçalho HTTP

    if (!usuarioId) {
        return res.status(401).json({ mensagem: "Usuário não autenticado" });
    }

    const usuario = users.find(u => u.id === Number(usuarioId));

    if (!usuario) {
        return res.status(401).json({ mensagem: "Usuário inválido" });
    }

    res.json({ id: usuario.id, nome: usuario.user });
});



app.post('/logout', (req, res) => {
    res.clearCookie("usuario"); // manda o navegador apagar o cookie "usuario"
    res.json({ mensagem: "Logout realizado" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});