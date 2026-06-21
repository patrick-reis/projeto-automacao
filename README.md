# Projeto de Automação de Testes — Cypress

Suíte de testes automatizados escrita em JavaScript com
[Cypress](https://www.cypress.io/), cobrindo:

- **API (REST)** da [reqres.in](https://reqres.in);
- **E2E (UI)** do [SauceDemo](https://www.saucedemo.com/) — fluxos de login e checkout;
- **BDD (Cucumber + Page Objects)** — os mesmos fluxos E2E reescritos em Gherkin,
  usando [cypress-cucumber-preprocessor](https://www.npmjs.com/package/cypress-cucumber-preprocessor).

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

## 🥒 Testes BDD (Cucumber + Page Objects)

A pasta `cypress/tests/cucumber` contém os **mesmos fluxos** de `E2E`, porém com
uma arquitetura diferente, propositalmente desacoplada da suíte tradicional:

- **Gherkin (pt-BR)**: cada cenário é descrito em linguagem natural nos arquivos
  `.feature` (`#language: pt`), facilitando a leitura por pessoas não técnicas.
- **Page Object Pattern**: a interação com a aplicação fica nas classes de
  `pageObjects/` (seletores + ações), deixando os passos limpos e reaproveitáveis.
- **Sem comandos customizados**: diferente da suíte E2E (que usa `cy.login`,
  `cy.addProductToCart`, etc.), os passos do Cucumber chamam apenas os Page Objects
  e comandos nativos do Cypress.

O [cypress-cucumber-preprocessor](https://www.npmjs.com/package/cypress-cucumber-preprocessor)
é registrado em `cypress.config.js` (`on('file:preprocessor', cucumber())`) e os
_step definitions_ globais são apontados em `package.json`
(`cypress-cucumber-preprocessor.step_definitions`). Arquivos `*.cy.js` (API e E2E)
**não** passam pelo Cucumber e continuam funcionando normalmente.

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
