// Teste de carga - GET /books?ids=11 (Gutendex)
import http from 'k6/http'
import { sleep, check } from 'k6'
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/3.0.4/dist/bundle.js'

export const options = {
  stages: [
    { duration: '1m', target: 250 }, // sobe até 250 usuários em 1 min
    { duration: '5m', target: 500 }, // sobe e segura até 500 usuários por 5 min
    { duration: '1m', target: 0 },   // desce até 0 usuário em 1 min
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% das respostas em até 2s
    http_req_failed: ['rate<0.01'],    // no máximo 1% de erros
  },
}

export default function () {
  const res = http.get('https://gutendex.com/books?ids=11')

  check(res, {
    'status é 200': (r) => r.status === 200,
    'retornou o livro': (r) => r.json('count') === 1,
  })

  sleep(1)
}

// Gera o relatório HTML em k6/reports/books-load.html ao final do teste
export function handleSummary(data) {
  return {
    'k6/reports/books-load.html': htmlReport(data),
  }
}
