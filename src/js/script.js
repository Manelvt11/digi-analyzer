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

let paginaAtual = 0;
let totalPaginas = 1;
let termoAtual = "";

const controlesPaginacao = document.createElement("div");
controlesPaginacao.classList.add("paginacao-digimons");
listaCards.insertAdjacentElement("afterend", controlesPaginacao);

async function pesquisarDigimons(pagina = 0) {
    if (!listaCards) return;

    paginaAtual = pagina;
    listaCards.replaceChildren();

    const carregando = document.createElement("p");
    carregando.textContent = "Carregando Digimons...";
    listaCards.appendChild(carregando);

    try {
        const termo = termoAtual.trim();
        let url;

        if (termo && /^\d+$/.test(termo)) {
            url = `https://digi-api.com/api/v1/digimon/${termo}`;
        } else {
            const parametros = new URLSearchParams({
                page: paginaAtual,
                pageSize: 20
            });

            if (termo) {
                parametros.set("name", termo);
            }

            url = `https://digi-api.com/api/v1/digimon?${parametros}`;
        }

        const resposta = await fetch(url);

        if (!resposta.ok) {
            throw new Error("Não foi possível consultar a API.");
        }

        const dados = await resposta.json();

        const digimonsEncontrados = termo && /^\d+$/.test(termo)
            ? [dados]
            : (dados.content || []);

        totalPaginas = termo && /^\d+$/.test(termo)
            ? 1
            : (dados.pageable?.totalPages || 1);

        renderizarCards(digimonsEncontrados);
        renderizarPaginacao();

    } catch (erro) {
        listaCards.replaceChildren();

        const mensagem = document.createElement("p");
        mensagem.textContent =
            "Não foi possível carregar os Digimons. Verifique sua conexão e tente novamente.";

        listaCards.appendChild(mensagem);
        controlesPaginacao.replaceChildren();

        console.error(erro);
    }
}

function renderizarCards(digimonsEncontrados) {
    listaCards.replaceChildren();

    if (!digimonsEncontrados.length) {
        const mensagem = document.createElement("p");
        mensagem.textContent = "Nenhum Digimon encontrado.";
        listaCards.appendChild(mensagem);
        return;
    }

    digimonsEncontrados.forEach((digimon) => {
        const card = document.createElement("a");
        card.classList.add("card-digimon");
        card.href = `detalhes.html?id=${digimon.id}`;

        const imagem = document.createElement("img");
        imagem.src = digimon.image || digimon.images?.[0]?.href || "";
        imagem.alt = digimon.name;
        imagem.loading = "lazy";

        const nome = document.createElement("h3");
        nome.textContent = digimon.name;

        card.append(imagem, nome);
        listaCards.appendChild(card);
    });
}

function renderizarPaginacao() {
    controlesPaginacao.replaceChildren();

    if (termoAtual && /^\d+$/.test(termoAtual.trim())) {
        return;
    }

    const botaoAnterior = document.createElement("button");
    botaoAnterior.textContent = "Anterior";
    botaoAnterior.disabled = paginaAtual <= 0;
    botaoAnterior.addEventListener("click", () => {
        pesquisarDigimons(paginaAtual - 1);
    });

    const indicador = document.createElement("span");
    indicador.textContent = `Página ${paginaAtual + 1} de ${totalPaginas}`;

    const botaoProxima = document.createElement("button");
    botaoProxima.textContent = "Próxima";
    botaoProxima.disabled = paginaAtual >= totalPaginas - 1;
    botaoProxima.addEventListener("click", () => {
        pesquisarDigimons(paginaAtual + 1);
    });

    controlesPaginacao.append(
        botaoAnterior,
        indicador,
        botaoProxima
    );
}

function iniciarBusca() {
    termoAtual = campoBusca.value.trim();
    pesquisarDigimons(0);
}

botaoBusca.addEventListener("click", iniciarBusca);

campoBusca.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter") {
        iniciarBusca();
    }
});

pesquisarDigimons();


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

