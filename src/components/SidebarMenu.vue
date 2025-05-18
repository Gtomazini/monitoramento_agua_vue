<template>
    <section class="sidebar">
      <router-link to="/">
        <section class="item_side_menu">
          <img src="@/assets/images/side_menu/home.png" alt="Home">
          HOME
        </section>
      </router-link>
      
      <router-link to="/dashboard">
        <section class="item_side_menu">
          <img src="@/assets/images/side_menu/dashboard.png" alt="Dashboard">
          DASHBOARD
        </section>
      </router-link>
      
      <router-link to="/consumo" class="side-disabled" tabindex="-1" @click.prevent>
        <section class="item_side_menu">
          <img src="@/assets/images/side_menu/chart-bold.png" alt="Consumo">
          CONSUMO
        </section>
      </router-link>
      
      <router-link to="/alertas" class="side-disabled" tabindex="-1" @click.prevent>
        <section class="item_side_menu">
          <img src="@/assets/images/side_menu/notification-fill.png" alt="Alertas">
          ALERTAS
        </section>
      </router-link>
      
      <router-link to="/preferencias" class="side-disabled" tabindex="-1" @click.prevent>
        <section class="item_side_menu">
          <img src="@/assets/images/side_menu/gear.png" alt="Preferências">
          PREFERÊNCIA
        </section>
      </router-link>
      
      <router-link to="/dispositivos" class="side-disabled" tabindex="-1" @click.prevent>
        <section class="item_side_menu">
          <img src="@/assets/images/side_menu/device.png" alt="Dispositivos">
          DISPOSITIVOS
        </section>
      </router-link>
      
      <router-link to="/perfil" class="side-disabled" tabindex="-1" @click.prevent>
        <section class="item_side_menu">
          <img src="@/assets/images/side_menu/perfil.png" alt="Perfil">
          PERFIL
        </section>
      </router-link>
    </section>
  </template>
  
  <script>
  export default {
    name: 'SidebarMenu'
  }
  </script>
  
  <style scoped>
  /* Você pode manter os estilos da sidebar aqui se quiser */
  /* Ou pode deixar vazio se estiver importando seu CSS global no App.vue */
  .side-disabled {
    pointer-events: none;
    filter: grayscale(1) brightness(1.2);
    opacity: 0.6;
    cursor: not-allowed !important;
  }
  </style>