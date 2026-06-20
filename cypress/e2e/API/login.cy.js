/// <reference types="cypress" />

import { ENDPOINTS } from '../../support/endpoints'

describe('POST /api/login - Autenticação de usuário', () => {
  let credentials

  before(() => {
    cy.fixture('credentials').then((data) => {
      credentials = data
    })
  })

  context('Cenários positivos', () => {
    it('deve autenticar com credenciais válidas retornando 200 e token', () => {
      cy.apiRequest({
        method: 'POST',
        url: ENDPOINTS.login,
        body: credentials.valid.login,
      }).then((res) => {
        expect(res.status, 'status code').to.eq(200)
        expect(res.headers['content-type'], 'content-type').to.include('application/json')
        expect(res.body, 'token')
          .to.have.property('token')
          .that.is.a('string')
          .and.to.not.be.empty
      })
    })
  })

  context('Cenários negativos', () => {
    it('deve retornar 400 quando a senha está ausente', () => {
      cy.apiRequest({
        method: 'POST',
        url: ENDPOINTS.login,
        body: credentials.invalid.missingPassword,
      }).then((res) => {
        expect(res.status, 'status code').to.eq(400)
        expect(res.body, 'erro').to.have.property('error', 'Missing password')
      })
    })

    it('deve retornar 400 quando o e-mail está ausente', () => {
      cy.apiRequest({
        method: 'POST',
        url: ENDPOINTS.login,
        body: credentials.invalid.missingEmail,
      }).then((res) => {
        expect(res.status, 'status code').to.eq(400)
        expect(res.body, 'erro').to.have.property('error', 'Missing email or username')
      })
    })

    it('deve retornar 400 para um usuário não cadastrado', () => {
      cy.apiRequest({
        method: 'POST',
        url: ENDPOINTS.login,
        body: credentials.invalid.unknownUser,
      }).then((res) => {
        expect(res.status, 'status code').to.eq(400)
        expect(res.body, 'erro').to.have.property('error', 'user not found')
      })
    })

    it('deve retornar 401 quando a API key não é enviada', () => {
      cy.apiRequest({
        method: 'POST',
        url: ENDPOINTS.login,
        auth: false,
        body: credentials.valid.login,
      }).then((res) => {
        expect(res.status, 'status code').to.eq(401)
        expect(res.body, 'erro').to.have.property('error', 'missing_api_key')
      })
    })
  })
})
