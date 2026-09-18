document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault(); // impede o form de recarregar a página
    const user = document.getElementById("login").value;
    const senha = document.getElementById("senha").value;

    const resposta = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // avisa o servidor que o corpo é JSON
        body: JSON.stringify({ user, senha })
    });

    const dados = await resposta.json();
    document.getElementById("mensagem").textContent = dados.mensagem;

    if (resposta.ok) {
        window.location.href = "/index.html"; // redireciona pra área logada
    }
});