/// <reference types="cypress" />

import { ENDPOINTS } from '../../support/endpoints'
import { expectUserShape } from '../../support/assertions'

describe('GET /api/users - Listagem e consulta de usuários', () => {
  context('Cenários positivos', () => {
    it('deve listar usuários retornando status, headers e corpo válidos', () => {
      cy.apiRequest({ method: 'GET', url: ENDPOINTS.users, qs: { page: 1 } }).then((res) => {
        // Status code
        expect(res.status, 'status code').to.eq(200)
        expect(res.statusText, 'status text').to.eq('OK')

        // Headers
        expect(res.headers, 'header content-type')
          .to.have.property('content-type')
          .and.to.include('application/json')
        expect(res.headers, 'header x-powered-by')
          .to.have.property('x-powered-by')
          .and.to.include('ReqRes')

        // Corpo - metadados de paginação
        expect(res.body, 'corpo').to.include.keys(
          'page',
          'per_page',
          'total',
          'total_pages',
          'data'
        )
        expect(res.body.page, 'page').to.eq(1)
        expect(res.body.per_page, 'per_page').to.be.a('number').and.to.be.greaterThan(0)
        expect(res.body.total, 'total').to.be.a('number')
        expect(res.body.total_pages, 'total_pages').to.be.a('number')

        // Corpo - coleção de usuários
        expect(res.body.data, 'data').to.be.an('array').and.to.not.be.empty
        res.body.data.forEach(expectUserShape)

        // Performance
        expect(res.duration, 'tempo de resposta (ms)').to.be.lessThan(5000)
      })
    })

    it('deve respeitar a paginação ao consultar a página 2', () => {
      cy.apiRequest({ method: 'GET', url: ENDPOINTS.users, qs: { page: 2 } }).then((res) => {
        expect(res.status, 'status code').to.eq(200)
        expect(res.body.page, 'page').to.eq(2)
        expect(res.body.data, 'data').to.be.an('array')
      })
    })

    it('deve retornar um único usuário existente (id = 2)', () => {
      cy.apiRequest({ method: 'GET', url: ENDPOINTS.userById(2) }).then((res) => {
        expect(res.status, 'status code').to.eq(200)
        expect(res.body, 'data').to.have.property('data')
        expect(res.body.data.id, 'id').to.eq(2)
        expectUserShape(res.body.data)
      })
    })
  })

  context('Cenários negativos', () => {
    it('deve retornar 404 ao consultar um usuário inexistente (id = 999)', () => {
      cy.apiRequest({ method: 'GET', url: ENDPOINTS.userById(999) }).then((res) => {
        expect(res.status, 'status code').to.eq(404)
        expect(res.body, 'corpo vazio').to.be.empty
      })
    })

    it('deve retornar 401 quando a API key não é enviada', () => {
      cy.apiRequest({ method: 'GET', url: ENDPOINTS.users, auth: false }).then((res) => {
        expect(res.status, 'status code').to.eq(401)
        expect(res.body, 'erro').to.have.property('error', 'missing_api_key')
      })
    })

    it('deve retornar 403 quando a API key é inválida', () => {
      cy.apiRequest({
        method: 'GET',
        url: ENDPOINTS.users,
        auth: false,
        headers: { 'x-api-key': 'chave-invalida-123' },
      }).then((res) => {
        expect(res.status, 'status code').to.eq(403)
        expect(res.body, 'erro').to.have.property('error', 'invalid_api_key')
      })
    })
  })
})
