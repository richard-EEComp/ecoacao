document.addEventListener("DOMContentLoaded", function() {
    const campanhasPadrao = [
        {
            titulo: "Arrecadação de materiais recicláveis",
            descricao: "Participe da coleta de papel, papelão, plástico e outros materiais recicláveis.",
            objetivo: "Incentivar a reciclagem e a destinação correta dos resíduos."
        },
        {
            titulo: "Organização de materiais arrecadados",
            descricao: "Ajude na separação, organização e preparação dos materiais recebidos.",
            objetivo: "Facilitar o encaminhamento dos materiais às instituições beneficiadas."
        },
        {
            titulo: "Conscientização ambiental",
            descricao: "Colabore na divulgação de práticas sustentáveis e no incentivo à responsabilidade ambiental.",
            objetivo: "Incentivar a participação dos estudantes em ações ambientais."
        }
    ];

    let campanhasSalvas = JSON.parse(
        localStorage.getItem("ecoacaoCampanhas")
    );

    if (!Array.isArray(campanhasSalvas)) {
        campanhasSalvas = [];
    }

    campanhasPadrao.forEach(padrao => {
        const existe = campanhasSalvas.some(
            campanha => campanha.titulo === padrao.titulo
        );

        if (!existe) {
            campanhasSalvas.push(padrao);
        }
    });

    localStorage.setItem(
        "ecoacaoCampanhas",
        JSON.stringify(campanhasSalvas)
    );

    let campanhas = campanhasSalvas;
    const lista = document.getElementById("listaCampanhas");

    if (!lista) return;

    function mostrarCampanhas() {
        lista.innerHTML = "";

        // Verifica quem está logado para controlar a exibição do botão de interesse
        const usuario = JSON.parse(
            sessionStorage.getItem("ecoacaoUsuarioLogado")
        );
        const isAdmin = usuario && usuario.tipo === "admin";

        campanhas.forEach((campanha, indice) => {
            const card = document.createElement("article");
            card.className = "campanha-card";

            const conteudo = document.createElement("div");
            conteudo.className = "campanha-conteudo";

            const status = document.createElement("span");
            status.className = "status-campanha";
            status.textContent = "Campanha disponível";

            const titulo = document.createElement("h2");
            titulo.textContent = campanha.titulo;

            const descricao = document.createElement("p");
            descricao.textContent = campanha.descricao;

            conteudo.append(status, titulo, descricao);

            if (campanha.objetivo) {
                const objetivo = document.createElement("p");
                objetivo.className = "campanha-detalhe";
                objetivo.innerHTML = "<strong>Objetivo:</strong> " + campanha.objetivo;
                conteudo.appendChild(objetivo);
            }

            // Se NÃO for administrador, mostra o botão de interesse
            if (!isAdmin) {
                const botao = document.createElement("button");
                botao.className = "btn-principal participar";
                botao.textContent = "Tenho interesse";
                botao.dataset.indice = indice;
                conteudo.appendChild(botao);
            } else {
                const aviso = document.createElement("p");
                aviso.className = "campanha-detalhe";
                aviso.innerHTML = "<em>(Modo Administrador - Visualização)</em>";
                conteudo.appendChild(aviso);
            }

            card.appendChild(conteudo);
            lista.appendChild(card);
        });
    }

    lista.addEventListener("click", function(event) {
        const botao = event.target.closest(".participar");

        if (!botao) return;

        const usuario = JSON.parse(
            sessionStorage.getItem("ecoacaoUsuarioLogado")
        );

        if (!usuario) {
            alert("Faça login para demonstrar interesse.");
            window.location.href = "login.html";
            return;
        }

        const campanha = campanhas[Number(botao.dataset.indice)];

        if (!campanha) return;

        let inscricoes = JSON.parse(
            localStorage.getItem("ecoacaoInscricoes")
        ) || [];

        const jaInscrito = inscricoes.some(inscricao =>
            inscricao.email === usuario.email &&
            inscricao.campanha === campanha.titulo
        );

        if (jaInscrito) {
            alert("Você já demonstrou interesse nesta campanha.");
            return;
        }

        inscricoes.push({
            nome: usuario.nome,
            email: usuario.email,
            campanha: campanha.titulo
        });

        localStorage.setItem(
            "ecoacaoInscricoes",
            JSON.stringify(inscricoes)
        );

        alert("Interesse registrado com sucesso!");
        botao.textContent = "Interesse registrado";
        botao.disabled = true;
    });

    mostrarCampanhas();
});
