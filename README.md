# Projeto de Automação de Testes de API — Cypress

Suíte de testes de API (REST) para a [reqres.in](https://reqres.in), escrita em
JavaScript com [Cypress](https://www.cypress.io/).

## 📁 Estrutura

```
cypress/
├─ e2e/
│  └─ API/
│     ├─ getUsers.cy.js     # GET    /api/users (lista, paginação, usuário único)
│     ├─ register.cy.js     # POST   /api/register
│     ├─ login.cy.js        # POST   /api/login
│     ├─ updateUser.cy.js   # PUT/PATCH /api/users/:id
│     └─ deleteUser.cy.js   # DELETE /api/users/:id
├─ fixtures/
│  ├─ credentials.json      # Massa de dados de login/registro (válida e inválida)
│  └─ user.json             # Massa de dados de atualização (PUT/PATCH)
└─ support/
   ├─ commands.js           # Comando customizado cy.apiRequest()
   ├─ endpoints.js          # Endpoints centralizados
   ├─ assertions.js         # Asserções de schema reutilizáveis
   └─ index.d.ts            # Tipagem do comando customizado (IntelliSense)
```

## ▶️ Como executar

```bash
npm install          # instala as dependências (Cypress)

npm run cy:open      # abre o Cypress (modo interativo)
npm run cy:run       # executa toda a suíte (headless)
npm run test:api     # executa apenas os testes da pasta cypress/e2e/API
```

## ✅ Boas práticas aplicadas

- **`baseUrl` e variáveis de ambiente** centralizadas em `cypress.config.js`
  (a API key pode ser sobrescrita via `CYPRESS_apiKey=<valor>`).
- **Comando customizado `cy.apiRequest`** que injeta autenticação e não falha por
  status code (permitindo asserts negativos).
- **Cenários positivos e negativos**: entradas válidas, campos ausentes, payload
  malformado, autenticação ausente/ inválida e método HTTP inválido.
- **Validação completa da resposta**: status code, headers e corpo.
- **Fixtures** para separar a massa de dados dos testes.
- **Asserções de schema** reutilizáveis para validar o contrato da API.

## 🔑 Autenticação

A API da reqres.in exige o header `x-api-key`. A chave padrão está definida em
`cypress.config.js` (`env.apiKey`) e é injetada automaticamente pelo comando
`cy.apiRequest`. Para os cenários negativos de autenticação, use `auth: false`.
