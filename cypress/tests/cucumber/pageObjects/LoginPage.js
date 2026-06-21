/// <reference types="cypress" />

/**
 * Page Object da tela de Login do SauceDemo.
 *
 * Não utiliza comandos customizados (cy.login, etc.) — toda a interação é
 * feita diretamente com os comandos nativos do Cypress, mantendo os seletores
 * centralizados neste arquivo.
 */
const selectors = {
  username: '[data-test="username"]',
  password: '[data-test="password"]',
  loginButton: '[data-test="login-button"]',
  error: '[data-test="error"]',
}

class LoginPage {
  /** Acessa a página de login usando a URL base definida em Cypress.env('e2eUrl'). */
  visit() {
    cy.visit(Cypress.env('e2eUrl'))
    return this
  }

  /** Digita o usuário (ignora valores vazios para testar campos obrigatórios). */
  typeUsername(username) {
    if (username) cy.get(selectors.username).type(username)
    return this
  }

  /** Digita a senha (ignora valores vazios para testar campos obrigatórios). */
  typePassword(password) {
    if (password) cy.get(selectors.password).type(password)
    return this
  }

  /** Submete o formulário de login. */
  submit() {
    cy.get(selectors.loginButton).click()
    return this
  }

  /** Preenche usuário e senha e submete o formulário. */
  login(username, password) {
    this.typeUsername(username)
    this.typePassword(password)
    this.submit()
    return this
  }

  /** Retorna o elemento da mensagem de erro para asserções. */
  errorMessage() {
    return cy.get(selectors.error)
  }
}

export default new LoginPage()
