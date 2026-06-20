/// <reference types="cypress" />
const SAUCEDEMO_URL = Cypress.env('e2eUrl')

describe('Checkout - SauceDemo (E2E)', () => {
  let users
  let checkout

  before(() => {
    cy.fixture('userSauceDemo').then((data) => (users = data))
    cy.fixture('checkout').then((data) => (checkout = data))
  })

  beforeEach(() => {
    cy.visit(SAUCEDEMO_URL)
    cy.login(users.validUser, users.password)
    cy.url().should('include', '/inventory.html')
    cy.get('.inventory_list').should('be.visible')
  })

  context('Cenários positivos', () => {
    it('deve concluir a compra de um único produto com sucesso', () => {
      const { backpack } = checkout.products
      const { customer, messages } = checkout

      // Adiciona o produto e valida o contador do carrinho.
      cy.addProductToCart(backpack.id)
      cy.get('.shopping_cart_badge').should('have.text', '1')

      // Abre o carrinho e confere o item.
      cy.get('.shopping_cart_link').click()
      cy.url().should('include', '/cart.html')
      cy.get('.cart_item').should('have.length', 1)
      cy.get('.inventory_item_name').should('have.text', backpack.name)

      // Inicia o checkout e preenche os dados do comprador.
      cy.get('[data-test="checkout"]').click()
      cy.url().should('include', '/checkout-step-one.html')
      cy.fillCheckoutInfo(customer.firstName, customer.lastName, customer.postalCode)

      // Confere o resumo do pedido.
      cy.url().should('include', '/checkout-step-two.html')
      cy.get('.cart_item').should('have.length', 1)
      cy.get('.inventory_item_name').should('have.text', backpack.name)

      // Finaliza e valida a confirmação da compra.
      cy.get('[data-test="finish"]').click()
      cy.url().should('include', '/checkout-complete.html')
      cy.get('.complete-header').should('have.text', messages.orderComplete)

      // Após a compra, o carrinho deve ficar vazio.
      cy.get('.shopping_cart_badge').should('not.exist')
    })

    it('deve concluir a compra de múltiplos produtos validando o total do resumo', () => {
      const { customer, messages } = checkout
      const items = [
        checkout.products.backpack,
        checkout.products.bikeLight,
        checkout.products.boltTshirt,
      ]

      // Adiciona todos os produtos e valida o contador do carrinho.
      items.forEach((item) => cy.addProductToCart(item.id))
      cy.get('.shopping_cart_badge').should('have.text', String(items.length))

      cy.get('.shopping_cart_link').click()
      cy.get('.cart_item').should('have.length', items.length)

      cy.get('[data-test="checkout"]').click()
      cy.fillCheckoutInfo(customer.firstName, customer.lastName, customer.postalCode)
      cy.url().should('include', '/checkout-step-two.html')

      // Validação robusta dos valores: em vez de fixar números, lê o que a página
      // exibe e confirma que subtotal = soma dos itens e total = subtotal + imposto.
      const expectedSubtotal = items.reduce((sum, item) => sum + item.price, 0)

      cy.get('.summary_subtotal_label')
        .invoke('text')
        .then((subtotalText) => {
          const subtotal = Number(subtotalText.replace(/[^0-9.]/g, ''))
          expect(subtotal, 'subtotal').to.be.closeTo(expectedSubtotal, 0.01)

          cy.get('.summary_tax_label')
            .invoke('text')
            .then((taxText) => {
              const tax = Number(taxText.replace(/[^0-9.]/g, ''))

              cy.get('.summary_total_label')
                .invoke('text')
                .then((totalText) => {
                  const total = Number(totalText.replace(/[^0-9.]/g, ''))
                  expect(total, 'total').to.be.closeTo(subtotal + tax, 0.01)
                })
            })
        })

      cy.get('[data-test="finish"]').click()
      cy.url().should('include', '/checkout-complete.html')
      cy.get('.complete-header').should('have.text', messages.orderComplete)
    })
  })

  context('Cenários negativos - validação dos dados do comprador', () => {
    beforeEach(() => {
      // Pré-condição: um produto no carrinho e o usuário na 1ª etapa do checkout.
      cy.addProductToCart(checkout.products.backpack.id)
      cy.get('.shopping_cart_link').click()
      cy.get('[data-test="checkout"]').click()
      cy.url().should('include', '/checkout-step-one.html')
    })

    it('deve exibir erro quando o primeiro nome está em branco', () => {
      const { customer, errors } = checkout
      cy.fillCheckoutInfo('', customer.lastName, customer.postalCode)

      cy.get('[data-test="error"]').should('have.text', errors.firstNameRequired)
      cy.url().should('include', '/checkout-step-one.html')
    })

    it('deve exibir erro quando o sobrenome está em branco', () => {
      const { customer, errors } = checkout
      cy.fillCheckoutInfo(customer.firstName, '', customer.postalCode)

      cy.get('[data-test="error"]').should('have.text', errors.lastNameRequired)
      cy.url().should('include', '/checkout-step-one.html')
    })

    it('deve exibir erro quando o CEP está em branco', () => {
      const { customer, errors } = checkout
      cy.fillCheckoutInfo(customer.firstName, customer.lastName, '')

      cy.get('[data-test="error"]').should('have.text', errors.postalCodeRequired)
      cy.url().should('include', '/checkout-step-one.html')
    })
  })
})
