# Projeto de Automação de Testes — Cypress

Suíte de testes automatizados escrita em JavaScript com
[Cypress](https://www.cypress.io/), cobrindo:

- **API (REST)** da [reqres.in](https://reqres.in);
- **E2E (UI)** do [SauceDemo](https://www.saucedemo.com/) — fluxos de login e checkout.

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
├─ fixtures/
│  ├─ credentials.json      # Massa de dados de login/registro da API
│  ├─ user.json             # Massa de dados de atualização (PUT/PATCH)
│  ├─ users.json            # Usuários, senha e mensagens de erro do SauceDemo
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
```

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
