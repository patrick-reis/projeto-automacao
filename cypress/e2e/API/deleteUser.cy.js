/// <reference types="cypress" />

import { ENDPOINTS } from '../../support/endpoints'

describe('DELETE /api/users/:id - Remoção de usuário', () => {
  context('Cenários positivos', () => {
    it('deve remover o usuário retornando 204 e corpo vazio', () => {
      cy.apiRequest({ method: 'DELETE', url: ENDPOINTS.userById(2) }).then((res) => {
        expect(res.status, 'status code').to.eq(204)
        expect(res.body, 'corpo vazio').to.be.empty
      })
    })
  })

  context('Cenários negativos', () => {
    it('deve retornar 401 ao remover sem API key', () => {
      cy.apiRequest({
        method: 'DELETE',
        url: ENDPOINTS.userById(2),
        auth: false,
      }).then((res) => {
        expect(res.status, 'status code').to.eq(401)
        expect(res.body, 'erro').to.have.property('error', 'missing_api_key')
      })
    })
  })
})
