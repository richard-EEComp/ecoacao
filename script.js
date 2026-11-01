
console.log("EcoAção iniciado com sucesso!");


const cadastroForm = document.getElementById("cadastroForm");

if (cadastroForm) {
    cadastroForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const nome = document.getElementById("nome").value.trim();
        const email = document.getElementById("email").value.trim().toLowerCase();
        const senha = document.getElementById("senha").value;

        const mensagem = document.getElementById("mensagem");

        // Validar nome
        if (nome.length < 3) {
            mensagem.textContent = "Digite seu nome completo.";
            return;
        }

        // Validar formato do e-mail
        const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (!emailValido) {
            mensagem.textContent = "Digite um e-mail válido.";
            return;
        }

        // Validar senha
        if (senha.length < 6) {
            mensagem.textContent = "A senha deve ter pelo menos 6 caracteres.";
            return;
        }

        let usuarios = JSON.parse(
            localStorage.getItem("ecoacaoUsuarios")
        ) || [];

        const existe = usuarios.some(usuario => usuario.email === email);

        if (existe) {
            mensagem.textContent = "Este e-mail já está cadastrado.";
            return;
        }

        usuarios.push({
            nome: nome,
            email: email,
            senha: senha
        });

        localStorage.setItem(
            "ecoacaoUsuarios",
            JSON.stringify(usuarios)
        );

        mensagem.textContent = "Cadastro realizado com sucesso!";

        cadastroForm.reset();
    });
}



const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const email = document.getElementById("emailLogin").value.trim().toLowerCase();
        const senha = document.getElementById("senhaLogin").value;

        // Verificar acesso administrativo
        if (email === "admin@gmail.com" && senha === "admin123") {

            sessionStorage.setItem("ecoacaoUsuarioLogado", JSON.stringify({
                nome: "Administrador",
                email: email,
                tipo: "admin"
            }));

            window.location.href = "admin.html";
            return;
        }

        // Verificar estudantes cadastrados
        const usuarios = JSON.parse(
            localStorage.getItem("ecoacaoUsuarios")
        ) || [];

        const usuario = usuarios.find(function(item) {
            return item.email === email && item.senha === senha;
        });

        if (usuario) {

            sessionStorage.setItem("ecoacaoUsuarioLogado", JSON.stringify({
                nome: usuario.nome,
                email: usuario.email,
                tipo: "estudante"
            }));

            window.location.href = "painel.html";

        } else {
            document.getElementById("mensagem").textContent =
                "E-mail ou senha incorretos.";
        }
    });
}


// Verificar acesso à página de campanhas
const botoesCampanha = document.querySelectorAll(".participar");

if (botoesCampanha.length > 0) {

    const usuarioLogado = sessionStorage.getItem("ecoacaoUsuarioLogado");

    if (!usuarioLogado) {
        alert("Faça login para participar das campanhas.");
        window.location.href = "login.html";
    }

    botoesCampanha.forEach(function(botao) {

        botao.addEventListener("click", function() {

            const usuario = JSON.parse(
                sessionStorage.getItem("ecoacaoUsuarioLogado")
            );

            if (!usuario) {
                window.location.href = "login.html";
                return;
            }

            const nomeCampanha = botao.dataset.campanha;

            let inscricoes = JSON.parse(
                localStorage.getItem("ecoacaoInscricoes")
            ) || [];

            const jaInscrito = inscricoes.some(function(inscricao) {
                return inscricao.email === usuario.email &&
                       inscricao.campanha === nomeCampanha;
            });

            if (jaInscrito) {
                alert("Você já demonstrou interesse nesta campanha!");
                return;
            }

            inscricoes.push({
                nome: usuario.nome,
                email: usuario.email,
                campanha: nomeCampanha
            });

            localStorage.setItem(
                "ecoacaoInscricoes",
                JSON.stringify(inscricoes)
            );

            alert("Interesse registrado com sucesso! Obrigado por participar.");

            botao.textContent = "Interesse registrado";
            botao.disabled = true;
        });

    });
}


// Botão sair da página de campanhas
const botaoSair = document.getElementById("sair");

if (botaoSair) {
    botaoSair.addEventListener("click", function(event) {
        event.preventDefault();

        sessionStorage.removeItem("ecoacaoUsuarioLogado");

        window.location.href = "index.html";
    });
}
