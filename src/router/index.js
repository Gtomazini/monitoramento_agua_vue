import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomePage.vue'
import Dashboard from '../views/DashboardPage.vue'
import AccessCode from '@/views/AccessCodePage.vue'

const routes = [
    {
    path: '/',
    name: 'AccessCode',
    component: AccessCode
  },
  {
    path: '/access',
    name: 'AccessCode',
    component: AccessCode
  },
  {
    path: '/home',
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

// Guard de rota para verificar autenticação
router.beforeEach((to, from, next) => {
  // Usar userId como critério de autenticação: sem userId não pode acessar as views privadas
  const hasUserId = localStorage.getItem('userId')

  // Se não tem userId e não está na página de acesso, redireciona para a página de código
  if (!hasUserId && to.name !== 'AccessCode') {
    next({ name: 'AccessCode' })
  } else {
    next()
  }
})

export default router