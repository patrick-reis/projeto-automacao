const RATE_LIMIT_STATUS = 429
const MAX_RETRIES = 4

/**
 * cy.apiRequest() — wrapper de cy.request() focado em testes de API.
 *
 * Boas práticas embutidas:
 *  - Injeta o header de autenticação `x-api-key` automaticamente
 *    (use `auth: false` para cenários negativos de autenticação).
 *  - Usa `failOnStatusCode: false` para que os testes possam validar
 *    explicitamente status codes de erro (4xx/5xx).
 *  - Reexecuta automaticamente em caso de HTTP 429 (rate limit),
 *    respeitando o header `ratelimit-reset` retornado pela API.
 *
 * @param {object} options
 * @param {string} options.method            Método HTTP (GET, POST, PUT, PATCH, DELETE...).
 * @param {string} options.url               Caminho relativo à baseUrl (ex.: '/api/users').
 * @param {object|string} [options.body]     Corpo da requisição.
 * @param {object} [options.headers]         Headers adicionais.
 * @param {object} [options.qs]              Query string.
 * @param {boolean} [options.auth=true]      Injeta a API key automaticamente.
 */
Cypress.Commands.add('apiRequest', (options = {}) => {
  const { auth = true, headers = {}, ...requestOptions } = options

  const finalHeaders = { ...headers }
  const hasApiKey = Object.keys(finalHeaders).some(
    (header) => header.toLowerCase() === 'x-api-key'
  )

  if (auth && !hasApiKey) {
    finalHeaders['x-api-key'] = Cypress.env('apiKey')
  }

  const sendRequest = (attempt) =>
    cy
      .request({
        ...requestOptions,
        headers: finalHeaders,
        failOnStatusCode: false,
      })
      .then((response) => {
        if (response.status === RATE_LIMIT_STATUS && attempt < MAX_RETRIES) {
          const resetSeconds = Number(response.headers['ratelimit-reset']) || 5
          const waitMs = Math.min(Math.max(resetSeconds, 1), 60) * 1000

          cy.log(
            `⏳ Rate limit (429). Aguardando ${waitMs / 1000}s e tentando novamente (${attempt + 1}/${MAX_RETRIES}).`
          )
          cy.wait(waitMs)

          return sendRequest(attempt + 1)
        }

        return response
      })

  return sendRequest(0)
})