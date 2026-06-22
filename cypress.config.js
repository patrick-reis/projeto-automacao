const { defineConfig } = require("cypress");
const { allureCypress } = require("allure-cypress/reporter");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const {
  addCucumberPreprocessorPlugin,
} = require("@badeball/cypress-cucumber-preprocessor");
const {
  createEsbuildPlugin,
} = require("@badeball/cypress-cucumber-preprocessor/esbuild");
const cypressOnFix = require("cypress-on-fix");
const os = require("node:os");
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
    async setupNodeEvents(on, config) {
      // cypress-on-fix permite que vários plugins escutem os mesmos eventos
      // (after:spec/after:run do Allure + Cucumber) sem conflito.
      on = cypressOnFix(on);

      // Cucumber (.feature) com bundler esbuild — suporta sintaxe JS moderna,
      // necessária para o allure-cypress.
      await addCucumberPreprocessorPlugin(on, config);
      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );

      // Allure Report (https://allurereport.org/docs/cypress/)
      // Gera os resultados em "allure-results" para todos os specs (API, E2E e Cucumber).
      allureCypress(on, config, {
        resultsDir: "allure-results",
        environmentInfo: {
          os_platform: os.platform(),
          os_release: os.release(),
          node_version: process.version,
        },
      });

      return config;
    },
  },
});
