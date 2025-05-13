<template>
    <div class="dashboardpage">
      <Sidebar />
      
      <section class="main">
        <section class="coluna">
          <section class="linha1">
            <section class="Quadro1">
              <section class="titulo_quadro">Consumo - Hora</section>
              <section class="bloco_texto">
                <section class="texto_normal">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sollicitudin nec dui ac gravida.</section>
              </section>
              <section class="titulo_quadro">28°C</section>
              <section class="titulo_quadro">temperatura</section>
            </section>
            <section class="Quadro2">
              <section class="titulo_quadro">Dispositivos</section>
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
  import Sidebar from '@/components/SidebarMenu.vue'
  
  export default {
    name: 'DashboardPage',
    components: {
      Sidebar
    },
    data() {
      return {
        temperatura: '28°C'
      }
    }
  }
  </script>
  
  <style scoped>
  /* Estilos específicos da página dashboard, se necessário */
  </style>