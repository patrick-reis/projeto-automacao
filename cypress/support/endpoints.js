// Centraliza os caminhos da API (relativos à `apiUrl` definida no cypress.config.js).
// Manter os endpoints em um único lugar facilita a manutenção dos testes.
export const ENDPOINTS = {
  users: '/api/users',
  userById: (id) => `/api/users/${id}`,
  register: '/api/register',
  login: '/api/login',
}

export default ENDPOINTS
