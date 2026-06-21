Feature: Checkout na SauceDemo
  Como cliente autenticado da loja SauceDemo
  Quero finalizar a compra dos produtos do carrinho
  Para concluir o meu pedido

  Background:
    Given o usuário está autenticado na loja

  Scenario: Adição de um produto ao carrinho
    When o usuário adiciona o produto "sauce-labs-backpack" ao carrinho
    Then o contador do carrinho exibe "1"

  Scenario: Revisão de um produto no carrinho
    Given o carrinho contém o produto "sauce-labs-backpack"
    When o carrinho é exibido
    Then o produto "Sauce Labs Backpack" aparece no carrinho

  Scenario: Conclusão da compra de um único produto
    Given o carrinho contém o produto "sauce-labs-backpack"
    When o usuário finaliza a compra com dados válidos
    Then o pedido é confirmado
    And o carrinho fica vazio

  Scenario: Conclusão da compra de múltiplos produtos
    Given o carrinho contém os seguintes produtos:
      | produto                 |
      | sauce-labs-backpack     |
      | sauce-labs-bike-light   |
      | sauce-labs-bolt-t-shirt |
    When o usuário finaliza a compra com dados válidos
    Then o pedido é confirmado

  Scenario: Revisão do total no resumo do pedido
    Given o carrinho contém os seguintes produtos:
      | produto               |
      | sauce-labs-backpack   |
      | sauce-labs-bike-light |
    When o usuário avança para o resumo do pedido
    Then o subtotal corresponde à soma dos preços dos itens
    And o total corresponde ao subtotal somado aos impostos

  Scenario Outline: Checkout recusado quando os dados do comprador estão incompletos
    Given o carrinho contém o produto "sauce-labs-backpack"
    And o formulário de dados do comprador é exibido
    When o comprador informa o nome "<nome>", o sobrenome "<sobrenome>" e o CEP "<cep>"
    Then a mensagem de erro de checkout "<mensagem>" é exibida

    Examples:
      | nome    | sobrenome | cep       | mensagem                       |
      |         | Reis      | 31000-100 | Error: First Name is required  |
      | Patrick |           | 31000-100 | Error: Last Name is required   |
      | Patrick | Reis      |           | Error: Postal Code is required |
