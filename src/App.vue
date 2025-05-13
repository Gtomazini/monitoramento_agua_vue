<template>
  <div id="app">
    <!-- O router-view é onde o conteúdo das páginas será renderizado -->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* Importação do seu arquivo CSS */
@import './assets/css/style.css';

/* Importação da fonte Rubik do Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap');

/* Reset básico */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Rubik', sans-serif;
  margin: 0;
  padding: 0;
}

#app {
  /* Remova o margin-top se não quiser que o conteúdo comece mais para baixo */
  margin-top: 0;
  /* Remova o text-align: center a menos que queira todo o conteúdo centralizado */
  text-align: left;
  color: #2c3e50;
  /* Isso garantirá que o app ocupe toda a altura da tela, importante para o layout da sidebar */
  min-height: 100vh;
}

/* Se você não tiver definido essas classes no style.css, coloque aqui */
/* Esses são estilos globais que você precisará para todas as páginas */

/* Exemplo: se você não importou os estilos da sidebar no style.css */
.sidebar {
  height: 100%;
  width: 150px;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  background-color: #00A5EC;
  overflow: hidden;  
}

.sidebar a {
  padding: 20px 25px 10px 25px;
  text-decoration: none;
  font-size: 20px;
  color: antiquewhite;
  display: block;
  font-family: "Rubik", sans-serif;
  font-weight: 600;
}

.item_side_menu {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  align-items: center;
}

.item_side_menu img {
  height: 30px;
  width: 30px;
}

.main {
  margin-left: 150px;
  font-size: 28px;
  padding: 0px 10px;
  width: calc(100% - 150px);
  box-sizing: border-box;
}
</style>