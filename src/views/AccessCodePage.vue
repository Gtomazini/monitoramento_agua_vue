<template>
  <div class="access-code-page">
    <div class="access-code-container">
      <h1 class="access-code-title">Código de acesso</h1>
      
      <div class="input-section">
        <label class="input-label">Insira o código</label>
        <div class="input-container">
          <input 
            v-model="accessCode"
            type="text"
            class="access-code-input"
            placeholder="Ex: dks3-am2i-a57p-lo91"
            @keyup.enter="validateCode"
            :disabled="isLoading"
          />
          <button 
            class="submit-button"
            @click="validateCode"
            :disabled="isLoading || !accessCode.trim()"
          >
            <span v-if="isLoading" class="loading-spinner"></span>
            <span v-else class="arrow-icon">></span>
          </button>
        </div>
      </div>
      
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </div>
    
    <div class="board-label">Board</div>
  </div>
</template>

<script>
import { validateAccessCode, getUserData } from '@/config/api.js'

export default {
  name: 'AccessCodePage',
  data() {
    return {
      accessCode: '',
      isLoading: false,
      errorMessage: ''
    }
  },
  methods: {
    async validateCode() {
      if (!this.accessCode.trim()) {
        this.errorMessage = 'Por favor, insira um código válido'
        return
      }

      this.isLoading = true
      this.errorMessage = ''

      try {
        // Validação do código de acesso
        const validationResult = await validateAccessCode(this.accessCode.trim())
        
        if (validationResult.valid) {
          // Salva o código na sessão/localStorage para uso posterior
          localStorage.setItem('userAccessCode', this.accessCode.trim())
          
          // Se a API retornou um id de usuário, salve também (útil para navegação/identificação)
          if (validationResult.id_user !== undefined && validationResult.id_user !== null) {
            localStorage.setItem('userId', String(validationResult.id_user))
          }

          // Obtém dados do usuário (opcional)
          const userData = await getUserData(this.accessCode.trim())
          if (userData) {
            localStorage.setItem('userData', JSON.stringify(userData))
          }
          
          // Redireciona para home
          this.$router.push('/home')
        } else {
          this.errorMessage = validationResult.message || 'Código inválido. Verifique e tente novamente.'
        }
      } catch (error) {
        console.error('Erro na validação:', error)
        this.errorMessage = 'Erro ao validar código. Tente novamente.'
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>
.access-code-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  font-family: 'Rubik', sans-serif;
}

.access-code-container {
  background: white;
  border: 3px solid #007bff;
  border-radius: 12px;
  padding: 40px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.access-code-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  text-align: center;
  margin-bottom: 30px;
  margin-top: 0;
}

.input-section {
  margin-bottom: 20px;
}

.input-label {
  display: block;
  font-size: 1.2rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 12px;
}

.input-container {
  display: flex;
  gap: 12px;
  align-items: center;
}

.access-code-input {
  flex: 1;
  padding: 16px 20px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1.1rem;
  font-family: 'Rubik', sans-serif;
  transition: border-color 0.3s ease;
}

.access-code-input:focus {
  outline: none;
  border-color: #007bff;
}

.access-code-input:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.submit-button {
  width: 50px;
  height: 50px;
  background-color: #007bff;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
}

.submit-button:hover:not(:disabled) {
  background-color: #0056b3;
}

.submit-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.arrow-icon {
  font-size: 1.2rem;
}

.error-message {
  color: #dc3545;
  font-size: 1rem;
  text-align: center;
  margin-top: 15px;
  padding: 10px;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
}

.board-label {
  position: absolute;
  top: 20px;
  left: 20px;
  color: #999;
  font-size: 0.9rem;
  font-weight: 300;
}

/* Responsividade */
@media (max-width: 600px) {
  .access-code-container {
    padding: 30px 20px;
    margin: 20px;
  }
  
  .access-code-title {
    font-size: 2rem;
  }
  
  .input-container {
    flex-direction: column;
    gap: 15px;
  }
  
  .submit-button {
    width: 100%;
    height: 45px;
  }
}
</style>
