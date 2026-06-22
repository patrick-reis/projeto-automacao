/// <reference types="cypress" />

import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'
import LoginPage from '../pageObjects/LoginPage'
import InventoryPage from '../pageObjects/InventoryPage'

const E2E_URL = Cypress.env('e2eUrl')

Given('a página de login é exibida', () => {
  LoginPage.visit()
})

When('o usuário faz login com o nome de usuário {string} e a senha {string}', (username, password) => {
  LoginPage.login(username, password)
})

Then('a página de produtos é exibida', () => {
  cy.url().should('include', '/inventory.html')
  InventoryPage.title().should('have.text', 'Products')
  InventoryPage.list().should('be.visible')
  InventoryPage.items().should('have.length.greaterThan', 0)
})

Then('a mensagem de erro de login {string} é exibida', (message) => {
  LoginPage.errorMessage().should('be.visible').and('have.text', message)
  // A mensagem de erro só existe na página de login: confirma que não houve navegação.
  cy.url().should('eq', E2E_URL)
})
