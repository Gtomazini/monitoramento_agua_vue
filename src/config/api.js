// Configuração da API
export const API_CONFIG = {
  BASE_URL: 'https://watergame.gabrieltomazini.com/api/v1',
  
  // Endpoints existentes
  ENDPOINTS: {
    DEVICES: '/devices/',
    CONSUMO_DIARIO: '/consumo-diario/',
    CONSUMO_DETALHADO: (id) => `/consumo-diario/${id}/detalhado`
  },
  
  // Novos endpoints para autenticação
  AUTH_ENDPOINTS: {
    VALIDATE_ACCESS_CODE: '/codigo-usuario/{codigo_user}'
  }
}

// Função para validar código de acesso
export async function validateAccessCode(code) {
  try {
    // Validação básica de formato antes de chamar a API
    // Agora aceita códigos com 20 caracteres alfanuméricos (ex: 6QYGSIIZWDJCKWXR7PS7)
    const codePattern = /^[A-Z0-9]{20}$/i
    if (!codePattern.test(code)) {
      return { valid: false, message: 'Formato de código inválido. Deve conter 20 caracteres alfanuméricos.' }
    }

    // Monta URL substituindo o placeholder
    const path = API_CONFIG.AUTH_ENDPOINTS.VALIDATE_ACCESS_CODE.replace('{codigo_user}', encodeURIComponent(code))
    const url = API_CONFIG.BASE_URL + path

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

    if (res.status === 200) {
      const data = await res.json()
      // Esperamos algo como { id_user: 123 }
      return { valid: true, message: 'Código válido', id_user: data && data.id_user ? data.id_user : null }
    }

    if (res.status === 422) {
      // Validation error - tenta extrair mensagem útil
      let payload = null
      try { payload = await res.json() } catch (e) { /* ignore */ }
      const msg = (payload && payload.detail) ? JSON.stringify(payload.detail) : 'Código inválido (422)'
      return { valid: false, message: msg }
    }

    // Outros status
    let text = await res.text()
    return { valid: false, message: `Erro na validação (status ${res.status}): ${text}` }
  } catch (error) {
    console.error('Erro na validação do código:', error)
    return { valid: false, message: 'Erro ao validar código: ' + (error.message || error) }
  }
}

// Função para obter dados do usuário baseado no código
export async function getUserData(accessCode) {
  try {
    
    return {
      userId: accessCode,
      userName: 'Usuário',
      devices: [],
      permissions: ['dashboard', 'home']
    }
    
  } catch (error) {
    console.error('Erro ao obter dados do usuário:', error)
    return null
  }
}
