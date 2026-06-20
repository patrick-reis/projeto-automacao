// Asserções reutilizáveis de "contrato" (schema) das respostas da API.

/**
 * Valida o formato esperado de um objeto de usuário retornado pela API.
 * @param {Record<string, unknown>} user
 */
export const expectUserShape = (user) => {
  expect(user, 'usuário').to.be.an('object')
  expect(user, 'chaves do usuário').to.include.keys(
    'id',
    'email',
    'first_name',
    'last_name',
    'avatar'
  )
  expect(user.id, 'id').to.be.a('number').and.to.be.greaterThan(0)
  expect(user.email, 'email').to.be.a('string').and.to.match(/^[^@\s]+@[^@\s]+$/)
  expect(user.first_name, 'first_name').to.be.a('string').and.to.not.be.empty
  expect(user.last_name, 'last_name').to.be.a('string').and.to.not.be.empty
  expect(user.avatar, 'avatar').to.be.a('string').and.to.match(/^https?:\/\//)
}

export default expectUserShape
