/// <reference types="cypress" />

import { ENDPOINTS } from '../../support/endpoints'

describe('PUT e PATCH /api/users/:id - Atualização de usuário', () => {
  let userData

  before(() => {
    cy.fixture('user').then((data) => {
      userData = data
    })
  })

  context('Cenários positivos', () => {
    it('PUT deve atualizar o usuário retornando 200 e updatedAt', () => {
      cy.apiRequest({
        method: 'PUT',
        url: ENDPOINTS.userById(2),
        body: userData.update,
      }).then((res) => {
        expect(res.status, 'status code').to.eq(200)
        expect(res.headers['content-type'], 'content-type').to.include('application/json')
        expect(res.body, 'corpo').to.include({
          name: userData.update.name,
          job: userData.update.job,
        })
        expect(res.body, 'updatedAt').to.have.property('updatedAt')
        expect(
          new Date(res.body.updatedAt).toString(),
          'updatedAt é uma data válida'
        ).to.not.eq('Invalid Date')
      })
    })

    it('PATCH deve atualizar parcialmente o usuário retornando 200', () => {
      cy.apiRequest({
        method: 'PATCH',
        url: ENDPOINTS.userById(2),
        body: userData.patch,
      }).then((res) => {
        expect(res.status, 'status code').to.eq(200)
        expect(res.body, 'job').to.have.property('job', userData.patch.job)
        expect(res.body, 'updatedAt').to.have.property('updatedAt')
      })
    })
  })

  context('Cenários negativos', () => {
    it('deve retornar 401 ao atualizar sem API key', () => {
      cy.apiRequest({
        method: 'PUT',
        url: ENDPOINTS.userById(2),
        auth: false,
        body: userData.update,
      }).then((res) => {
        expect(res.status, 'status code').to.eq(401)
        expect(res.body, 'erro').to.have.property('error', 'missing_api_key')
      })
    })

    it('deve retornar 404 ao usar um método inválido (PUT) em /api/register', () => {
      cy.apiRequest({
        method: 'PUT',
        url: ENDPOINTS.register,
        body: userData.update,
      }).then((res) => {
        expect(res.status, 'status code').to.eq(404)
        expect(res.headers['content-type'], 'content-type').to.include('text/html')
      })
    })
  })
})
