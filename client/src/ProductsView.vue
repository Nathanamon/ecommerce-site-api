<template>
  <div class="min-h-screen bg-white">
    <AppHeader />
    
    <main class="container mx-auto px-6 py-12">
      <!-- En-tête modifié -->
      <div class="mb-12 text-center">
        <h1 class="text-5xl font-black text-neutral-900 mb-4">Notre Collection</h1>
        <p class="text-neutral-600 text-xl" v-if="!loading">
          Découvrez notre sélection complète de {{ filteredProducts.length }} produits
          <span v-if="searchQuery" class="text-neutral-900 font-semibold">
            pour "{{ searchQuery }}"
          </span>
        </p>
      </div>

      <div class="flex flex-col lg:flex-row gap-12">
        <!-- Sidebar des filtres -->
        <aside class="lg:w-80 flex-shrink-0">
          <div class="bg-white rounded-2xl shadow-lg p-8 sticky top-24 border border-neutral-100">
            <h3 class="font-black text-2xl mb-8 text-neutral-900">Filtres</h3>
            
            <!-- Filtre par prix -->
            <div class="mb-8">
              <h4 class="font-bold text-lg mb-4 text-neutral-900">Prix</h4>
              <div class="space-y-3">
                <label class="flex items-center group cursor-pointer">
                  <input 
                    type="radio" 
                    v-model="priceRange" 
                    value="all" 
                    class="mr-3 w-4 h-4 text-neutral-900 focus:ring-neutral-900"
                  >
                  <span class="group-hover:text-neutral-900 transition-colors">Tous les prix</span>
                </label>
                <label class="flex items-center group cursor-pointer">
                  <input 
                    type="radio" 
                    v-model="priceRange" 
                    value="0-50" 
                    class="mr-3 w-4 h-4 text-neutral-900 focus:ring-neutral-900"
                  >
                  <span class="group-hover:text-neutral-900 transition-colors">Moins de 50€</span>
                </label>
                <label class="flex items-center group cursor-pointer">
                  <input 
                    type="radio" 
                    v-model="priceRange" 
                    value="50-100" 
                    class="mr-3 w-4 h-4 text-neutral-900 focus:ring-neutral-900"
                  >
                  <span class="group-hover:text-neutral-900 transition-colors">50€ - 100€</span>
                </label>
                <label class="flex items-center group cursor-pointer">
                  <input 
                    type="radio" 
                    v-model="priceRange" 
                    value="100-500" 
                    class="mr-3 w-4 h-4 text-neutral-900 focus:ring-neutral-900"
                  >
                  <span class="group-hover:text-neutral-900 transition-colors">100€ - 500€</span>
                </label>
                <label class="flex items-center group cursor-pointer">
                  <input 
                    type="radio" 
                    v-model="priceRange" 
                    value="500+" 
                    class="mr-3 w-4 h-4 text-neutral-900 focus:ring-neutral-900"
                  >
                  <span class="group-hover:text-neutral-900 transition-colors">Plus de 500€</span>
                </label>
              </div>
            </div>

            <!-- Filtre par note -->
            <div class="mb-8">
              <h4 class="font-bold text-lg mb-4 text-neutral-900">Note minimum</h4>
              <div class="flex items-center space-x-2">
                <span 
                  v-for="star in 5" 
                  :key="star"
                  @click="setMinRating(star)"
                  class="cursor-pointer text-3xl transition-transform hover:scale-110"
                  :class="star <= minRating ? 'text-yellow-400' : 'text-neutral-300'"
                >
                  ★
                </span>
                <span class="text-sm text-neutral-600 ml-3 font-medium">& plus</span>
              </div>
            </div>

            <!-- Filtre par stock -->
            <div>
              <label class="flex items-center group cursor-pointer">
                <input 
                  type="checkbox" 
                  v-model="inStockOnly" 
                  class="mr-3 w-4 h-4 text-neutral-900 rounded focus:ring-neutral-900"
                >
                <span class="group-hover:text-neutral-900 transition-colors font-medium">En stock seulement</span>
              </label>
            </div>
          </div>
        </aside>

        <!-- Contenu principal -->
        <div class="flex-1">
          <!-- Barre de tri -->
          <div class="bg-white rounded-2xl shadow-lg p-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border border-neutral-100">
            <div class="flex items-center space-x-4">
              <select 
                v-model="sortBy"
                class="border-2 border-neutral-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-all duration-300 font-medium"
              >
                <option value="name">Trier par : Nom</option>
                <option value="price_asc">Prix : Croissant</option>
                <option value="price_desc">Prix : Décroissant</option>
                <option value="rating">Meilleures notes</option>
              </select>
            </div>
            
            <!-- Vue (grille/liste) -->
            <div class="flex items-center space-x-2 bg-neutral-100 p-1 rounded-xl">
              <button 
                @click="viewMode = 'grid'"
                class="p-3 rounded-xl transition-all duration-300"
                :class="viewMode === 'grid' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-600 hover:text-neutral-900'"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm0 8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm8-8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zm0 8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                </svg>
              </button>
              <button 
                @click="viewMode = 'list'"
                class="p-3 rounded-xl transition-all duration-300"
                :class="viewMode === 'list' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-600 hover:text-neutral-900'"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- État de chargement -->
          <div v-if="loading" class="text-center py-20">
            <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-neutral-900 mx-auto"></div>
            <p class="mt-6 text-neutral-600 text-lg">Chargement des produits...</p>
          </div>

          <!-- Produits -->
          <div 
            v-else
            :class="[
              'gap-8',
              viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3' 
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
          <div v-if="!loading && sortedProducts.length === 0" class="text-center py-20">
            <p class="text-neutral-600 text-xl mb-4">
              <span v-if="searchQuery">
                Aucun produit ne correspond à "{{ searchQuery }}"
              </span>
              <span v-else>
                Aucun produit ne correspond à vos critères.
              </span>
            </p>
            <button 
              @click="resetFilters"
              class="bg-neutral-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-neutral-800 transition-all duration-300"
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