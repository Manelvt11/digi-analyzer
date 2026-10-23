# Digi-Analyzer

Digi-Analyzer é um site desenvolvido para consulta de informações sobre Digimons. O projeto apresenta os Digimons em cards e permite visualizar informações detalhadas de cada um.

## Integrantes
- Manoel Vitor do Nacimento Brito
- Adaylton José Rodrigues Borges
- Juan Oliveira Fonseca
- Gabriel Medeiros Soares

## Sobre o projeto

O projeto foi desenvolvido como atividade escolar utilizando HTML, CSS e JavaScript.

A proposta é criar uma espécie de base de consulta de Digimons, permitindo visualizar informações como:

- Nome
- ID
- Imagem
- Descrição
- Tipo
- Áreas
- Nível
- Habilidades

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript
- API Digi-API

## Consulta à API

O projeto utiliza a Digi-API para consultar informações dos Digimons na página de detalhes.

**Endpoint utilizado:**

`https://digi-api.com/api/v1/digimon/{id}`

O parâmetro `{id}` representa o identificador ou nome do Digimon consultado.

**Campos utilizados da resposta:**

- `id`: identificador do Digimon.
- `name`: nome do Digimon.
- `images`: imagem do Digimon.
- `levels`: nível.
- `types`: tipo.
- `fields`: áreas relacionadas.
- `descriptions`: descrição.
- `skills`: habilidades.

A consulta é realizada com JavaScript utilizando `fetch`. A resposta é convertida para JSON e os dados recebidos são apresentados na página de detalhes. Caso ocorra uma falha na consulta, o site apresenta uma mensagem de erro e encerra o estado de carregamento.