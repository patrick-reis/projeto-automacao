/// <reference types="cypress" />

/**
 * Page Object das etapas de checkout do SauceDemo
 * (dados do comprador, resumo do pedido e confirmação).
 */
const selectors = {
  firstName: '[data-test="firstName"]',
  lastName: '[data-test="lastName"]',
  postalCode: '[data-test="postalCode"]',
  continueButton: '[data-test="continue"]',
  finishButton: '[data-test="finish"]',
  error: '[data-test="error"]',
  completeHeader: '.complete-header',
  cartItem: '.cart_item',
  itemName: '.inventory_item_name',
  itemPrice: '.inventory_item_price',
  subtotalLabel: '.summary_subtotal_label',
  taxLabel: '.summary_tax_label',
  totalLabel: '.summary_total_label',
}

/** Converte um texto monetário (ex.: "Item total: $29.99") em número. */
const parseMoney = (text) => Number(text.replace(/[^0-9.]/g, ''))

class CheckoutPage {
  /** Preenche os dados do comprador (ignora campos vazios para testar obrigatoriedade). */
  fillBuyerInfo(firstName, lastName, postalCode) {
    if (firstName) cy.get(selectors.firstName).type(firstName)
    if (lastName) cy.get(selectors.lastName).type(lastName)
    if (postalCode) cy.get(selectors.postalCode).type(postalCode)
    return this
  }

  /** Avança da etapa de dados do comprador para o resumo do pedido. */
  clickContinue() {
    cy.get(selectors.continueButton).click()
    return this
  }

  /** Finaliza a compra na etapa de resumo. */
  finish() {
    cy.get(selectors.finishButton).click()
    return this
  }

  /** Retorna a mensagem de erro de validação. */
  error() {
    return cy.get(selectors.error)
  }

  /** Retorna o cabeçalho de confirmação ("Thank you for your order!"). */
  completeHeader() {
    return cy.get(selectors.completeHeader)
  }

  /** Retorna os itens exibidos no resumo do pedido. */
  items() {
    return cy.get(selectors.cartItem)
  }

  /** Retorna os nomes dos itens exibidos no resumo. */
  itemNames() {
    return cy.get(selectors.itemName)
  }

  /**
   * Valida que o subtotal exibido corresponde à soma dos preços dos itens
   * mostrados na tela (sem depender de valores fixos).
   */
  assertSubtotalMatchesItems() {
    cy.get(selectors.itemPrice).then(($prices) => {
      const itemsTotal = $prices
        .toArray()
        .reduce((sum, el) => sum + parseMoney(Cypress.$(el).text()), 0)

      cy.get(selectors.subtotalLabel)
        .invoke('text')
        .then((subtotalText) => {
          expect(parseMoney(subtotalText), 'subtotal').to.be.closeTo(itemsTotal, 0.01)
        })
    })
    return this
  }

  /** Valida que o total exibido é igual ao subtotal somado aos impostos. */
  assertTotalEqualsSubtotalPlusTax() {
    cy.get(selectors.subtotalLabel)
      .invoke('text')
      .then((subtotalText) => {
        const subtotal = parseMoney(subtotalText)

        cy.get(selectors.taxLabel)
          .invoke('text')
          .then((taxText) => {
            const tax = parseMoney(taxText)

            cy.get(selectors.totalLabel)
              .invoke('text')
              .then((totalText) => {
                expect(parseMoney(totalText), 'total').to.be.closeTo(subtotal + tax, 0.01)
              })
          })
      })
    return this
  }
}

export default new CheckoutPage()
