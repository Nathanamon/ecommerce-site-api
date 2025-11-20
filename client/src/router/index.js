import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../HomeView.vue'
import ProductsView from '../ProductsView.vue'  // Changé de CategoryView à ProductsView
import ProductDetailView from '../ProductDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
    }
    // Tu peux garder l'ancienne route pour les catégories si besoin plus tard
  ]
})

export default router