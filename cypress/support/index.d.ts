/// <reference types="cypress" />

declare namespace Cypress {
  interface ApiRequestOptions extends Partial<Cypress.RequestOptions> {
    /** Método HTTP (GET, POST, PUT, PATCH, DELETE...). */
    method: string
    /** Caminho relativo à `apiUrl` (ex.: '/api/users'). */
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

    /**
     * Preenche e submete o formulário de login do SauceDemo.
     * Campos vazios são ignorados (útil para validar campos obrigatórios).
     */
    login(username?: string, password?: string): Chainable<void>

    /**
     * Adiciona um produto ao carrinho a partir do sufixo do seu `data-test`
     * (ex.: 'sauce-labs-backpack').
     */
    addProductToCart(productId: string): Chainable<void>

    /**
     * Preenche e submete a 1ª etapa do checkout do SauceDemo.
     * Campos vazios são ignorados (útil para validar campos obrigatórios).
     */
    fillCheckoutInfo(
      firstName?: string,
      lastName?: string,
      postalCode?: string
    ): Chainable<void>
  }
}
