<template>
  <div class="min-h-screen bg-gradient-to-b from-white to-neutral-50">
    <AppHeader />
    
    <!-- État de chargement -->
    <div v-if="loading" class="container mx-auto px-8 py-20">
      <div class="text-center py-32">
        <div class="relative inline-flex items-center justify-center">
          <div class="animate-spin rounded-full h-20 w-20 border-4 border-neutral-200 border-t-neutral-900"></div>
          <div class="absolute animate-ping rounded-full h-16 w-16 border-2 border-neutral-300 opacity-20"></div>
        </div>
        <p class="mt-8 text-neutral-600 text-lg font-medium">Chargement du produit...</p>
      </div>
    </div>

    <!-- Produit non trouvé -->
    <div v-else-if="!product" class="container mx-auto px-8 py-20">
      <div class="text-center py-32">
        <div class="w-32 h-32 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg class="w-16 h-16 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        <h2 class="text-4xl font-black text-neutral-900 mb-6">Produit non trouvé</h2>
        <p class="text-neutral-600 mb-10 text-lg">Le produit que vous recherchez n'existe pas.</p>
        <router-link 
          to="/products" 
          class="inline-flex items-center gap-3 bg-neutral-900 text-white px-10 py-4 rounded-full font-bold hover:bg-neutral-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Voir tous les produits
        </router-link>
      </div>
    </div>

    <!-- Produit trouvé -->
    <main v-else class="container mx-auto px-8 py-16">
      <!-- Fil d'Ariane -->
      <nav class="flex items-center gap-3 text-sm text-neutral-600 mb-10 font-medium">
        <router-link to="/" class="hover:text-neutral-900 transition-colors">Accueil</router-link>
        <span class="text-neutral-300">›</span>
        <router-link to="/products" class="hover:text-neutral-900 transition-colors">Produits</router-link>
        <span class="text-neutral-300">›</span>
        <span class="text-neutral-900 font-semibold">{{ product.name }}</span>
      </nav>

      <div class="bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-100">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 p-12 lg:p-16">
          <!-- Galerie d'images -->
          <div>
            <div class="relative rounded-3xl overflow-hidden mb-6 bg-neutral-50 group">
              <img 
                :src="mainImage" 
                :alt="product.name"
                class="w-full h-[600px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <!-- Badge promotion -->
              <div v-if="product.discount" class="absolute top-8 left-8 bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-3 rounded-full text-base font-bold shadow-2xl backdrop-blur-sm">
                -{{ product.discount }}%
              </div>
            </div>
            
            <!-- Miniatures -->
            <div class="flex gap-4 overflow-x-auto pb-2">
              <button 
                v-for="(image, index) in product.images" 
                :key="index"
                @click="mainImage = image"
                class="flex-shrink-0 w-24 h-24 border-2 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105"
                :class="mainImage === image ? 'border-neutral-900 shadow-lg ring-2 ring-neutral-900/20' : 'border-neutral-200 hover:border-neutral-400'"
              >
                <img 
                  :src="image" 
                  :alt="`Vue ${index + 1} de ${product.name}`"
                  class="w-full h-full object-cover"
                />
              </button>
            </div>
          </div>

          <!-- Informations du produit -->
          <div class="flex flex-col">
            <h1 class="text-5xl font-black text-neutral-900 mb-8 leading-tight tracking-tight">{{ product.name }}</h1>
            
            <!-- Avis et note -->
            <div class="flex items-center mb-8">
              <div class="flex items-center gap-3">
                <div class="flex text-yellow-400 text-2xl">
                  <span v-for="star in 5" :key="star" class="drop-shadow-sm">
                    {{ star <= Math.round(product.rating) ? '★' : '☆' }}
                  </span>
                </div>
                <span class="text-neutral-600 font-semibold text-lg">{{ product.rating }}/5</span>
                <span class="text-neutral-400">•</span>
                <span class="text-neutral-600 font-medium">{{ product.reviewCount }} avis</span>
              </div>
            </div>

            <!-- Prix -->
            <div class="mb-10 pb-10 border-b border-neutral-100">
              <div class="flex items-baseline gap-4">
                <span class="text-5xl font-black text-neutral-900">{{ product.price }}€</span>
                <span v-if="product.originalPrice" class="text-2xl text-neutral-400 line-through">
                  {{ product.originalPrice }}€
                </span>
              </div>
              <span v-if="product.discount" class="inline-block mt-3 text-green-600 font-bold text-lg bg-green-50 px-4 py-2 rounded-full">
                Économisez {{ product.originalPrice - product.price }}€ !
              </span>
            </div>

            <!-- Description -->
            <div class="mb-10">
              <h3 class="font-bold text-xl mb-4 text-neutral-900">Description</h3>
              <p class="text-neutral-700 leading-relaxed text-lg">{{ product.description }}</p>
            </div>

            <!-- Options (couleur, taille, etc.) -->
            <div class="mb-10" v-if="product.options && product.options.length > 0">
              <div v-for="option in product.options" :key="option.name" class="mb-8">
                <h4 class="font-bold text-lg mb-4 text-neutral-900">{{ option.name }}</h4>
                <div class="flex flex-wrap gap-3">
                  <button 
                    v-for="value in option.values" 
                    :key="value"
                    @click="selectOption(option.name, value)"
                    class="px-6 py-3 border-2 rounded-2xl transition-all duration-300 font-semibold"
                    :class="selectedOptions[option.name] === value 
                      ? 'border-neutral-900 bg-neutral-900 text-white shadow-lg' 
                      : 'border-neutral-200 hover:border-neutral-900 text-neutral-700 hover:shadow-md'"
                  >
                    {{ value }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Stock et quantité -->
            <div class="mb-10">
              <div class="flex items-center justify-between mb-6">
                <span class="font-bold text-xl text-neutral-900">Quantité</span>
                <div class="flex items-center gap-5 bg-neutral-50 rounded-2xl p-2">
                  <button 
                    @click="decreaseQuantity"
                    :disabled="quantity <= 1"
                    class="w-12 h-12 rounded-xl bg-white border-2 border-neutral-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-neutral-900 hover:shadow-md transition-all duration-300"
                  >
                    <span class="text-xl font-bold">-</span>
                  </button>
                  <span class="w-16 text-center text-2xl font-bold">{{ quantity }}</span>
                  <button 
                    @click="increaseQuantity"
                    :disabled="quantity >= product.stock"
                    class="w-12 h-12 rounded-xl bg-white border-2 border-neutral-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-neutral-900 hover:shadow-md transition-all duration-300"
                  >
                    <span class="text-xl font-bold">+</span>
                  </button>
                </div>
              </div>

              <!-- Statut du stock -->
              <div class="mb-6">
                <span v-if="product.stock > 10" class="inline-flex items-center gap-2 text-green-600 font-bold text-lg bg-green-50 px-4 py-2 rounded-full">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                  En stock
                </span>
                <span v-else-if="product.stock > 0" class="inline-flex items-center gap-2 text-orange-600 font-bold text-lg bg-orange-50 px-4 py-2 rounded-full">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                  </svg>
                  Plus que {{ product.stock }} en stock !
                </span>
                <span v-else class="inline-flex items-center gap-2 text-red-600 font-bold text-lg bg-red-50 px-4 py-2 rounded-full">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                  </svg>
                  Rupture de stock
                </span>
              </div>
            </div>

            <!-- Boutons d'action -->
            <div class="flex gap-4 mb-10">
              <button 
                @click="addToCart"
                :disabled="product.stock === 0"
                class="flex-1 bg-neutral-900 text-white py-5 px-10 rounded-2xl font-bold hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center gap-3 text-lg disabled:hover:translate-y-0"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                Ajouter au panier
              </button>
              <button 
                class="px-8 py-5 border-2 border-neutral-200 rounded-2xl font-bold hover:border-neutral-900 hover:bg-neutral-50 transition-all duration-300 hover:shadow-lg group"
              >
                <span class="text-2xl group-hover:scale-110 inline-block transition-transform duration-300">♡</span>
              </button>
            </div>

            <!-- Livraison et retours -->
            <div class="p-6 bg-gradient-to-br from-neutral-50 to-neutral-100/50 rounded-2xl border border-neutral-100">
              <div class="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span class="text-neutral-700 font-semibold">Livraison gratuite</span>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                  </div>
                  <span class="text-neutral-700 font-semibold">Retours sous 30 jours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section des avis -->
      <ReviewSection :product-id="product.id" :reviews="product.reviews" />

      <!-- Produits recommandés -->
      <section class="mt-24">
        <h2 class="text-4xl md:text-5xl font-black text-neutral-900 mb-12 text-center tracking-tight">Produits similaires</h2>
        <div class="w-24 h-1.5 bg-neutral-900 mx-auto rounded-full mb-16"></div>
        <ProductGrid 
          :products="recommendedProducts"
          :loading="false"
        />
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './AppHeader.vue'
import ProductGrid from './ProductGrid.vue'
import ReviewSection from './ReviewSection.vue'
import { useCartStore } from './stores/cart' // N'oublie pas le store panier !

const route = useRoute()
const cartStore = useCartStore()

const product = ref(null)
const mainImage = ref('')
const selectedOptions = ref({})
const quantity = ref(1)
const loading = ref(true)
const error = ref(null)
const recommendedProducts = ref([])

// Récupérer l'ID depuis l'URL
const currentProductId = computed(() => route.params.id)

// --- Méthodes ---

const selectOption = (optionName, value) => {
  selectedOptions.value[optionName] = value
}

const increaseQuantity = () => {
  if (product.value && quantity.value < product.value.stock) {
    quantity.value++
  }
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const addToCart = () => {
  if (product.value && product.value.stock > 0) {
    cartStore.addToCart(product.value, quantity.value, selectedOptions.value)
    alert(`Produit ajouté au panier !`)
  }
}

// Fonction pour charger un produit spécifique
const fetchProduct = async (id) => {
  loading.value = true
  error.value = null
  try {
    const response = await fetch(`http://localhost:3000/api/products/${id}`)
    
    if (!response.ok) throw new Error('Produit introuvable')
    
    const data = await response.json()
    product.value = data
    
    // Initialisation de l'image principale
    // Note : Ton backend renvoie 'images' comme un tableau, on prend le premier
    if (data.images && data.images.length > 0) {
      mainImage.value = data.images[0]
    } else {
      mainImage.value = data.image // Fallback si pas de tableau
    }

    // Initialisation des options (si tu en ajoutes plus tard dans la BDD)
    if (data.options) {
      data.options.forEach(option => {
        selectedOptions.value[option.name] = option.values[0]
      })
    }
    
  } catch (err) {
    console.error("Erreur chargement produit:", err)
    error.value = "Impossible de charger le produit."
  } finally {
    loading.value = false
  }
}

// --- Lifecycle ---

onMounted(() => {
  fetchProduct(currentProductId.value)
})

// Important : Recharger si on change d'ID dans l'URL (ex: clic sur produit similaire)
watch(currentProductId, (newId) => {
  fetchProduct(newId)
  quantity.value = 1 // Remettre la quantité à 1
})
</script>