<template>
    <div class="homepage">
      <!-- No Vue, você importa a Sidebar como um componente, não duplica o código -->
      <Sidebar />
      
      <section class="main">
        <section class="coluna">
          <section class="linha1">
            <section class="Quadro1">
              <section class="titulo_quadro">Bem vindo, Gabriel !</section>
              <section class="bloco_texto">
                <div v-if="cobertura < 20" class="status-alerta status-urgencia">URGÊNCIA - Chamar o suporte</div>
                <div v-else-if="cobertura < 50" class="status-alerta status-alerta-amarelo">ALERTA - Sensores sem leitura</div>
                <div v-else-if="cobertura < 90" class="status-alerta status-estavel">ESTÁVEL - Alguns sensores estão sofrendo interferência</div>
                <div v-else class="status-alerta status-perfeito">PERFEITO - Todos os sensores estão funcionando</div>
                <div class="cidade-temperatura texto-branco">Temperatura: Ribeirão Preto - 28°C</div>
                <div class="horario-sistema texto-branco">Horário do sistema: {{ horarioSistema }}</div>
              </section>
            </section>
            <section class="Quadro2">
              <section class="titulo_quadro">Dispositivos</section>
              <div class="device-list">
                <div v-for="device in devices" :key="device.id" class="device-item">
                  <div class="device-circle">
                    <img src="@/assets/images/perfil/sensor.png" alt="Sensor" class="device-img" />
                  </div>
                  <div class="device-name">{{ device.name }}</div>
                </div>
              </div>
            </section>
          </section>
          <section class="linha2">
            <section class="Quadro3">
              <section class="titulo_quadro">Cobertura</section>
              <div class="cobertura-bar-container">
                <div class="cobertura-bar">
                  <div class="cobertura-bar-preenchida" :style="{width: cobertura + '%'}"></div>
                  <div class="cobertura-label">{{ cobertura }}% dos dispositivos com leitura</div>
                </div>
                <div class="cobertura-legenda">
                  A barra representa a porcentagem de dispositivos cadastrados que possuem pelo menos uma leitura registrada no sistema.
                </div>
              </div>
            </section>
            <section class="Quadro4">
              <section class="titulo_quadro">Mapa</section>
              <ul class="mapa-lista">
                <li><strong>HOME</strong> - Você está aqui! <span class="emoji">🏠</span></li>
                <li><strong>DASHBOARD</strong> - Informações sobre o consumo de água em tempo real</li>
                <li><span class="emoji">🔒</span> <strong>CONSUMO</strong> - Métricas do consumo na região<span class="mapa-desativado">*</span></li>
                <li><span class="emoji">🔒</span> <strong>ALERTAS</strong> - Configuração de alertas sobre consumo E-mail SMS etc<span class="mapa-desativado">*</span></li>
                <li><span class="emoji">🔒</span> <strong>PREFERÊNCIA</strong> - Configuração do painel<span class="mapa-desativado">*</span></li>
                <li><span class="emoji">🔒</span> <strong>DISPOSITIVOS</strong> - Cadastro e remoção de dispositivo<span class="mapa-desativado">*</span></li>
                <li><span class="emoji">🔒</span> <strong>PERFIL</strong> - Configurações de conta, dns e dupla autenticação<span class="mapa-desativado">*</span></li>
              </ul>
              <div class="mapa-info">*desativado em acesso aberto, use localhost iot para ter acesso</div>
            </section>
          </section>
        </section>
        <section class="linha3">
          <section class="Quadro5">
            <section class="titulo_quadro">Sobre</section>
            <div class="sobre-flex">
              <div class="sobre-col">
                <div class="sobre-autores">
                  <strong>Autores:</strong><br>
                  GRANERO, Chaiene Alarcon Mendes<br>
                  TOMAZINI, Gabriel<br>
                  MARTINS, Gabriela Gosuen<br>
                  SOUZA, Mirella<br>
                  BORGES, Sandro Fonseca
                </div>
                <div class="sobre-titulo">
                  <strong>Título:</strong><br>
                  Sistema IoT para Monitoramento e Gestão de Consumo de Água em Residências.
                </div>
              </div>
              <div class="sobre-col sobre-info">
                <strong>Relatório Técnico-Científico</strong> – 17 f.<br>
                Engenharia da Computação – Universidade Virtual do Estado de São Paulo<br>
                <strong>Tutor:</strong> José Vitor Carignato David<br>
                <strong>Polos:</strong> Franca e Ribeirão Preto - SP<br>
                <strong>Ano:</strong> 2025
              </div>
            </div>
          </section>
        </section>
      </section>
    </div>
  </template>
  
  <script>
  // Importando o componente Sidebar
  import Sidebar from '@/components/SidebarMenu.vue'
  
  export default {
    name: 'HomePage',
    // Registrando o componente Sidebar para uso nesta página
    components: {
      Sidebar
    },
    // Dados que podem ser usados na página
    data() {
      return {
        temperatura: '28°C',
        devices: [],
        cobertura: 0, // porcentagem de cobertura
        horarioSistema: ''
      }
    },
    mounted() {
      // Buscar devices primeiro - se tiver userId vai usar ele, buscar apenas os devices deste usuário
      const userId = localStorage.getItem('userId')
      const devicesEndpoint = userId
        ? `https://watergame.gabrieltomazini.com/api/v1/users/${encodeURIComponent(userId)}/devices/`
        : 'https://watergame.gabrieltomazini.com/api/v1/devices/'

      fetch(devicesEndpoint)
        .then(res => res.json())
        .then(devicesData => {
          this.devices = Array.isArray(devicesData) ? devicesData.map(d => ({ name: d.name_device, id: d.id_device })) : [];
          // Buscar consumos diários
          return fetch('https://watergame.gabrieltomazini.com/api/v1/consumo-diario/');
        })
        .then(res => res.json())
        .then(consumosData => {
          // Extrair ids de devices com leitura
          const idsComLeitura = new Set(consumosData.map(c => c.id_device_vinc));
          // Calcular cobertura
          const totalDevices = this.devices.length;
          const totalComLeitura = Array.from(idsComLeitura).filter(id => this.devices.some(d => d.id === id)).length;
          this.cobertura = totalDevices > 0 ? Math.round((totalComLeitura / totalDevices) * 100) : 0;
        })
        .catch(() => {
          this.devices = [];
          this.cobertura = 0;
        });
      this.atualizarHorarioSistema();
      setInterval(this.atualizarHorarioSistema, 1000);
    },
    methods: {
      atualizarHorarioSistema() {
        const agora = new Date();
        this.horarioSistema = agora.toLocaleString('pt-BR', { hour12: false });
      }
    }
  }
  </script>
  
  <!-- O CSS pode ser mantido do seu arquivo original -->
  <!-- O "scoped" garante que esses estilos só se aplicam a este componente -->
  <style scoped>
  /* Se você estiver importando seu CSS global no App.vue, você precisa apenas
     adicionar estilos específicos desta página aqui */
  
  /* Layout principal ocupando toda a largura */
  .homepage {
    display: flex;
    min-height: 100vh;
    background: #f4f8fb; /* cor de fundo suave para a página */
  }
  
  .main {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 24px;
    box-sizing: border-box;
  }
  
  .coluna {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  
  .linha1, .linha2 {
    display: flex;
    gap: 24px;
  }
  
  .linha3 {
    display: flex;
    gap: 24px;
  }
  
  .Quadro1, .Quadro2, .Quadro3, .Quadro4, .Quadro5 {
    background: #00A5EC;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.10);
    padding: 20px;
    min-width: 180px;
    min-height: 120px;
    flex: 1 1 180px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    box-sizing: border-box;
    overflow: hidden;
  }
  
  .titulo_quadro {
    font-size: 1.1rem;
    font-weight: bold;
    margin-bottom: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    color: #111;
  }
  
  .device-list {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    margin-top: 16px;
  }
  .device-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 90px;
  }
  .device-circle {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: #fff;
    border: 3px solid #007bb8;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    color: #00A5EC;
    font-weight: bold;
    overflow: hidden;
  }
  .device-img {
    width: 38px;
    height: 38px;
    object-fit: contain;
    display: block;
  }
  .device-name {
    color: #111;
    font-size: 1rem;
    text-align: center;
    word-break: break-word;
  }
  
  .Quadro4 {
    min-height: 220px; /* aumenta altura mínima para caber mais info */
  }
  .mapa-lista {
    list-style: none;
    padding: 0;
    margin: 4px 0 0 0; /* reduz espaço superior */
  }
  .mapa-lista li {
    color: #fff;
    font-size: 1.01rem;
    margin-bottom: 3px; /* reduz espaço entre linhas */
    display: flex;
    align-items: center;
    gap: 6px;
    line-height: 1.2;
  }
  .mapa-lista .emoji {
    margin-left: 4px;
  }
  .mapa-desativado {
    color: #ffd700;
    margin-left: 4px;
  }
  .mapa-info {
    color: #ffd700;
    font-size: 0.93rem;
    margin-top: 4px; /* reduz espaço superior */
    font-style: italic;
    line-height: 1.2;
  }
  
  .sobre-flex {
    display: flex;
    flex-direction: row;
    gap: 40px;
    width: 100%;
    background: rgba(0,0,0,0.07);
    border-radius: 8px;
    padding: 14px 18px;
    box-sizing: border-box;
  }
  .sobre-col {
    flex: 1 1 0;
    min-width: 220px;
    color: #fff;
    font-size: 1.05rem;
    line-height: 1.5;
  }
  .sobre-autores {
    margin-bottom: 10px;
  }
  .sobre-titulo {
    margin-bottom: 10px;
  }
  .sobre-info strong {
    color: #ffd700;
  }
  
  .cobertura-bar-container {
    width: 100%;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
  }
  .cobertura-bar {
    width: 100%;
    height: 44px; /* mais grossa */
    background: #eaf6fb;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 1px 4px rgba(0,0,0,0.07);
    margin-bottom: 8px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .cobertura-bar-preenchida {
    height: 100%;
    background: linear-gradient(90deg, #00c6fb 0%, #005bea 100%);
    border-radius: 16px 0 0 16px;
    transition: width 0.7s cubic-bezier(.4,2,.3,1);
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
  }
  .cobertura-label {
    color: #111;
    font-size: 1.18rem;
    font-weight: 700;
    text-shadow: 0 1px 2px rgba(0,0,0,0.10);
    width: 100%;
    text-align: center;
    position: relative;
    z-index: 2;
  }
  .cobertura-legenda {
    color: #fff;
    font-size: 0.98rem;
    margin-top: 6px;
    text-align: center;
    opacity: 0.85;
  }
  
  @media (max-width: 900px) {
    .linha1, .linha2, .linha3 {
      flex-direction: column;
      gap: 16px;
    }
    .main {
      padding: 8px;
    }
    .sobre-flex {
      flex-direction: column;
      gap: 10px;
      padding: 10px 6px;
    }
  }
  
  .texto-branco {
    color: #fff !important;
  }
  .status-alerta {
    font-size: 1.32rem;
    font-weight: 700;
    margin: 12px 0 8px 0;
    padding: 6px 14px;
    border-radius: 8px;
    text-align: left;
    width: fit-content;
  }
  .status-urgencia {
    background: #ff3b3b;
    color: #fff;
  }
  .status-alerta-amarelo {
    background: #ffd700;
    color: #222;
  }
  .status-estavel {
    background: #ffb300;
    color: #fff;
  }
  .status-perfeito {
    background: #00c853;
    color: #fff;
  }
  .cidade-temperatura {
    font-size: 1.18rem;
    margin-top: 10px;
    font-weight: 500;
  }
  .horario-sistema {
    font-size: 1.11rem;
    margin-top: 2px;
    opacity: 0.93;
  }
  </style>