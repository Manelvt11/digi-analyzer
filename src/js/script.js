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
      ["Spitfire Blast", "Lança um poderoso ataque de fogo contra o inimigo."],
    ],
  },
  {
    nome: "Gabumon",
    id: "#002",
    imagem: "./assets/images/gabumon.png",
    nivel: "Rookie",
    tipo: "Reptile",
    areas: "Nature Spirits",
    descricao:
      "Um Digimon tímido que usa uma pele para esconder sua verdadeira aparência.",
    habilidades: [
      ["Blue Blaster", "Dispara uma rajada de ar congelante."],
      ["Petit Fire", "Lança uma pequena bola de fogo."],
    ],
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
      ["Air Shot", "Lança uma poderosa rajada de ar."],
    ],
  },
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
      habilidade.querySelector("h5").textContent =
        digimon.habilidades[indice][0];
      habilidade.querySelector("p").textContent =
        digimon.habilidades[indice][1];
    });

    indicadores.forEach((bolinha, indice) => {
      bolinha.classList.toggle("ativa", indice === digimonAtual);
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

if (parametroId){
  const digimonLocal = digimons.find(
    digimon => digimon.id === "#" + parametroId
  )

  if (digimonLocal){
    buscarDigimonAPI(digimonLocal.nome)
  } else{
    buscarDigimonAPI(parametroId)
  }
}

const campoBusca = document.querySelector(".content-busca input");
const botaoBusca = document.querySelector(".content-busca button");
const listaCards = document.querySelector(".cards-digimons");

if (campoBusca && botaoBusca && listaCards) {
  const cards = listaCards.querySelectorAll(".card-digimon");

  const mensagemBusca = document.createElement("p");
  mensagemBusca.textContent = "Nenhum digimon encontrado";
  mensagemBusca.style.display = "none";
  mensagemBusca.style.gridColumn = "1 / -1";
  mensagemBusca.style.textAlign = "center";

  listaCards.appendChild(mensagemBusca);

  function pesquisarDigimons() {
    const termo = campoBusca.value.trim().toLowerCase();
    let encontrados = 0;

    cards.forEach((card) => {
      const nome = card
        .querySelector(".nome-digimon")
        .textContent.toLowerCase();

      const id = card
        .querySelector(".id-digimon")
        .textContent.replace("#", "")
        .toLowerCase();

      const corresponde =
        nome.includes(termo) || id.includes(termo.replace("#", ""));

      card.style.display = corresponde ? "" : "none";

      if (corresponde) {
        encontrados++;
      }
    });

    mensagemBusca.style.display = encontrados === 0 ? "block" : "none";
  }

  campoBusca.addEventListener("input", pesquisarDigimons);
  botaoBusca.addEventListener("click", () => {
    pesquisarDigimons();
    listaCards.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
  campoBusca.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter") {
      pesquisarDigimons();

      listaCards.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
}

const parametroNivel = new URLSearchParams(window.location.search).get("nivel");

if (parametroNivel && listaCards) {
  const nivelSelecionado = parametroNivel.toLowerCase();
  const cards = listaCards.querySelectorAll(".card-digimon");

  cards.forEach((card) => {
    const nome = card.querySelector(".nome-digimon").textContent.trim();

    const digimon = digimons.find(
      (item) => item.nome.toLowerCase() === nome.toLowerCase(),
    );

    if (!digimon) {
      card.style.display = "none";
      return;
    }

    const corresponde =
      nivelSelecionado === "todos" ||
      digimon.nivel.toLowerCase() === nivelSelecionado;

    card.style.display = corresponde ? "" : "none";
  });

  listaCards.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}


const listaDigimonsCategoria = document.querySelector(".lista-categorias");

if (listaDigimonsCategoria) {
    const parametros = new URLSearchParams(window.location.search);
    const nivelSelecionado = (parametros.get("nivel") || "todos")
        .toLowerCase();

    const tituloCategoria = document.querySelector("#titulo-categoria");
    const descricaoCategoria = document.querySelector("#descricao-categoria");
    const mensagemVazia = document.querySelector("#mensagem-vazia");

    const niveis = {
        todos: {
            titulo: "Todos os Digimons",
            descricao: "Confira todos os Digimons disponíveis."
        },
        rookie: {
            titulo: "Digimons Rookie",
            descricao: "Confira os Digimons do nível Rookie."
        },
        champion: {
            titulo: "Digimons Champion",
            descricao: "Confira os Digimons do nível Champion."
        },
        ultimate: {
            titulo: "Digimons Ultimate",
            descricao: "Confira os Digimons do nível Ultimate."
        },
        mega: {
            titulo: "Digimons Mega",
            descricao: "Confira os Digimons do nível Mega."
        }
    };

    const categoria = niveis[nivelSelecionado] || niveis.todos;

    tituloCategoria.textContent = categoria.titulo;
    descricaoCategoria.textContent = categoria.descricao;

    const digimonsFiltrados = digimons.filter(digimon => {
        return nivelSelecionado === "todos" ||
            digimon.nivel.toLowerCase() === nivelSelecionado;
    });

    digimonsFiltrados.forEach(digimon => {
        const card = document.createElement("a");
        card.classList.add("card-digimon");
        card.href = `detalhes.html?id=${digimon.id.replace("#", "")}`;

        const id = document.createElement("p");
        id.classList.add("id-digimon");
        id.textContent = digimon.id;

        const imagem = document.createElement("img");
        imagem.src = digimon.imagem;
        imagem.alt = digimon.nome;

        const nome = document.createElement("h2");
        nome.classList.add("nome-digimon");
        nome.textContent = digimon.nome;

        card.append(id, imagem, nome);
        listaDigimonsCategoria.appendChild(card);
    });

    mensagemVazia.style.display =
        digimonsFiltrados.length === 0 ? "block" : "none";
}


async function buscarDigimonAPI(id) {
    const carregamento = document.querySelector("#estado-carregamento");
    const mensagemErro = document.querySelector("#mensagem-erro");

    carregamento.hidden = false;
    mensagemErro.hidden = true;

    try {
        const resposta = await fetch(
            `https://digi-api.com/api/v1/digimon/${encodeURIComponent(id)}`
        );

        if (!resposta.ok) {
            throw new Error("Erro ao consultar a API");
        }

        const d = await resposta.json();

        document.querySelector(".imagem-digimon img").src =
            d.images?.[0]?.href || "";

        document.querySelector(".imagem-digimon img").alt = d.name || "";

        document.querySelector(".informacoes-digimon h2").textContent = d.name;

        document.querySelector(".informacoes-digimon .id-digimon").textContent =
            `ID: #${String(d.id).padStart(3, "0")}`;

        document.querySelector(".informacoes-digimon .nivel-digimon").textContent =
            "Nível: " + (d.levels?.map(x => x.level).filter(Boolean).join(", ") || "Não informado");

        document.querySelector(".informacoes-digimon .tipo-digimon").textContent =
            "Tipo: " + (d.types?.map(x => x.type).filter(Boolean).join(", ") || "Não informado");

        document.querySelector(".informacoes-digimon .areas-digimon").textContent =
            "Áreas: " + (d.fields?.map(x => x.field).filter(Boolean).join(", ") || "Não informado");

        document.querySelector(".descricao-digimon p").textContent =
            d.descriptions?.find(x => x.language === "en_us")?.description ||
            d.descriptions?.[0]?.description || "Descrição indisponível.";

        const habilidades = document.querySelectorAll(".habilidades-digimon .habilidade");

        habilidades.forEach((el, i) => {
            const h = d.skills?.[i];
            el.hidden = !h;

            if (h) {
                el.querySelector("h3").textContent = h.skill || "Habilidade";
                el.querySelector("p").textContent =
                    h.description || "Descrição indisponível.";
            }
        });

    } catch (erro) {
        console.error(erro);
        mensagemErro.textContent = "Erro ao carregar o Digimon. Tente novamente.";
        mensagemErro.hidden = false;

    } finally {
        carregamento.hidden = true;
    }
}

