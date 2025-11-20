<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    
    <main class="container mx-auto px-4 py-8">
      <!-- En-tête modifié -->
      <div class="mb-8 text-center">
        <h1 class="text-4xl font-bold text-gray-900">Tous nos produits</h1>
        <p class="text-gray-600 mt-2">Découvrez notre sélection complète de {{ filteredProducts.length }} produits</p>
      </div>

      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar des filtres (identique) -->
        <aside class="lg:w-64 flex-shrink-0">
          <div class="bg-white rounded-lg shadow-sm p-6 sticky top-4">
            <h3 class="font-semibold text-lg mb-4">Filtres</h3>
            
            <!-- Filtre par prix -->
            <div class="mb-6">
              <h4 class="font-medium mb-3">Prix</h4>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input 
                    type="radio" 
                    v-model="priceRange" 
                    value="all" 
                    class="mr-2"
                  >
                  Tous les prix
                </label>
                <label class="flex items-center">
                  <input 
                    type="radio" 
                    v-model="priceRange" 
                    value="0-50" 
                    class="mr-2"
                  >
                  Moins de 50€
                </label>
                <label class="flex items-center">
                  <input 
                    type="radio" 
                    v-model="priceRange" 
                    value="50-100" 
                    class="mr-2"
                  >
                  50€ - 100€
                </label>
                <label class="flex items-center">
                  <input 
                    type="radio" 
                    v-model="priceRange" 
                    value="100-500" 
                    class="mr-2"
                  >
                  100€ - 500€
                </label>
                <label class="flex items-center">
                  <input 
                    type="radio" 
                    v-model="priceRange" 
                    value="500+" 
                    class="mr-2"
                  >
                  Plus de 500€
                </label>
              </div>
            </div>

            <!-- Filtre par note -->
            <div class="mb-6">
              <h4 class="font-medium mb-3">Note minimum</h4>
              <div class="flex items-center space-x-1">
                <span 
                  v-for="star in 5" 
                  :key="star"
                  @click="setMinRating(star)"
                  class="cursor-pointer text-2xl"
                  :class="star <= minRating ? 'text-yellow-400' : 'text-gray-300'"
                >
                  ★
                </span>
                <span class="text-sm text-gray-600 ml-2">& plus</span>
              </div>
            </div>

            <!-- Filtre par stock -->
            <div>
              <label class="flex items-center">
                <input 
                  type="checkbox" 
                  v-model="inStockOnly" 
                  class="mr-2 rounded"
                >
                En stock seulement
              </label>
            </div>
          </div>
        </aside>

        <!-- Contenu principal -->
        <div class="flex-1">
          <!-- Barre de tri (identique) -->
          <div class="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div class="flex items-center space-x-4">
              <select 
                v-model="sortBy"
                class="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="name">Trier par : Nom</option>
                <option value="price_asc">Prix : Croissant</option>
                <option value="price_desc">Prix : Décroissant</option>
                <option value="rating">Meilleures notes</option>
              </select>
            </div>
            
            <!-- Vue (grille/liste) -->
            <div class="flex items-center space-x-2">
              <button 
                @click="viewMode = 'grid'"
                class="p-2 rounded-lg"
                :class="viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm0 8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm8-8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zm0 8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                </svg>
              </button>
              <button 
                @click="viewMode = 'list'"
                class="p-2 rounded-lg"
                :class="viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Produits -->
          <div 
            :class="[
              'gap-6',
              viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                : 'flex flex-col'
            ]"
          >
            <ProductCard 
              v-for="product in sortedProducts" 
              :key="product.id" 
              :product="product"
              :class="viewMode === 'list' ? 'flex-row items-center' : ''"
            />
          </div>

          <!-- Message aucun produit -->
          <div v-if="filteredProducts.length === 0" class="text-center py-12">
            <p class="text-gray-600 text-lg">Aucun produit ne correspond à vos critères.</p>
            <button 
              @click="resetFilters"
              class="mt-4 text-indigo-600 hover:text-indigo-700"
            >
              Réinitialiser les filtres
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppHeader from './AppHeader.vue'
import ProductCard from './ProductCard.vue'

// Données mockées étendues (plus de produits)
const allProducts = ref([
  {
    id: 1, name: 'Smartphone High-Tech 2024', price: 799, originalPrice: 899, discount: 11,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', reviewCount: 152, stock: 5, rating: 4.5
  },
  {
    id: 2, name: 'Casque Audio Sans Fil', price: 199, 
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', reviewCount: 89, stock: 15, rating: 4.2
  },
  {
    id: 3, name: 'Montre Connectée Sport', price: 299, originalPrice: 349, discount: 14,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', reviewCount: 203, stock: 25, rating: 4.8
  },
  {
    id: 4, name: 'Laptop Ultra Mince', price: 1299, 
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', reviewCount: 67, stock: 8, rating: 4.1
  },
  {
    id: 5, name: 'Enceinte Bluetooth', price: 149, 
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400', reviewCount: 134, stock: 0, rating: 4.3
  },
  {
    id: 6, name: 'Souris Gaming', price: 79, 
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400', reviewCount: 89, stock: 20, rating: 4.6
  },
  {
    id: 7, name: 'Clavier Mécanique', price: 129, 
    image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400', reviewCount: 76, stock: 12, rating: 4.4
  },
  {
    id: 8, name: 'Webcam 4K', price: 89, 
    image: 'https://images.unsplash.com/photo-1558089684-f07c6d95f7c6?w=400', reviewCount: 45, stock: 30, rating: 4.0
  },
  {
    id: 9, name: 'Tablette Graphique', price: 349, 
    image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400', reviewCount: 67, stock: 7, rating: 4.7
  },
  {
    id: 10, name: 'Disque Dur Externe 2TB', price: 89, 
    image: 'https://images.unsplash.com/photo-1597852074816-d933c7d2b988?w=400', reviewCount: 234, stock: 45, rating: 4.2
  }
])

// États des filtres
const priceRange = ref('all')
const minRating = ref(0)
const inStockOnly = ref(false)
const sortBy = ref('name')
const viewMode = ref('grid')

// Computed properties
const filteredProducts = computed(() => {
  return allProducts.value.filter(product => {
    // Filtre par prix
    const priceMatch = (() => {
      switch (priceRange.value) {
        case '0-50': return product.price <= 50
        case '50-100': return product.price > 50 && product.price <= 100
        case '100-500': return product.price > 100 && product.price <= 500
        case '500+': return product.price > 500
        default: return true
      }
    })()

    // Filtre par note
    const ratingMatch = product.rating >= minRating.value

    // Filtre par stock
    const stockMatch = !inStockOnly.value || product.stock > 0

    return priceMatch && ratingMatch && stockMatch
  })
})

const sortedProducts = computed(() => {
  const products = [...filteredProducts.value]
  
  switch (sortBy.value) {
    case 'price_asc':
      return products.sort((a, b) => a.price - b.price)
    case 'price_desc':
      return products.sort((a, b) => b.price - a.price)
    case 'rating':
      return products.sort((a, b) => b.rating - a.rating)
    case 'name':
    default:
      return products.sort((a, b) => a.name.localeCompare(b.name))
  }
})

// Méthodes
const setMinRating = (rating) => {
  minRating.value = rating
}

const resetFilters = () => {
  priceRange.value = 'all'
  minRating.value = 0
  inStockOnly.value = false
  sortBy.value = 'name'
}

onMounted(() => {
  console.log('Page produits chargée')
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>