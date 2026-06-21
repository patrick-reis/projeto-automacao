/// <reference types="cypress" />

/**
 * Page Object da página do carrinho (cart) do SauceDemo.
 */
const selectors = {
  cartItem: '.cart_item',
  itemName: '.inventory_item_name',
  checkoutButton: '[data-test="checkout"]',
}

class CartPage {
  /** Retorna os itens presentes no carrinho. */
  items() {
    return cy.get(selectors.cartItem)
  }

  /** Retorna os nomes dos itens do carrinho. */
  itemNames() {
    return cy.get(selectors.itemName)
  }

  /** Inicia o fluxo de checkout. */
  checkout() {
    cy.get(selectors.checkoutButton).click()
    return this
  }
}

export default new CartPage()
