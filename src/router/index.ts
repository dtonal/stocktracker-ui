import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/portfolio',
      name: 'portfolio',
      component: () => import('../views/PortfolioView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  const requiresAuth = to.meta.requiresAuth
  const isLoggedIn = authStore.isLoggedIn

  if (requiresAuth && !isLoggedIn) {
    next({ name: 'login' })
    console.log('Redirecting to login because requiresAuth is true and user is not logged in')
  } else if (isLoggedIn && (to.name === 'login' || to.name === 'register')) {
    next({ name: 'home' })
    console.log('Redirecting to home because user is logged in and trying to access login')
  } else {
    next()
  }
})

export default router
