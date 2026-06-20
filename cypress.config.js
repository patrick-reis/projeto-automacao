const { defineConfig } = require("cypress");
const cypressEnv = require("./cypress.env.json");

module.exports = defineConfig({
  // Variáveis de ambiente acessíveis via Cypress.env('...').
  // O valor da apiKey é importado do arquivo cypress.env.json.
  // Pode ser sobrescrita em CI/local com a variável CYPRESS_apiKey=<valor>.
  env: {
    apiKey: cypressEnv.apiKey,
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
    baseUrl: "https://reqres.in",
    specPattern: "cypress/tests/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.js",
    setupNodeEvents(on, config) {
      // Local para listeners de eventos do Node, se necessário.
      return config;
    },
  },
});
