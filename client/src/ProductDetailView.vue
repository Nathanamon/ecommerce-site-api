<template>
  <div class="min-h-screen bg-white">
    <AppHeader />
    
    <!-- État de chargement -->
    <div v-if="loading" class="container mx-auto px-6 py-16">
      <div class="text-center py-20">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-neutral-900 mx-auto"></div>
        <p class="mt-6 text-neutral-600 text-lg">Chargement du produit...</p>
      </div>
    </div>

    <!-- Produit non trouvé -->
    <div v-else-if="!product" class="container mx-auto px-6 py-16">
      <div class="text-center py-20">
        <h2 class="text-3xl font-black text-neutral-900 mb-6">Produit non trouvé</h2>
        <p class="text-neutral-600 mb-8 text-lg">Le produit que vous recherchez n'existe pas.</p>
        <router-link 
          to="/products" 
          class="bg-neutral-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-neutral-800 transition-all duration-300 shadow-lg"
        >
          Voir tous les produits
        </router-link>
      </div>
    </div>

    <!-- Produit trouvé -->
    <main v-else class="container mx-auto px-6 py-12">
      <!-- Fil d'Ariane -->
      <nav class="flex items-center space-x-3 text-sm text-neutral-600 mb-8 font-medium">
        <router-link to="/" class="hover:text-neutral-900 transition-colors">Accueil</router-link>
        <span class="text-neutral-400">›</span>
        <router-link to="/products" class="hover:text-neutral-900 transition-colors">Produits</router-link>
        <span class="text-neutral-400">›</span>
        <span class="text-neutral-900 font-semibold">{{ product.name }}</span>
      </nav>

      <div class="bg-white rounded-3xl shadow-xl overflow-hidden border border-neutral-100">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 p-12">
          <!-- Galerie d'images -->
          <div>
            <div class="relative rounded-2xl overflow-hidden mb-6 bg-neutral-50">
              <img 
                :src="mainImage" 
                :alt="product.name"
                class="w-full h-[500px] object-cover"
              />
              <!-- Badge promotion -->
              <div v-if="product.discount" class="absolute top-6 left-6 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl">
                -{{ product.discount }}%
              </div>
            </div>
            
            <!-- Miniatures -->
            <div class="flex space-x-3 overflow-x-auto pb-2">
              <button 
                v-for="(image, index) in product.images" 
                :key="index"
                @click="mainImage = image"
                class="flex-shrink-0 w-20 h-20 border-2 rounded-xl overflow-hidden transition-all duration-300"
                :class="mainImage === image ? 'border-neutral-900 shadow-md' : 'border-neutral-200 hover:border-neutral-400'"
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
          <div class="flex flex-col justify-center">
            <h1 class="text-4xl font-black text-neutral-900 mb-6 leading-tight">{{ product.name }}</h1>
            
            <!-- Avis et note -->
            <div class="flex items-center mb-6">
              <div class="flex items-center">
                <div class="flex text-yellow-400 text-xl">
                  <span v-for="star in 5" :key="star">
                    {{ star <= Math.round(product.rating) ? '★' : '☆' }}
                  </span>
                </div>
                <span class="ml-3 text-neutral-600 font-medium">{{ product.rating }}/5 ({{ product.reviewCount }} avis)</span>
              </div>
            </div>

            <!-- Prix -->
            <div class="mb-8">
              <div class="flex items-baseline space-x-4">
                <span class="text-4xl font-black text-neutral-900">{{ product.price }}€</span>
                <span v-if="product.originalPrice" class="text-2xl text-neutral-500 line-through">
                  {{ product.originalPrice }}€
                </span>
                <span v-if="product.discount" class="text-green-600 font-bold text-lg">
                  Économisez {{ product.originalPrice - product.price }}€ !
                </span>
              </div>
            </div>

            <!-- Description -->
            <div class="mb-8">
              <h3 class="font-bold text-xl mb-4 text-neutral-900">Description</h3>
              <p class="text-neutral-700 leading-relaxed text-lg">{{ product.description }}</p>
            </div>

            <!-- Options (couleur, taille, etc.) -->
            <div class="mb-8" v-if="product.options && product.options.length > 0">
              <div v-for="option in product.options" :key="option.name" class="mb-6">
                <h4 class="font-bold text-lg mb-3 text-neutral-900">{{ option.name }}</h4>
                <div class="flex flex-wrap gap-3">
                  <button 
                    v-for="value in option.values" 
                    :key="value"
                    @click="selectOption(option.name, value)"
                    class="px-5 py-3 border-2 rounded-xl transition-all duration-300 font-medium"
                    :class="selectedOptions[option.name] === value 
                      ? 'border-neutral-900 bg-neutral-900 text-white' 
                      : 'border-neutral-300 hover:border-neutral-900 text-neutral-700'"
                  >
                    {{ value }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Stock et quantité -->
            <div class="mb-8">
              <div class="flex items-center justify-between mb-6">
                <span class="font-bold text-lg text-neutral-900">Quantité</span>
                <div class="flex items-center space-x-4">
                  <button 
                    @click="decreaseQuantity"
                    :disabled="quantity <= 1"
                    class="w-10 h-10 rounded-xl border-2 border-neutral-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-neutral-900 transition-colors"
                  >
                    <span class="text-lg font-bold">-</span>
                  </button>
                  <span class="w-12 text-center text-xl font-bold">{{ quantity }}</span>
                  <button 
                    @click="increaseQuantity"
                    :disabled="quantity >= product.stock"
                    class="w-10 h-10 rounded-xl border-2 border-neutral-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-neutral-900 transition-colors"
                  >
                    <span class="text-lg font-bold">+</span>
                  </button>
                </div>
              </div>

              <!-- Statut du stock -->
              <div class="mb-6">
                <span v-if="product.stock > 10" class="text-green-600 font-bold text-lg">✓ En stock</span>
                <span v-else-if="product.stock > 0" class="text-orange-600 font-bold text-lg">
                  ⚠ Plus que {{ product.stock }} en stock !
                </span>
                <span v-else class="text-red-600 font-bold text-lg">✗ Rupture de stock</span>
              </div>
            </div>

            <!-- Boutons d'action -->
            <div class="flex space-x-4">
              <button 
                @click="addToCart"
                :disabled="product.stock === 0"
                class="flex-1 bg-neutral-900 text-white py-4 px-8 rounded-xl font-bold hover:bg-neutral-800 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
              >
                <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Ajouter au panier
              </button>
              <button 
                class="px-8 py-4 border-2 border-neutral-300 rounded-xl font-bold hover:border-neutral-900 hover:bg-neutral-50 transition-all duration-300"
              >
                <span class="text-xl">❤</span>
              </button>
            </div>

            <!-- Livraison et retours -->
            <div class="mt-8 p-6 bg-neutral-50 rounded-2xl">
              <div class="flex items-center justify-center space-x-8 text-sm text-neutral-600 font-medium">
                <div class="flex items-center">
                  <svg class="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Livraison gratuite
                </div>
                <div class="flex items-center">
                  <svg class="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <section class="mt-16">
        <h2 class="text-3xl font-black text-neutral-900 mb-8">Produits similaires</h2>
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