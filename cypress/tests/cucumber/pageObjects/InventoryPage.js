/// <reference types="cypress" />

/**
 * Page Object da página de produtos (inventory) do SauceDemo.
 */
const selectors = {
  title: '.title',
  inventoryList: '.inventory_list',
  inventoryItem: '.inventory_item',
  cartBadge: '.shopping_cart_badge',
  cartLink: '.shopping_cart_link',
  addToCart: (productId) => `[data-test="add-to-cart-${productId}"]`,
}

class InventoryPage {
  /** Garante que a página de produtos foi carregada. */
  assertLoaded() {
    cy.url().should('include', '/inventory.html')
    cy.get(selectors.inventoryList).should('be.visible')
    return this
  }

  /** Retorna o título da página ("Products"). */
  title() {
    return cy.get(selectors.title)
  }

  /** Retorna a lista de produtos. */
  list() {
    return cy.get(selectors.inventoryList)
  }

  /** Retorna os itens de produto. */
  items() {
    return cy.get(selectors.inventoryItem)
  }

  /** Adiciona um produto ao carrinho a partir do sufixo do seu data-test. */
  addProduct(productId) {
    cy.get(selectors.addToCart(productId)).click()
    return this
  }

  /** Retorna o contador (badge) do carrinho. */
  cartBadge() {
    return cy.get(selectors.cartBadge)
  }

  /** Abre o carrinho de compras. */
  openCart() {
    cy.get(selectors.cartLink).click()
    return this
  }
}

export default new InventoryPage()
