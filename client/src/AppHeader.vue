<template>
  <header class="bg-white/80 backdrop-blur-xl border-b border-neutral-100/50 sticky top-0 z-50 shadow-sm">
    <div class="container mx-auto px-8 py-5">
      <!-- Conteneur principal -->
      <div class="flex items-center justify-between gap-8">
        
        <!-- Logo -->
        <router-link 
          to="/" 
          class="text-2xl font-black text-neutral-900 tracking-tighter hover:text-neutral-700 transition-colors duration-300 flex-shrink-0"
        >
          EcoMarket
        </router-link>

        <!-- Barre de recherche centrale -->
        <div class="flex-1 max-w-2xl">
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg class="w-5 h-5 text-neutral-400 group-focus-within:text-neutral-900 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input
              type="text"
              v-model="searchQuery"
              @keyup.enter="performSearch"
              placeholder="Rechercher un produit..."
              class="w-full pl-12 pr-5 py-3.5 bg-neutral-50 border border-neutral-200/50 rounded-full text-neutral-900 placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-neutral-900 focus:ring-4 focus:ring-neutral-100 transition-all duration-300 text-sm font-medium"
            />
          </div>
        </div>

        <!-- Navigation utilisateur -->
        <nav class="flex items-center gap-2">
          <!-- Bouton Produits -->
          <router-link 
            to="/products" 
            class="hidden sm:flex items-center gap-2 bg-neutral-900 text-white px-6 py-3 rounded-full hover:bg-neutral-800 transition-all duration-300 font-semibold text-sm shadow-lg shadow-neutral-900/20 hover:shadow-xl hover:shadow-neutral-900/30 hover:-translate-y-0.5"
          >
            <span>Produits</span>
          </router-link>

          <!-- Icône Utilisateur -->
          <router-link 
            to="/profile"
            class="p-3 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-all duration-300 relative group"
            aria-label="Compte utilisateur"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            <span class="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
              Compte
            </span>
          </router-link>

          <!-- Panier -->
          <router-link 
            to="/cart"
            class="p-3 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-all duration-300 relative group"
            aria-label="Panier"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <span class="absolute -top-1 -right-1 bg-neutral-900 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg">
              {{ cartStore.itemCount }}
            </span>
            <span class="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
              Panier
            </span>
          </router-link>
        </nav>
      </div>
    </div>

    <!-- Barre de navigation mobile (optionnelle) -->
    <div class="sm:hidden border-t border-neutral-100 px-8 py-3">
      <router-link 
        to="/products" 
        class="flex items-center justify-center gap-2 bg-neutral-900 text-white px-6 py-3 rounded-full hover:bg-neutral-800 transition-all duration-300 font-semibold text-sm w-full"
      >
        <span>Voir tous les produits</span>
      </router-link>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from './stores/cart'
import { useAuthStore } from './stores/auth'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const searchQuery = ref('')

const performSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      path: '/products',
      query: { q: searchQuery.value.trim() }
    })
  }
}

const goToProfile = () => {
  if (authStore.isAuthenticated) {
    router.push('/profile')
  } else {
    router.push('/login')
  }
}

const goToCart = () => {
  router.push('/cart')
}
</script>