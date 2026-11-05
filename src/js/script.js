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
const listaDigimonsCategoria = document.querySelector(".lista-categorias");

const listaAtual = listaCards || listaDigimonsCategoria;

let paginaAtual = 0;
let totalPaginas = 1;
let termoAtual = "";

const parametros = new URLSearchParams(window.location.search);
const nivelSelecionado = (parametros.get("nivel") || "todos").toLowerCase();


let controlesPaginacao = null;

if (listaAtual) {
    controlesPaginacao = document.createElement("div");
    controlesPaginacao.classList.add("paginacao-digimons");
    listaAtual.insertAdjacentElement("afterend", controlesPaginacao);
}

async function pesquisarDigimons(pagina = 0) {
    if (!listaAtual) return;

    paginaAtual = pagina;
    listaAtual.replaceChildren();

    const carregando = document.createElement("p");
    carregando.textContent = "Carregando Digimons...";
    listaAtual.appendChild(carregando);

    try {
        const termo = termoAtual.trim();
        let url;

        if (termo && /^\d+$/.test(termo)) {
            const idFormatado = Number(termo);
            url = `https://digi-api.com/api/v1/digimon/${idFormatado}`;
        } else {
            const consulta = new URLSearchParams({
                page: paginaAtual,
                pageSize: 20
            });

            if (termo) {
                consulta.set("name", termo);
            }

            if (listaDigimonsCategoria && nivelSelecionado !== "todos") {
                const niveisAPI = {
                  rookie: "Child",
                  champion: "Adult",
                  ultimate: "Perfect",
                  mega: "Ultimate"
                }
                consulta.set("level", niveisAPI[nivelSelecionado]);
            }

            url = `https://digi-api.com/api/v1/digimon?${consulta}`;
        }

        const resposta = await fetch(url);

        if (!resposta.ok) {
            throw new Error("Erro ao consultar a Digi-API.");
        }

        const dados = await resposta.json();

        const pesquisaPorId = termo && /^\d+$/.test(termo);

        const resultados = pesquisaPorId
            ? [dados]
            : (dados.content || []);

        totalPaginas = pesquisaPorId
            ? 1
            : (dados.pageable?.totalPages || 1);

        renderizarCards(resultados);
        renderizarPaginacao(pesquisaPorId);

    } catch (erro) {
        console.error(erro);

        listaAtual.replaceChildren();

        const mensagem = document.createElement("p");
        mensagem.textContent =
            "Não foi possível carregar os Digimons. Tente novamente.";

        listaAtual.appendChild(mensagem);

        if (controlesPaginacao) {
            controlesPaginacao.replaceChildren();
        }
    }
}

function renderizarCards(resultados) {
    listaAtual.replaceChildren();

    const mensagemVazia = document.querySelector("#mensagem-vazia");

    if (mensagemVazia) {
        mensagemVazia.style.display = "none";
    }

    if (resultados.length === 0) {
        const mensagem = document.createElement("p");
        mensagem.textContent = listaDigimonsCategoria
            ? "Nenhum Digimon encontrado nesta categoria."
            : "Nenhum Digimon encontrado.";

        listaAtual.appendChild(mensagem);

        return;
    }

    resultados.forEach((digimon) => {
        const card = document.createElement("a");
        card.classList.add("card-digimon");
        card.href = `detalhes.html?id=${digimon.id}`;

        const id = document.createElement("p");
        id.classList.add("id-digimon");
        id.textContent = `#${String(digimon.id).padStart(3, "0")}`;

        const imagem = document.createElement("img");
        imagem.src = digimon.image || digimon.images?.[0]?.href || "";
        imagem.alt = digimon.name || "Digimon";
        imagem.loading = "lazy";

        const nome = document.createElement(
            listaDigimonsCategoria ? "h2" : "h3"
        );

        nome.classList.add("nome-digimon");
        nome.textContent = digimon.name;

        if (listaCards) {
            const favorito = document.createElement("span");
            favorito.classList.add("material-symbols-outlined");
            favorito.textContent = "favorite";

            const atributo = document.createElement("div");
            atributo.classList.add("atributo");
            atributo.textContent =
                digimon.attributes?.[0]?.attribute || "Não informado";

            card.append(id, favorito, imagem, nome, atributo);
        } else {
            card.append(id, imagem, nome);
        }

        listaAtual.appendChild(card);
    });
}

function renderizarPaginacao(pesquisaPorId = false) {
    if (!controlesPaginacao) return;

    controlesPaginacao.replaceChildren();

    if (pesquisaPorId || totalPaginas <= 1) {
        return;
    }

    const anterior = document.createElement("button");
    anterior.textContent = "Anterior";
    anterior.disabled = paginaAtual <= 0;

    anterior.addEventListener("click", () => {
        pesquisarDigimons(paginaAtual - 1);
    });

    const indicador = document.createElement("span");
    indicador.textContent = `Página ${paginaAtual + 1} de ${totalPaginas}`;

    const proxima = document.createElement("button");
    proxima.textContent = "Próxima";
    proxima.disabled = paginaAtual >= totalPaginas - 1;

    proxima.addEventListener("click", () => {
        pesquisarDigimons(paginaAtual + 1);
    });

    controlesPaginacao.append(anterior, indicador, proxima);
}


function iniciarBusca() {
    if (!campoBusca) return;

    termoAtual = campoBusca.value.trim();
    pesquisarDigimons(0);
}

botaoBusca?.addEventListener("click", iniciarBusca);

campoBusca?.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter") {
        iniciarBusca();
    }
});


if (listaAtual) {
    pesquisarDigimons();
}

async function buscarDigimonAPI(id) {
    const carregamento = document.querySelector("#estado-carregamento");
    const mensagemErro = document.querySelector("#mensagem-erro");

    if(carregamento) carregamento.hidden = false;
    if(mensagemErro) mensagemErro.hidden = true;

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

        if (mensagemErro){
          mensagemErro.textContent = "Erro ao carregar o Digimon. Tente novamente.";
          mensagemErro.hidden = false;
        }

    } finally {
        if(carregamento) carregamento.hidden = true;
    }
}

