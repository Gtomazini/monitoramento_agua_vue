import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomePage.vue'
import Dashboard from '../views/DashboardPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/consumo',
    name: 'Consumo',
    // Carregamento lazy (sob demanda)
   // component: () => import(/* webpackChunkName: "consumo" */ '../views/Consumo.vue')
  },
  {
    path: '/alertas',
    name: 'Alertas',
  //  component: () => import(/* webpackChunkName: "alertas" */ '../views/Alertas.vue')
  },
  {
    path: '/preferencias',
    name: 'Preferencias',
   // component: () => import(/* webpackChunkName: "preferencias" */ '../views/Preferencias.vue')
  },
  {
    path: '/dispositivos',
    name: 'Dispositivos',
   // component: () => import(/* webpackChunkName: "dispositivos" */ '../views/Dispositivos.vue')
  },
  {
    path: '/perfil',
    name: 'Perfil',
   // component: () => import(/* webpackChunkName: "perfil" */ '../views/Perfil.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router