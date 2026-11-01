const usuarioLogado = JSON.parse(
    sessionStorage.getItem("ecoacaoUsuarioLogado")
);

if (!usuarioLogado || usuarioLogado.tipo !== "admin") {
    window.location.href = "login.html";
} else {
    const formCampanha = document.getElementById("formCampanha");
    const listaCampanhas = document.getElementById("listaCampanhas");
    const listaInscricoes = document.getElementById("listaInscricoes");

    const campoTitulo = document.getElementById("titulo");
    const campoDescricao = document.getElementById("descricao");
    const campoObjetivo = document.getElementById("objetivo");

    const botaoSalvar = document.getElementById("botaoSalvar");
    const botaoCancelar = document.getElementById("cancelarEdicao");

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

    if (!Array.isArray(campanhasSalvas) || campanhasSalvas.length === 0) {
        campanhasSalvas = campanhasPadrao;
        localStorage.setItem(
            "ecoacaoCampanhas",
            JSON.stringify(campanhasSalvas)
        );
    }

    let campanhas = campanhasSalvas;
    let indiceEdicao = null;

    function salvarCampanhas() {
        localStorage.setItem(
            "ecoacaoCampanhas",
            JSON.stringify(campanhas)
        );
    }

    function mostrarCampanhas() {
        listaCampanhas.innerHTML = "";

        if (campanhas.length === 0) {
            listaCampanhas.innerHTML = "<p>Nenhuma campanha cadastrada.</p>";
            return;
        }

        campanhas.forEach((campanha, indice) => {
            const card = document.createElement("div");
            card.className = "card";

            const titulo = document.createElement("h3");
            titulo.textContent = campanha.titulo;

            const descricao = document.createElement("p");
            descricao.textContent = campanha.descricao;

            const objetivo = document.createElement("p");
            objetivo.innerHTML = "<strong>Objetivo:</strong> " + (campanha.objetivo || "Não informado");

            const editar = document.createElement("button");
            editar.textContent = "Editar";
            editar.addEventListener("click", () => editarCampanha(indice));

            const excluir = document.createElement("button");
            excluir.textContent = "Excluir";
            excluir.addEventListener("click", () => excluirCampanha(indice));

            card.append(titulo, descricao, objetivo, editar, excluir);
            listaCampanhas.appendChild(card);
        });
    }

    formCampanha.addEventListener("submit", function(event) {
        event.preventDefault();

        const campanha = {
            titulo: campoTitulo.value.trim(),
            descricao: campoDescricao.value.trim(),
            objetivo: campoObjetivo.value.trim()
        };

        if (!campanha.titulo || !campanha.descricao || !campanha.objetivo) {
            alert("Preencha todos os campos obrigatórios (título, descrição e objetivo).");
            return;
        }

        if (indiceEdicao === null) {
            campanhas.push(campanha);
            alert("Campanha cadastrada com sucesso!");
        } else {
            campanhas[indiceEdicao] = campanha;
            alert("Campanha atualizada com sucesso!");
        }

        salvarCampanhas();
        mostrarCampanhas();
        cancelarEdicao();
    });

    function editarCampanha(indice) {
        const campanha = campanhas[indice];

        campoTitulo.value = campanha.titulo;
        campoDescricao.value = campanha.descricao;
        campoObjetivo.value = campanha.objetivo || "";

        indiceEdicao = indice;

        const tituloForm = document.getElementById("tituloFormulario");
        if (tituloForm) tituloForm.textContent = "Editar campanha";
        
        botaoSalvar.textContent = "Salvar alterações";
        if (botaoCancelar) botaoCancelar.hidden = false;

        window.scrollTo(0, 0);
    }

    function excluirCampanha(indice) {
        if (!confirm("Deseja realmente excluir esta campanha?")) return;

        campanhas.splice(indice, 1);

        salvarCampanhas();
        mostrarCampanhas();

        alert("Campanha excluída com sucesso!");
    }

    function cancelarEdicao() {
        formCampanha.reset();
        indiceEdicao = null;

        const tituloForm = document.getElementById("tituloFormulario");
        if (tituloForm) tituloForm.textContent = "Criar nova campanha";
        
        botaoSalvar.textContent = "Cadastrar campanha";
        if (botaoCancelar) botaoCancelar.hidden = true;
    }

    if (botaoCancelar) {
        botaoCancelar.addEventListener("click", cancelarEdicao);
    }

    function mostrarInscricoes() {
        const inscricoes = JSON.parse(
            localStorage.getItem("ecoacaoInscricoes")
        ) || [];

        listaInscricoes.innerHTML = "";

        if (inscricoes.length === 0) {
            listaInscricoes.innerHTML = "<p>Nenhuma demonstração de interesse registrada.</p>";
            return;
        }

        inscricoes.forEach(inscricao => {
            const card = document.createElement("div");
            card.className = "card";

            const titulo = document.createElement("h3");
            titulo.textContent = inscricao.campanha;

            const nome = document.createElement("p");
            nome.textContent = "Estudante: " + inscricao.nome;

            const email = document.createElement("p");
            email.textContent = "E-mail: " + inscricao.email;

            card.append(titulo, nome, email);
            listaInscricoes.appendChild(card);
        });
    }

    const btnSair = document.getElementById("sair");
    if (btnSair) {
        btnSair.addEventListener("click", function(event) {
            event.preventDefault();
            sessionStorage.removeItem("ecoacaoUsuarioLogado");
            window.location.href = "login.html";
        });
    }

    mostrarCampanhas();
    mostrarInscricoes();
}