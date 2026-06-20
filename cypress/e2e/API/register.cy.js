/// <reference types="cypress" />

import { ENDPOINTS } from '../../support/endpoints'

describe('POST /api/register - Cadastro de usuário', () => {
  let credentials

  before(() => {
    cy.fixture('credentials').then((data) => {
      credentials = data
    })
  })

  context('Cenários positivos', () => {
    it('deve registrar um usuário válido retornando 200 com id e token', () => {
      cy.apiRequest({
        method: 'POST',
        url: ENDPOINTS.register,
        body: credentials.valid.register,
      }).then((res) => {
        expect(res.status, 'status code').to.eq(200)
        expect(res.headers['content-type'], 'content-type').to.include('application/json')
        expect(res.body, 'id').to.have.property('id').that.is.a('number')
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
        url: ENDPOINTS.register,
        body: credentials.invalid.missingPassword,
      }).then((res) => {
        expect(res.status, 'status code').to.eq(400)
        expect(res.body, 'erro').to.have.property('error', 'Missing password')
      })
    })

    it('deve retornar 400 quando o e-mail está ausente', () => {
      cy.apiRequest({
        method: 'POST',
        url: ENDPOINTS.register,
        body: credentials.invalid.missingEmail,
      }).then((res) => {
        expect(res.status, 'status code').to.eq(400)
        expect(res.body, 'erro').to.have.property('error', 'Missing email or username')
      })
    })

    it('deve retornar 400 quando o corpo está vazio', () => {
      cy.apiRequest({ method: 'POST', url: ENDPOINTS.register, body: {} }).then((res) => {
        expect(res.status, 'status code').to.eq(400)
        expect(res.body, 'erro').to.have.property('error').and.to.match(/missing/i)
      })
    })

    it('deve retornar 400 quando o payload é um JSON malformado', () => {
      cy.apiRequest({
        method: 'POST',
        url: ENDPOINTS.register,
        headers: { 'Content-Type': 'application/json' },
        body: '{"email": "eve.holt@reqres.in", "password":',
      }).then((res) => {
        expect(res.status, 'status code').to.eq(400)
        expect(res.body, 'erro').to.have.property('error', 'invalid_json')
      })
    })

    it('deve retornar 401 quando a API key não é enviada', () => {
      cy.apiRequest({
        method: 'POST',
        url: ENDPOINTS.register,
        auth: false,
        body: credentials.valid.register,
      }).then((res) => {
        expect(res.status, 'status code').to.eq(401)
        expect(res.body, 'erro').to.have.property('error', 'missing_api_key')
      })
    })
  })
})
