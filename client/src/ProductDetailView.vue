<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    
    <!-- État de chargement -->
    <div v-if="loading" class="container mx-auto px-4 py-8">
      <div class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Chargement du produit...</p>
      </div>
    </div>

    <!-- Produit non trouvé -->
    <div v-else-if="!product" class="container mx-auto px-4 py-8">
      <div class="text-center py-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Produit non trouvé</h2>
        <p class="text-gray-600 mb-6">Le produit que vous recherchez n'existe pas.</p>
        <router-link 
          to="/products" 
          class="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
        >
          Voir tous les produits
        </router-link>
      </div>
    </div>

    <!-- Produit trouvé -->
    <main v-else class="container mx-auto px-4 py-8">
      <!-- Fil d'Ariane -->
      <nav class="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <router-link to="/" class="hover:text-indigo-600">Accueil</router-link>
        <span>></span>
        <router-link to="/products" class="hover:text-indigo-600">Produits</router-link>
        <span>></span>
        <span class="text-gray-900">{{ product.name }}</span>
      </nav>

      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          <!-- Galerie d'images -->
          <div>
            <div class="relative rounded-lg overflow-hidden mb-4">
              <img 
                :src="mainImage" 
                :alt="product.name"
                class="w-full h-96 object-cover"
              />
              <!-- Badge promotion -->
              <div v-if="product.discount" class="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                -{{ product.discount }}%
              </div>
            </div>
            
            <!-- Miniatures -->
            <div class="flex space-x-2 overflow-x-auto">
              <button 
                v-for="(image, index) in product.images" 
                :key="index"
                @click="mainImage = image"
                class="flex-shrink-0 w-20 h-20 border-2 rounded-lg overflow-hidden"
                :class="mainImage === image ? 'border-indigo-600' : 'border-gray-300'"
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
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ product.name }}</h1>
            
            <!-- Avis et note -->
            <div class="flex items-center mb-4">
              <div class="flex items-center">
                <div class="flex text-yellow-400 text-lg">
                  <span v-for="star in 5" :key="star">
                    {{ star <= Math.round(product.rating) ? '★' : '☆' }}
                  </span>
                </div>
                <span class="ml-2 text-gray-600">{{ product.rating }}/5 ({{ product.reviewCount }} avis)</span>
              </div>
            </div>

            <!-- Prix -->
            <div class="mb-6">
              <div class="flex items-baseline space-x-2">
                <span class="text-3xl font-bold text-gray-900">{{ product.price }}€</span>
                <span v-if="product.originalPrice" class="text-xl text-gray-500 line-through">
                  {{ product.originalPrice }}€
                </span>
                <span v-if="product.discount" class="text-green-600 font-semibold">
                  Économisez {{ product.originalPrice - product.price }}€ !
                </span>
              </div>
            </div>

            <!-- Description -->
            <div class="mb-6">
              <h3 class="font-semibold text-lg mb-2">Description</h3>
              <p class="text-gray-700 leading-relaxed">{{ product.description }}</p>
            </div>

            <!-- Options (couleur, taille, etc.) -->
            <div class="mb-6" v-if="product.options && product.options.length > 0">
              <div v-for="option in product.options" :key="option.name" class="mb-4">
                <h4 class="font-medium mb-2">{{ option.name }}</h4>
                <div class="flex flex-wrap gap-2">
                  <button 
                    v-for="value in option.values" 
                    :key="value"
                    @click="selectOption(option.name, value)"
                    class="px-4 py-2 border rounded-lg transition-colors"
                    :class="selectedOptions[option.name] === value 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                      : 'border-gray-300 hover:border-gray-400'"
                  >
                    {{ value }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Stock et quantité -->
            <div class="mb-6">
              <div class="flex items-center justify-between mb-4">
                <span class="font-medium">Quantité</span>
                <div class="flex items-center space-x-3">
                  <button 
                    @click="decreaseQuantity"
                    :disabled="quantity <= 1"
                    class="w-8 h-8 rounded-full border flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    -
                  </button>
                  <span class="w-8 text-center">{{ quantity }}</span>
                  <button 
                    @click="increaseQuantity"
                    :disabled="quantity >= product.stock"
                    class="w-8 h-8 rounded-full border flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
              </div>

              <!-- Statut du stock -->
              <div class="mb-4">
                <span v-if="product.stock > 10" class="text-green-600 font-medium">✓ En stock</span>
                <span v-else-if="product.stock > 0" class="text-orange-600 font-medium">
                  ⚠ Plus que {{ product.stock }} en stock !
                </span>
                <span v-else class="text-red-600 font-medium">✗ Rupture de stock</span>
              </div>
            </div>

            <!-- Boutons d'action -->
            <div class="flex space-x-4">
              <button 
                @click="addToCart"
                :disabled="product.stock === 0"
                class="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Ajouter au panier
              </button>
              <button 
                class="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                ♡
              </button>
            </div>

            <!-- Livraison et retours -->
            <div class="mt-6 p-4 bg-gray-50 rounded-lg">
              <div class="flex items-center space-x-4 text-sm text-gray-600">
                <div class="flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Livraison gratuite
                </div>
                <div class="flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Retours sous 30 jours
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section des avis -->
      <ReviewSection :product-id="product.id" :reviews="product.reviews" />

      <!-- Produits recommandés -->
      <section class="mt-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Produits similaires</h2>
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