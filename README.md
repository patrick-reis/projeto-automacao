# Projeto de Automação de Testes — Cypress

[![Testes Automatizados](https://github.com/patrick-reis/projeto-automacao/actions/workflows/tests.yml/badge.svg)](https://github.com/patrick-reis/projeto-automacao/actions/workflows/tests.yml)
[![Allure Report](https://img.shields.io/badge/Allure%20Report-última%20execução-ee2a4c)](https://patrick-reis.github.io/projeto-automacao/)

> 📊 **[Ver o relatório Allure da última execução »](https://patrick-reis.github.io/projeto-automacao/)**
> (publicado automaticamente no GitHub Pages a cada execução do workflow no GitHub Actions)

Suíte de testes automatizados escrita em JavaScript com
[Cypress](https://www.cypress.io/), cobrindo:

- **API (REST)** da [reqres.in](https://reqres.in);
- **E2E (UI)** do [SauceDemo](https://www.saucedemo.com/) — fluxos de login e checkout;
- **BDD (Cucumber + Page Objects)** — os mesmos fluxos E2E reescritos em Gherkin,
  usando [@badeball/cypress-cucumber-preprocessor](https://github.com/badeball/cypress-cucumber-preprocessor).

Os resultados de toda a suíte (API, E2E e BDD) são reportados com
[Allure Report](https://allurereport.org/docs/cypress/).

## 📁 Estrutura

```
cypress/
├─ tests/
│  ├─ API/
│  │  ├─ getUsers.cy.js     # GET    /api/users (lista, paginação, usuário único)
│  │  ├─ register.cy.js     # POST   /api/register
│  │  ├─ login.cy.js        # POST   /api/login
│  │  ├─ updateUser.cy.js   # PUT/PATCH /api/users/:id
│  │  └─ deleteUser.cy.js   # DELETE /api/users/:id
│  └─ E2E/
│     ├─ login.cy.js        # Login do SauceDemo (fluxos positivos e negativos)
│     └─ checkout.cy.js     # Checkout do SauceDemo (compra completa e validações)
│  └─ cucumber/             # Mesmos fluxos E2E em BDD (Gherkin + Page Objects)
│     ├─ features/          # Arquivos .feature (cenários em Gherkin, pt-BR)
│     │  ├─ login.feature
│     │  └─ checkout.feature
│     ├─ pageObjects/       # Page Object Pattern (sem comandos customizados)
│     │  ├─ LoginPage.js
│     │  ├─ InventoryPage.js
│     │  ├─ CartPage.js
│     │  └─ CheckoutPage.js
│     └─ step_definitions/  # Implementação dos passos (usam os Page Objects)
│        ├─ login.steps.js
│        └─ checkout.steps.js
├─ fixtures/
│  ├─ credentials.json      # Massa de dados de login/registro da API
│  ├─ user.json             # Massa de dados de atualização (PUT/PATCH)
│  ├─ userSauceDemo.json    # Usuários, senha e mensagens de erro do SauceDemo
│  └─ checkout.json         # Comprador, produtos e mensagens do checkout
└─ support/
   ├─ commands.js           # Comandos customizados (cy.apiRequest, cy.login, etc.)
   ├─ endpoints.js          # Endpoints centralizados
   ├─ assertions.js         # Asserções de schema reutilizáveis
   └─ index.d.ts            # Tipagem dos comandos customizados (IntelliSense)
```

## ▶️ Como executar

```bash
npm install          # instala as dependências (Cypress)

npm run cy:open      # abre o Cypress (modo interativo)
npm run cy:run       # executa toda a suíte (headless)
npm run test:api     # executa apenas os testes da pasta cypress/tests/API
npm run test:e2e     # executa apenas os testes da pasta cypress/tests/E2E
npm run test:cucumber # executa apenas os testes BDD (.feature) da pasta cypress/tests/cucumber
```

## 📊 Relatório Allure

A suíte é instrumentada pelo [Allure Report](https://allurereport.org/docs/cypress/)
(lib `allure-cypress`). Cada execução do Cypress grava os resultados na pasta
`allure-results/`, e a CLI converte esses resultados em um relatório HTML em
`allure-report/`.

> ⚠️ A CLI do Allure (`allure-commandline`) **requer Java (JRE 8+)** instalado e
> disponível no `PATH`.

```bash
npm run test:report   # limpa, executa toda a suíte, gera e abre o relatório

# Ou passo a passo:
npm run allure:clean    # remove allure-results/ e allure-report/
npm run cy:run          # executa os testes (gera allure-results/)
npm run allure:generate # gera o HTML em allure-report/
npm run allure:open     # abre o relatório já gerado
npm run allure:serve    # gera um relatório temporário e abre direto de allure-results/
```

Como os resultados são gravados mesmo quando há falhas, é possível rodar
`npm run allure:serve` (ou `allure:generate` + `allure:open`) após qualquer
execução — inclusive as que falharam — para inspecionar o relatório. As pastas
`allure-results/` e `allure-report/` são ignoradas pelo Git.

## � Integração Contínua (GitHub Actions)

O workflow [`.github/workflows/tests.yml`](.github/workflows/tests.yml) executa
toda a suíte na nuvem e publica o relatório Allure no **GitHub Pages**, de forma
que a **última execução** fique sempre acessível pelo badge no topo deste README:

> 📊 **[Ver o relatório Allure da última execução »](https://patrick-reis.github.io/projeto-automacao/)**

### ▶️ Como disparar

É um workflow de **execução manual** (sem parâmetros): acesse a aba **Actions**
do repositório → **Testes Automatizados** → **Run workflow**.

A cada execução o pipeline:

1. Instala as dependências e o Cypress (com cache) e roda a suíte (`cypress run`);
2. Converte os resultados (`allure-results/`) em relatório HTML **com histórico**
   ([`simple-elf/allure-report-action`](https://github.com/simple-elf/allure-report-action));
3. Publica o relatório na branch `gh-pages`
   ([`peaceiris/actions-gh-pages`](https://github.com/peaceiris/actions-gh-pages)),
   atualizando o link acima.

> ℹ️ O relatório é publicado mesmo quando há testes falhando (passos com
> `if: always()`), permitindo investigar as falhas pelo Allure.

### ⚙️ Configuração inicial (uma única vez)

1. **Secret da API** — em **Settings → Secrets and variables → Actions**, crie um
   secret `CYPRESS_APIKEY` com a chave da [reqres.in](https://reqres.in)
   (mesmo valor de `apiKey` no seu `cypress.env.json`). Sem ele, os testes de API
   retornam `401`. O workflow o injeta como `CYPRESS_apiKey`, sobrescrevendo o
   valor da config.
2. **GitHub Pages** — rode o workflow uma vez (isso cria a branch `gh-pages`) e
   então, em **Settings → Pages**, defina **Source: Deploy from a branch** e
   selecione a branch **`gh-pages`** (pasta `/root`). A partir daí o link do
   relatório passa a funcionar.

## �🥒 Testes BDD (Cucumber + Page Objects)

A pasta `cypress/tests/cucumber` contém os **mesmos fluxos** de `E2E`, porém com
uma arquitetura diferente, propositalmente desacoplada da suíte tradicional:

- **Gherkin (pt-BR)**: cada cenário é descrito em linguagem natural nos arquivos
  `.feature` (`#language: pt`), facilitando a leitura por pessoas não técnicas.
- **Page Object Pattern**: a interação com a aplicação fica nas classes de
  `pageObjects/` (seletores + ações), deixando os passos limpos e reaproveitáveis.
- **Sem comandos customizados**: diferente da suíte E2E (que usa `cy.login`,
  `cy.addProductToCart`, etc.), os passos do Cucumber chamam apenas os Page Objects
  e comandos nativos do Cypress.

O [@badeball/cypress-cucumber-preprocessor](https://github.com/badeball/cypress-cucumber-preprocessor)
é registrado em `cypress.config.js` (via bundler esbuild) e os _step definitions_
globais são apontados em `package.json`
(`cypress-cucumber-preprocessor.stepDefinitions`). Arquivos `*.cy.js` (API e E2E)
**não** passam pelo Cucumber e continuam funcionando normalmente.

> ℹ️ O `cypress-on-fix` é usado para que o Allure e o Cucumber possam escutar os
> mesmos eventos do Cypress (`after:spec`/`after:run`) sem conflito.

## ✅ Boas práticas aplicadas

- **URLs e variáveis de ambiente** centralizadas em `cypress.config.js` (`env`):
  `apiUrl` (reqres.in), `e2eUrl` (SauceDemo) e `apiKey` (sobrescrita via
  `CYPRESS_apiKey=<valor>`).
- **Comandos customizados enxutos**: `cy.apiRequest` (injeta autenticação e não
  falha por status code), `cy.login`, `cy.addProductToCart` e `cy.fillCheckoutInfo`
  (os comandos de formulário ignoram campos vazios para testar campos obrigatórios).
- **Cenários positivos e negativos**: compra de um e de múltiplos produtos,
  campos obrigatórios em branco, credenciais inválidas e usuário bloqueado.
- **Validação da navegação**: nos testes E2E verifica-se a mudança de rota em
  cada etapa (`/cart.html`, `/checkout-step-*`, `/checkout-complete.html`), os
  itens do carrinho e as mensagens de sucesso/erro exibidas.
- **Validações robustas**: o total do pedido é conferido a partir dos valores
  exibidos na tela (subtotal + imposto), evitando números fixos e instabilidade.
- **Fixtures** para separar a massa de dados dos testes.
- **Asserções de schema** reutilizáveis para validar o contrato da API.

## 🔑 Autenticação

A API da reqres.in exige o header `x-api-key`. A chave padrão está definida em
`cypress.config.js` (`env.apiKey`) e é injetada automaticamente pelo comando
`cy.apiRequest`. Para os cenários negativos de autenticação, use `auth: false`.
