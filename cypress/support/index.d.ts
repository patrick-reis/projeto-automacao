/// <reference types="cypress" />

declare namespace Cypress {
  interface ApiRequestOptions extends Partial<Cypress.RequestOptions> {
    /** Método HTTP (GET, POST, PUT, PATCH, DELETE...). */
    method: string
    /** Caminho relativo à baseUrl (ex.: '/api/users'). */
    url: string
    /** Quando `true` (padrão), injeta automaticamente o header `x-api-key`. */
    auth?: boolean
  }

  interface Chainable {
    /**
     * Wrapper de `cy.request` para testes de API.
     * - Injeta o header `x-api-key` automaticamente (desative com `auth: false`).
     * - Usa `failOnStatusCode: false` para permitir asserts de status de erro.
     * - Headers passados manualmente têm prioridade sobre o injetado.
     */
    apiRequest(options: ApiRequestOptions): Chainable<Cypress.Response<any>>
  }
}
