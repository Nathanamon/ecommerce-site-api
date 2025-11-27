<template>
  <div class="min-h-screen bg-gradient-to-b from-white to-neutral-50">
    <AppHeader />
    
    <main class="container mx-auto px-8 py-16">
      <!-- En-tête -->
      <div class="mb-16 text-center">
        <h1 class="text-6xl md:text-7xl font-black text-neutral-900 mb-6 tracking-tighter">Notre Collection</h1>
        <p class="text-neutral-600 text-xl max-w-2xl mx-auto" v-if="!loading">
          Découvrez notre sélection complète de <span class="font-bold text-neutral-900">{{ filteredProducts.length }}</span> produits
          <span v-if="searchQuery" class="block mt-2 text-neutral-900 font-semibold">
            pour "{{ searchQuery }}"
          </span>
        </p>
        <div class="w-24 h-1.5 bg-neutral-900 mx-auto rounded-full mt-6"></div>
      </div>

      <div class="flex flex-col lg:flex-row gap-10">
        <!-- Sidebar des filtres -->
        <aside class="lg:w-80 flex-shrink-0">
          <div class="bg-white rounded-3xl shadow-xl p-8 sticky top-24 border border-neutral-100">
            <h3 class="font-black text-2xl mb-8 text-neutral-900 tracking-tight">Filtres</h3>
            
            <!-- Filtre par prix -->
            <div class="mb-8 pb-8 border-b border-neutral-100">
              <h4 class="font-bold text-lg mb-5 text-neutral-900">Prix</h4>
              <div class="space-y-3">
                <label class="flex items-center group cursor-pointer p-3 rounded-xl hover:bg-neutral-50 transition-colors duration-300">
                  <input 
                    type="radio" 
                    v-model="priceRange" 
                    value="all" 
                    class="mr-3 w-5 h-5 text-neutral-900 focus:ring-neutral-900 focus:ring-2"
                  >
                  <span class="text-neutral-700 group-hover:text-neutral-900 font-medium transition-colors">Tous les prix</span>
                </label>
                <label class="flex items-center group cursor-pointer p-3 rounded-xl hover:bg-neutral-50 transition-colors duration-300">
                  <input 
                    type="radio" 
                    v-model="priceRange" 
                    value="0-50" 
                    class="mr-3 w-5 h-5 text-neutral-900 focus:ring-neutral-900 focus:ring-2"
                  >
                  <span class="text-neutral-700 group-hover:text-neutral-900 font-medium transition-colors">Moins de 50€</span>
                </label>
                <label class="flex items-center group cursor-pointer p-3 rounded-xl hover:bg-neutral-50 transition-colors duration-300">
                  <input 
                    type="radio" 
                    v-model="priceRange" 
                    value="50-100" 
                    class="mr-3 w-5 h-5 text-neutral-900 focus:ring-neutral-900 focus:ring-2"
                  >
                  <span class="text-neutral-700 group-hover:text-neutral-900 font-medium transition-colors">50€ - 100€</span>
                </label>
                <label class="flex items-center group cursor-pointer p-3 rounded-xl hover:bg-neutral-50 transition-colors duration-300">
                  <input 
                    type="radio" 
                    v-model="priceRange" 
                    value="100-500" 
                    class="mr-3 w-5 h-5 text-neutral-900 focus:ring-neutral-900 focus:ring-2"
                  >
                  <span class="text-neutral-700 group-hover:text-neutral-900 font-medium transition-colors">100€ - 500€</span>
                </label>
                <label class="flex items-center group cursor-pointer p-3 rounded-xl hover:bg-neutral-50 transition-colors duration-300">
                  <input 
                    type="radio" 
                    v-model="priceRange" 
                    value="500+" 
                    class="mr-3 w-5 h-5 text-neutral-900 focus:ring-neutral-900 focus:ring-2"
                  >
                  <span class="text-neutral-700 group-hover:text-neutral-900 font-medium transition-colors">Plus de 500€</span>
                </label>
              </div>
            </div>

            <!-- Filtre par note -->
            <div class="mb-8 pb-8 border-b border-neutral-100">
              <h4 class="font-bold text-lg mb-5 text-neutral-900">Note minimum</h4>
              <div class="flex items-center gap-2">
                <span 
                  v-for="star in 5" 
                  :key="star"
                  @click="setMinRating(star)"
                  class="cursor-pointer text-4xl transition-all duration-300 hover:scale-125"
                  :class="star <= minRating ? 'text-yellow-400 drop-shadow-lg' : 'text-neutral-200'"
                >
                  ★
                </span>
              </div>
              <span class="text-sm text-neutral-500 mt-3 block font-medium">{{ minRating > 0 ? minRating + ' étoile(s) & plus' : 'Toutes les notes' }}</span>
            </div>

            <!-- Filtre par stock -->
            <div class="mb-4">
              <label class="flex items-center group cursor-pointer p-3 rounded-xl hover:bg-neutral-50 transition-colors duration-300">
                <input 
                  type="checkbox" 
                  v-model="inStockOnly" 
                  class="mr-3 w-5 h-5 text-neutral-900 rounded-lg focus:ring-neutral-900 focus:ring-2"
                >
                <span class="text-neutral-700 group-hover:text-neutral-900 font-semibold transition-colors">En stock seulement</span>
              </label>
            </div>

            <!-- Bouton reset -->
            <button 
              @click="resetFilters"
              class="w-full mt-6 bg-neutral-100 text-neutral-900 py-3 rounded-xl font-bold hover:bg-neutral-200 transition-all duration-300"
            >
              Réinitialiser
            </button>
          </div>
        </aside>

        <!-- Contenu principal -->
        <div class="flex-1">
          <!-- Barre de tri -->
          <div class="bg-white rounded-3xl shadow-xl p-6 mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border border-neutral-100">
            <div class="flex items-center gap-4">
              <select 
                v-model="sortBy"
                class="border-2 border-neutral-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-all duration-300 font-semibold text-neutral-900 bg-white cursor-pointer hover:border-neutral-400"
              >
                <option value="name">Nom (A-Z)</option>
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
                <option value="rating">Meilleures notes</option>
              </select>
            </div>
            
            <!-- Vue (grille/liste) -->
            <div class="flex items-center gap-2 bg-neutral-100 p-2 rounded-2xl">
              <button 
                @click="viewMode = 'grid'"
                class="p-3 rounded-xl transition-all duration-300"
                :class="viewMode === 'grid' ? 'bg-white text-neutral-900 shadow-md' : 'text-neutral-500 hover:text-neutral-900'"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm0 8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm8-8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zm0 8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                </svg>
              </button>
              <button 
                @click="viewMode = 'list'"
                class="p-3 rounded-xl transition-all duration-300"
                :class="viewMode === 'list' ? 'bg-white text-neutral-900 shadow-md' : 'text-neutral-500 hover:text-neutral-900'"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- État de chargement -->
          <div v-if="loading" class="text-center py-32">
            <div class="relative inline-flex items-center justify-center">
              <div class="animate-spin rounded-full h-20 w-20 border-4 border-neutral-200 border-t-neutral-900"></div>
              <div class="absolute animate-ping rounded-full h-16 w-16 border-2 border-neutral-300 opacity-20"></div>
            </div>
            <p class="mt-8 text-neutral-600 text-lg font-medium">Chargement des produits...</p>
          </div>

          <!-- Produits -->
          <div 
            v-else
            :class="[
              'gap-8',
              viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' 
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
          <div v-if="!loading && sortedProducts.length === 0" class="text-center py-32">
            <div class="max-w-md mx-auto">
              <div class="w-32 h-32 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg class="w-16 h-16 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <p class="text-neutral-900 text-2xl font-bold mb-3">
                <span v-if="searchQuery">
                  Aucun produit pour "{{ searchQuery }}"
                </span>
                <span v-else>
                  Aucun produit trouvé
                </span>
              </p>
              <p class="text-neutral-600 mb-8">Essayez de modifier vos critères de recherche</p>
              <button 
                @click="resetFilters"
                class="bg-neutral-900 text-white px-10 py-4 rounded-full font-bold hover:bg-neutral-800 transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Réinitialiser les filtres
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './AppHeader.vue'  // ← Chemin corrigé
import ProductCard from './ProductCard.vue'  // ← Import ajouté

const route = useRoute()

// Données initialisées à vide
const allProducts = ref([])
const loading = ref(true)
const error = ref(null)

// États des filtres
const priceRange = ref('all')
const minRating = ref(0)
const inStockOnly = ref(false)
const sortBy = ref('name')
const viewMode = ref('grid')

// Computed properties
const searchQuery = computed(() => route.query.q || '')

const filteredProducts = computed(() => {
  let filtered = allProducts.value.filter(product => {
    // Filtre par recherche
    const searchMatch = !searchQuery.value || 
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase())

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

    return searchMatch && priceMatch && ratingMatch && stockMatch
  })

  return filtered
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

// Lifecycle
onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    // Appel vers TON serveur Node.js (pas Supabase direct)
    const response = await fetch('http://localhost:3000/api/products')
    
    if (!response.ok) throw new Error('Erreur réseau')
    
    // On remplit la variable avec les vraies données
    allProducts.value = await response.json()
    
  } catch (err) {
    console.error("Erreur de chargement:", err)
    error.value = "Impossible de charger les produits."
  } finally {
    loading.value = false
  }
})

// Réinitialiser les filtres quand la recherche change
watch(searchQuery, () => {
  priceRange.value = 'all'
  minRating.value = 0
  inStockOnly.value = false
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