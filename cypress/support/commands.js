/**
 * cy.apiRequest() — wrapper simples de cy.request() para testes de API.
 *
 *  - Prefixa a `url` com `Cypress.env('apiUrl')` (passe sempre caminhos relativos).
 *  - Injeta o header `x-api-key` automaticamente (use `auth: false` para desativar).
 *  - Não falha em status de erro (`failOnStatusCode: false`), permitindo asserts de 4xx/5xx.
 *  - Headers passados manualmente têm prioridade (ex.: enviar um `x-api-key` inválido).
 *
 * @param {object} options Opções de cy.request() + `auth` (default: true).
 */
Cypress.Commands.add('apiRequest', ({ auth = true, headers = {}, url, ...options }) => {
  const finalHeaders = auth
    ? { 'x-api-key': Cypress.env('apiKey'), ...headers }
    : headers

  return cy.request({
    ...options,
    url: `${Cypress.env('apiUrl')}${url}`,
    headers: finalHeaders,
    failOnStatusCode: false,
  })
})

/**
 * cy.login() — Preenche o formulário de login do SauceDemo e o submete.
 * Campos vazios são ignorados, permitindo testar os campos obrigatórios.
 *
 * @param {string} [username] Usuário a ser digitado.
 * @param {string} [password] Senha a ser digitada.
 */
Cypress.Commands.add('login', (username, password) => {
  if (username) cy.get('[data-test="username"]').type(username)
  if (password) cy.get('[data-test="password"]').type(password)
  cy.get('[data-test="login-button"]').click()
})

/**
 * cy.addProductToCart() — Adiciona um produto ao carrinho na página de produtos.
 *
 * @param {string} productId Sufixo do data-test do produto (ex.: 'sauce-labs-backpack').
 */
Cypress.Commands.add('addProductToCart', (productId) => {
  cy.get(`[data-test="add-to-cart-${productId}"]`).click()
})

/**
 * cy.fillCheckoutInfo() — Preenche a 1ª etapa do checkout (dados do comprador) e continua.
 * Campos vazios são ignorados, permitindo testar os campos obrigatórios.
 *
 * @param {string} [firstName]  Primeiro nome.
 * @param {string} [lastName]   Sobrenome.
 * @param {string} [postalCode] CEP / código postal.
 */
Cypress.Commands.add('fillCheckoutInfo', (firstName, lastName, postalCode) => {
  if (firstName) cy.get('[data-test="firstName"]').type(firstName)
  if (lastName) cy.get('[data-test="lastName"]').type(lastName)
  if (postalCode) cy.get('[data-test="postalCode"]').type(postalCode)
  cy.get('[data-test="continue"]').click()
})