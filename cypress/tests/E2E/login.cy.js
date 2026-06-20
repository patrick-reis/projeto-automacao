/// <reference types="cypress" />

const SAUCEDEMO_URL = Cypress.env('e2eUrl')

describe('Login - SauceDemo (E2E)', () => {
  let users

  before(() => {
    cy.fixture('userSauceDemo').then((data) => {
      users = data
    })
  })

  beforeEach(() => {
    cy.visit(SAUCEDEMO_URL)
  })

  context('Cenários positivos', () => {
    it('deve logar com standard_user e navegar para a página de produtos', () => {
      cy.login(users.validUser, users.password)

      // Navegação bem-sucedida: a rota muda e a lista de produtos é exibida.
      cy.url().should('include', '/inventory.html')
      cy.get('.title').should('have.text', 'Products')
      cy.get('.inventory_list').should('be.visible')
      cy.get('.inventory_item').should('have.length.greaterThan', 0)
    })
  })

  context('Cenários negativos', () => {
    it('não deve logar com usuário bloqueado (locked_out_user)', () => {
      cy.login(users.lockedOut, users.password)

      cy.get('[data-test="error"]').should('be.visible').and('have.text', users.errors.lockedOut)
      cy.url().should('eq', SAUCEDEMO_URL)
    })

    it('não deve logar com senha incorreta', () => {
      cy.login('standard_user', 'senha_incorreta')

      cy.get('[data-test="error"]').should('have.text', users.errors.invalidCredentials)
      cy.url().should('eq', SAUCEDEMO_URL)
    })

    it('não deve logar com usuário inexistente', () => {
      cy.login('usuario_inexistente', users.password)

      cy.get('[data-test="error"]').should('have.text', users.errors.invalidCredentials)
      cy.url().should('eq', SAUCEDEMO_URL)
    })

    it('deve exibir erro quando o usuário está em branco', () => {
      cy.login('', users.password)

      cy.get('[data-test="error"]').should('have.text', users.errors.usernameRequired)
      cy.url().should('eq', SAUCEDEMO_URL)
    })

    it('deve exibir erro quando a senha está em branco', () => {
      cy.login('standard_user', '')

      cy.get('[data-test="error"]').should('have.text', users.errors.passwordRequired)
      cy.url().should('eq', SAUCEDEMO_URL)
    })

    it('deve exibir erro quando usuário e senha estão em branco', () => {
      cy.login('', '')

      cy.get('[data-test="error"]').should('have.text', users.errors.usernameRequired)
      cy.url().should('eq', SAUCEDEMO_URL)
    })
  })
})
