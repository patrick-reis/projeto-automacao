/// <reference types="cypress" />

import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
import LoginPage from '../pageObjects/LoginPage'
import InventoryPage from '../pageObjects/InventoryPage'
import CartPage from '../pageObjects/CartPage'
import CheckoutPage from '../pageObjects/CheckoutPage'

// Massa de dados carregada das fixtures durante o Background.
const data = {}

Given('o usuário está autenticado na loja', () => {
  cy.fixture('userSauceDemo').then((users) => {
    data.users = users
    LoginPage.visit()
    LoginPage.login(users.validUser, users.password)
  })
  cy.fixture('checkout').then((checkout) => {
    data.checkout = checkout
  })
  InventoryPage.assertLoaded()
})

When('o usuário adiciona o produto {string} ao carrinho', (productId) => {
  InventoryPage.addProduct(productId)
})

Given('o carrinho contém o produto {string}', (productId) => {
  InventoryPage.addProduct(productId)
})

Given('o carrinho contém os seguintes produtos:', (dataTable) => {
  dataTable.hashes().forEach(({ produto }) => InventoryPage.addProduct(produto))
})

Then('o contador do carrinho exibe {string}', (count) => {
  InventoryPage.cartBadge().should('have.text', count)
})

When('o carrinho é exibido', () => {
  InventoryPage.openCart()
  cy.url().should('include', '/cart.html')
})

Then('o produto {string} aparece no carrinho', (productName) => {
  CartPage.items().should('have.length', 1)
  CartPage.itemNames().should('have.text', productName)
})

Given('o formulário de dados do comprador é exibido', () => {
  InventoryPage.openCart()
  CartPage.checkout()
  cy.url().should('include', '/checkout-step-one.html')
})

When('o usuário avança para o resumo do pedido', () => {
  const { firstName, lastName, postalCode } = data.checkout.customer
  InventoryPage.openCart()
  CartPage.checkout()
  CheckoutPage.fillBuyerInfo(firstName, lastName, postalCode).clickContinue()
  cy.url().should('include', '/checkout-step-two.html')
})

When('o usuário finaliza a compra com dados válidos', () => {
  const { firstName, lastName, postalCode } = data.checkout.customer
  InventoryPage.openCart()
  CartPage.checkout()
  CheckoutPage.fillBuyerInfo(firstName, lastName, postalCode).clickContinue()
  CheckoutPage.finish()
})

When(
  'o comprador informa o nome {string}, o sobrenome {string} e o CEP {string}',
  (firstName, lastName, postalCode) => {
    CheckoutPage.fillBuyerInfo(firstName, lastName, postalCode).clickContinue()
  }
)

Then('o subtotal corresponde à soma dos preços dos itens', () => {
  CheckoutPage.assertSubtotalMatchesItems()
})

Then('o total corresponde ao subtotal somado aos impostos', () => {
  CheckoutPage.assertTotalEqualsSubtotalPlusTax()
})

Then('o pedido é confirmado', () => {
  cy.url().should('include', '/checkout-complete.html')
  CheckoutPage.completeHeader().should('have.text', data.checkout.messages.orderComplete)
})

Then('o carrinho fica vazio', () => {
  InventoryPage.cartBadge().should('not.exist')
})

Then('a mensagem de erro de checkout {string} é exibida', (message) => {
  CheckoutPage.error().should('have.text', message)
  // O comprador permanece na etapa de dados (não avançou para o resumo).
  cy.url().should('include', '/checkout-step-one.html')
})
