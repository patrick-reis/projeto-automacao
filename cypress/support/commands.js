/**
 * cy.apiRequest() — wrapper simples de cy.request() para testes de API.
 *
 *  - Injeta o header `x-api-key` automaticamente (use `auth: false` para desativar).
 *  - Não falha em status de erro (`failOnStatusCode: false`), permitindo asserts de 4xx/5xx.
 *  - Headers passados manualmente têm prioridade (ex.: enviar um `x-api-key` inválido).
 *
 * @param {object} options Opções de cy.request() + `auth` (default: true).
 */
Cypress.Commands.add('apiRequest', ({ auth = true, headers = {}, ...options }) => {
  const finalHeaders = auth
    ? { 'x-api-key': Cypress.env('apiKey'), ...headers }
    : headers

  return cy.request({ ...options, headers: finalHeaders, failOnStatusCode: false })
})