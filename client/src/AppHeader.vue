<template>
  <header class="bg-white/95 backdrop-blur-md border-b border-neutral-200 sticky top-0 z-50">
    <div class="container mx-auto px-6 py-4 flex items-center justify-between">
      <!-- Logo -->
      <router-link to="/" class="text-2xl font-black text-neutral-900 tracking-tight">
        EcoMarket
      </router-link>

      <!-- Barre de recherche -->
      <div class="flex-1 max-w-xl mx-12">
        <div class="relative">
          <input
            type="text"
            v-model="searchQuery"
            @keyup.enter="performSearch"
            placeholder="Rechercher un produit..."
            class="w-full px-5 py-3 bg-neutral-100 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all duration-300 placeholder-neutral-500"
          />
          <button 
            @click="performSearch"
            class="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Navigation utilisateur -->
      <nav class="flex items-center space-x-8">
        <router-link to="/products" class="bg-neutral-900 text-white px-6 py-3 rounded-xl hover:bg-neutral-800 transition-all duration-300 font-medium shadow-sm hover:shadow-md">
          Produits
        </router-link>
        <button class="text-neutral-700 hover:text-neutral-900 p-2 rounded-full hover:bg-neutral-100 transition-all duration-300">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
        </button>
        <button class="text-neutral-700 hover:text-neutral-900 p-2 rounded-full hover:bg-neutral-100 transition-all duration-300 relative">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          <span class="absolute -top-1 -right-1 bg-neutral-900 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            0
          </span>
        </button>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')

const performSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      path: '/products',
      query: { q: searchQuery.value.trim() }
    })
  }
}
</script>