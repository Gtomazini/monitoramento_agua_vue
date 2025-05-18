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
                <section class="texto_normal">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sollicitudin nec dui ac gravida.</section>
              </section>
              <section class="titulo_quadro">28°C</section>
              <section class="titulo_quadro">temperatura</section>
            </section>
            <section class="Quadro2">
              <section class="titulo_quadro">Dispositivos</section>
              <div class="device-list">
                <div v-for="device in devices" :key="device.id" class="device-item">
                  <div class="device-circle"></div>
                  <div class="device-name">{{ device.name }}</div>
                </div>
              </div>
            </section>
          </section>
          <section class="linha2">
            <section class="Quadro3">
              <section class="titulo_quadro">Cobertura</section>
            </section>
            <section class="Quadro4">
              <section class="titulo_quadro">Highlights</section>
            </section>
          </section>
        </section>
        <section class="linha3">
          <section class="Quadro5">
            <section class="titulo_quadro">Sobre</section>
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
        devices: []
      }
    },
    mounted() {
      fetch('https://watergame.gabrieltomazini.com/api/v1/devices/')
        .then(res => res.json())
        .then(data => {
          // Ajusta para pegar apenas name_device
          this.devices = Array.isArray(data) ? data.map(d => ({ name: d.name_device, id: d.id_device })) : [];
        })
        .catch(() => {
          this.devices = [];
        });
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
  }
  .device-name {
    color: #111;
    font-size: 1rem;
    text-align: center;
    word-break: break-word;
  }
  
  @media (max-width: 900px) {
    .linha1, .linha2, .linha3 {
      flex-direction: column;
      gap: 16px;
    }
    .main {
      padding: 8px;
    }
  }
  </style>