const { defineConfig } = require("cypress");
const cypressEnv = require("./cypress.env.json");
const cucumber = require("cypress-cucumber-preprocessor").default;

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

  defaultCommandTimeout: 10000,
  requestTimeout: 20000,
  responseTimeout: 20000,

  retries: {
    runMode: 1,
    openMode: 0,
  },

  video: false,
  screenshotOnRunFailure: false,

  e2e: {
    specPattern: [
      "cypress/tests/API/**/*.cy.{js,jsx,ts,tsx}",
      "cypress/tests/E2E/**/*.cy.{js,jsx,ts,tsx}",
      "cypress/tests/cucumber/features/**/*.feature",
    ],
    supportFile: "cypress/support/e2e.js",
    setupNodeEvents(on, config) {
      on("file:preprocessor", cucumber());
      return config;
    },
  },
});
