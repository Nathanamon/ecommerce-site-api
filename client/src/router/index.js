import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

import HomeView from '../HomeView.vue'
import ProductsView from '../ProductsView.vue'  // Changé de CategoryView à ProductsView
import ProductDetailView from '../ProductDetailView.vue'
import LoginView from '../LoginView.vue'
import RegisterView from '../RegisterView.vue'
import ProfileView from '../ProfileView.vue'
import CartView from '../CartView.vue'
import CheckoutView from '../CheckoutView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/products',
      name: 'products',
      component: ProductsView
    },
    {
      path: '/product/:id',
      name: 'product',
      component: ProductDetailView
    },
    {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { guestOnly: true }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { guestOnly: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: { requiresAuth: true }
  },
  {
    path: '/cart',
    name: 'cart',
    component: CartView
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: CheckoutView,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: '/'
  }
    // Tu peux garder l'ancienne route pour les catégories si besoin plus tard
  ]
})


// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Routes nécessitant une authentification
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  }
  // Routes pour invités seulement (login, register)
  else if (to.meta.guestOnly && authStore.isAuthenticated) {
    next({ name: 'home' })
  }
  else {
    next()
  }
})

export default router
