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
      
      <router-link to="/consumo">
        <section class="item_side_menu">
          <img src="@/assets/images/side_menu/chart-bold.png" alt="Consumo">
          CONSUMO
        </section>
      </router-link>
      
      <router-link to="/alertas">
        <section class="item_side_menu">
          <img src="@/assets/images/side_menu/notification-fill.png" alt="Alertas">
          ALERTAS
        </section>
      </router-link>
      
      <router-link to="/preferencias">
        <section class="item_side_menu">
          <img src="@/assets/images/side_menu/gear.png" alt="Preferências">
          PREFERÊNCIA
        </section>
      </router-link>
      
      <router-link to="/dispositivos">
        <section class="item_side_menu">
          <img src="@/assets/images/side_menu/device.png" alt="Dispositivos">
          DISPOSITIVOS
        </section>
      </router-link>
      
      <router-link to="/perfil">
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
  </style>