Feature: Login na SauceDemo
  Como cliente da loja SauceDemo
  Quero acessar a minha conta
  Para visualizar a página de produtos

  Background:
    Given a página de login é exibida

  Scenario: Acesso com um usuário padrão válido
    When o usuário faz login com o nome de usuário "standard_user" e a senha "secret_sauce"
    Then a página de produtos é exibida

  Scenario Outline: Acesso recusado com credenciais inválidas
    When o usuário faz login com o nome de usuário "<usuario>" e a senha "<senha>"
    Then a mensagem de erro de login "<mensagem>" é exibida

    Examples:
      | usuario             | senha          | mensagem                                                                  |
      | locked_out_user     | secret_sauce   | Epic sadface: Sorry, this user has been locked out.                       |
      | standard_user       | senha_invalida | Epic sadface: Username and password do not match any user in this service |
      | usuario_inexistente | secret_sauce   | Epic sadface: Username and password do not match any user in this service |

  Scenario Outline: Acesso recusado quando um campo obrigatório não é informado
    When o usuário faz login com o nome de usuário "<usuario>" e a senha "<senha>"
    Then a mensagem de erro de login "<mensagem>" é exibida

    Examples:
      | usuario       | senha        | mensagem                           |
      |               | secret_sauce | Epic sadface: Username is required |
      | standard_user |              | Epic sadface: Password is required |
      |               |              | Epic sadface: Username is required |
