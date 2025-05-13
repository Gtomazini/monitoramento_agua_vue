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
        temperatura: '28°C'
      }
    }
  }
  </script>
  
  <!-- O CSS pode ser mantido do seu arquivo original -->
  <!-- O "scoped" garante que esses estilos só se aplicam a este componente -->
  <style scoped>
  /* Se você estiver importando seu CSS global no App.vue, você precisa apenas
     adicionar estilos específicos desta página aqui */
  </style>