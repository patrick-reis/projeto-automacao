const { defineConfig } = require("cypress");
const cypressEnv = require("./cypress.env.json");

module.exports = defineConfig({
  // Variáveis de ambiente acessíveis via Cypress.env('...').
  // - apiKey: importada de cypress.env.json (sobrescreva com CYPRESS_apiKey=<valor>).
  // - apiUrl: URL base da API (reqres.in), prefixada pelo comando cy.apiRequest.
  // - e2eUrl: URL base da aplicação E2E (SauceDemo), usada nos testes de UI.
  env: {
    apiKey: cypressEnv.apiKey,
    apiUrl: "https://reqres.in",
    e2eUrl: "https://www.saucedemo.com/",
  },

  // Timeouts maiores por se tratar de chamadas a uma API real.
  defaultCommandTimeout: 10000,
  requestTimeout: 20000,
  responseTimeout: 20000,

  // Reexecuta specs instáveis (ex.: oscilação de rede) apenas em modo headless.
  retries: {
    runMode: 1,
    openMode: 0,
  },

  // Suíte de API não precisa de vídeo/screenshots.
  video: false,
  screenshotOnRunFailure: false,

  e2e: {
    specPattern: "cypress/tests/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.js",
    setupNodeEvents(on, config) {
      // Local para listeners de eventos do Node, se necessário.
      return config;
    },
  },
});
