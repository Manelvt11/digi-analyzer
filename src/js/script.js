//dados dos digimons
const digimons = [
    {
        nome: "Agumon",
        id: "#001",
        imagem: "./assets/images/agumon.png",
        nivel: "Rookie",
        tipo: "Reptile",
        areas: "Nature Spirits",
        descricao: "Um Digimon com um grande coração e muito leal ao seu treinador",
        habilidades: [
            ["Pepper Breath", "Dispara uma rajada de fogo pela boca."],
            ["Spitfire Blast", "Lança um poderoso ataque de fogo contra o inimigo."]
        ]
    },
    {
        nome: "Gabumon",
        id: "#002",
        imagem: "./assets/images/gabumon.png",
        nivel: "Rookie",
        tipo: "Reptile",
        areas: "Nature Spirits",
        descricao: "Um Digimon tímido que usa uma pele para esconder sua verdadeira aparência.",
        habilidades: [
            ["Blue Blaster", "Dispara uma rajada de ar congelante."],
            ["Petit Fire", "Lança uma pequena bola de fogo."]
        ]
    },
    {
        nome: "Patamon",
        id: "#003",
        imagem: "./assets/images/patamon.png",
        nivel: "Rookie",
        tipo: "Mammal",
        areas: "Wind Guardians",
        descricao: "Um Digimon pequeno e amigável que possui grandes asas.",
        habilidades: [
            ["Boom Bubble", "Dispara uma bolha de ar contra o inimigo."],
            ["Air Shot", "Lança uma poderosa rajada de ar."]
        ]
    }
];

let digimonAtual = 0;

// elementos da pagina inicial

const botaoAnterior = document.querySelector(".botao-anterior");
const botaoProximo = document.querySelector(".botao-proximo");

if (botaoAnterior && botaoProximo) {
    const imagem = document.querySelector(".card-destaque > img");
    const nome = document.querySelector(".info-destaque h3");
    const id = document.querySelector(".info-destaque .id-digimon");
    const nivel = document.querySelector(".info-destaque .cat-digimon");
    const tipo = document.querySelector(".tipo-digimon");
    const areas = document.querySelector(".areas-digimon");
    const descricao = document.querySelector(".descr-digimon");
    const habilidades = document.querySelectorAll(".habilidade");
    const indicadores = document.querySelectorAll(".bolinha");

    // funcao para atualizar as informacoes do destaque
    function atualizarDigimon() {
        const digimon = digimons[digimonAtual];

        imagem.src = digimon.imagem;
        imagem.alt = digimon.nome;

        nome.textContent = digimon.nome;
        id.textContent = digimon.id;
        nivel.textContent = "Nível: " + digimon.nivel;
        tipo.textContent = "Tipo: " + digimon.tipo;
        areas.textContent = "Áreas: " + digimon.areas;
        descricao.textContent = digimon.descricao;

        habilidades.forEach((habilidade, indice) => {
            habilidade.querySelector("h5").textContent = digimon.habilidades[indice][0];
            habilidade.querySelector("p").textContent = digimon.habilidades[indice][1];
        });

        indicadores.forEach((bolinha, indice) => {
            bolinha.classList.toggle(
                "ativa",
                indice === digimonAtual
            );
        });
    }

    // botao proximo
    botaoProximo.addEventListener("click", () => {
        digimonAtual++;
        if (digimonAtual >= digimons.length) {
            digimonAtual = 0;
        }
        atualizarDigimon();
    });

    //botao anterior
    botaoAnterior.addEventListener("click", () => {
        digimonAtual--;
        if (digimonAtual < 0) {
            digimonAtual = digimons.length - 1;
        }
        atualizarDigimon();
    });
}

const parametroId = new URLSearchParams(window.location.search).get("id");

if (parametroId) {
    const digimonDetalhes = digimons.find(digimon => digimon.id === "#" + parametroId);

    if (digimonDetalhes) {
        const imagemDetalhes = document.querySelector(".imagem-digimon img");
        const nomeDetalhes = document.querySelector(".informacoes-digimon h2");
        const idDetalhes = document.querySelector(".informacoes-digimon .id-digimon");
        const nivelDetalhes = document.querySelector(".informacoes-digimon .nivel-digimon");
        const tipoDetalhes = document.querySelector(".informacoes-digimon .tipo-digimon");
        const areasDetalhes = document.querySelector(".informacoes-digimon .areas-digimon");
        const descricaoDetalhes = document.querySelector(".descricao-digimon p");
        const habilidadesDetalhes = document.querySelectorAll(".habilidades-digimon .habilidade");

        imagemDetalhes.src = digimonDetalhes.imagem;
        imagemDetalhes.alt = digimonDetalhes.nome;
        nomeDetalhes.textContent = digimonDetalhes.nome;
        idDetalhes.textContent = digimonDetalhes.id;
        nivelDetalhes.textContent = "Nível: " + digimonDetalhes.nivel;
        tipoDetalhes.textContent = "Tipo: " + digimonDetalhes.tipo;
        areasDetalhes.textContent = "Áreas: " + digimonDetalhes.areas;

        descricaoDetalhes.textContent =
            digimonDetalhes.descricao;

        habilidadesDetalhes.forEach((habilidade, indice) => {
            if (digimonDetalhes.habilidades[indice]) {
                habilidade.querySelector("h3").textContent = digimonDetalhes.habilidades[indice][0];
                habilidade.querySelector("p").textContent = digimonDetalhes.habilidades[indice][1];
            }
        });
    }
}