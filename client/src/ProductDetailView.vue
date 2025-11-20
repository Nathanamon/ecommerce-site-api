<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    
    <main v-if="product" class="container mx-auto px-4 py-8">
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
            <div class="mb-6" v-if="product.options">
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

    <!-- État de chargement -->
    <div v-else class="container mx-auto px-4 py-8">
      <div class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Chargement du produit...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './AppHeader.vue'
import ProductGrid from './ProductGrid.vue'
import ReviewSection from './ReviewSection.vue'

const route = useRoute()
const product = ref(null)
const mainImage = ref('')
const selectedOptions = ref({})
const quantity = ref(1)
const loading = ref(true)

// DONNÉES MOCKÉES COMPLÈTES - Ajoute tous tes produits ici
const productData = {
  1: {
    id: 1,
    name: 'Smartphone High-Tech 2024',
    price: 799,
    originalPrice: 899,
    discount: 11,
    rating: 4.5,
    reviewCount: 152,
    stock: 5,
    description: 'Découvrez le smartphone ultime avec un écran AMOLED 6.7 pouces, triple appareil photo 108MP et batterie longue durée. Parfait pour la productivité et le divertissement.',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600',
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600',
      'https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=600'
    ],
    options: [
      {
        name: 'Couleur',
        values: ['Noir', 'Blanc', 'Bleu', 'Violet']
      },
      {
        name: 'Stockage',
        values: ['128GB', '256GB', '512GB']
      }
    ],
    reviews: [
      { id: 1, user: 'Marie D.', rating: 5, comment: 'Excellent produit, je recommande !', date: '2024-01-15' },
      { id: 2, user: 'Pierre L.', rating: 4, comment: 'Très bon rapport qualité-prix.', date: '2024-01-10' }
    ]
  },
  2: {
    id: 2,
    name: 'Casque Audio Sans Fil',
    price: 199,
    rating: 4.2,
    reviewCount: 89,
    stock: 15,
    description: 'Casque audio sans fil avec réduction de bruit active, autonomie de 30 heures et qualité sonore exceptionnelle.',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600'
    ],
    options: [
      {
        name: 'Couleur',
        values: ['Noir', 'Blanc', 'Bleu']
      }
    ],
    reviews: [
      { id: 1, user: 'Sophie M.', rating: 4, comment: 'Très bon casque, confortable et bon son.', date: '2024-01-12' }
    ]
  },
  3: {
    id: 3,
    name: 'Montre Connectée Sport',
    price: 299,
    originalPrice: 349,
    discount: 14,
    rating: 4.8,
    reviewCount: 203,
    stock: 25,
    description: 'Montre connectée sport avec GPS intégré, monitoring cardiaque et autonomie de 7 jours. Parfaite pour les sportifs.',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
      'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=600'
    ],
    options: [
      {
        name: 'Taille',
        values: ['38mm', '42mm', '46mm']
      },
      {
        name: 'Couleur',
        values: ['Noir', 'Argent', 'Or Rose']
      }
    ],
    reviews: [
      { id: 1, user: 'Thomas R.', rating: 5, comment: 'Parfaite pour le running !', date: '2024-01-14' }
    ]
  },
  4: {
    id: 4,
    name: 'Laptop Ultra Mince',
    price: 1299,
    rating: 4.1,
    reviewCount: 67,
    stock: 8,
    description: 'Laptop ultra performant avec processeur dernière génération, 16GB RAM et SSD 512GB. Idéal pour le travail et les loisirs.',
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600',
      'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=600'
    ],
    options: [
      {
        name: 'Configuration',
        values: ['8GB/256GB', '16GB/512GB', '32GB/1TB']
      }
    ],
    reviews: []
  },
  5: {
    id: 5,
    name: 'Enceinte Bluetooth',
    price: 149,
    rating: 4.3,
    reviewCount: 134,
    stock: 0,
    description: 'Enceinte Bluetooth portable avec son stéréo puissant, résistante à leau et autonomie de 20 heures.',
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600'
    ],
    options: [],
    reviews: [
      { id: 1, user: 'Laura P.', rating: 4, comment: 'Son puissant et bonne autonomie.', date: '2024-01-08' }
    ]
  }
  // Ajoute les autres produits (6, 7, 8, etc.) de la même manière...
}

// Produits recommandés mockés
const recommendedProducts = ref([
  {
    id: 2, name: 'Casque Audio Sans Fil', price: 199, 
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', reviewCount: 89, stock: 15, rating: 4.2
  },
  {
    id: 3, name: 'Montre Connectée Sport', price: 299, originalPrice: 349, discount: 14,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', reviewCount: 203, stock: 25, rating: 4.8
  },
  {
    id: 6, name: 'Souris Gaming', price: 79, 
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400', reviewCount: 89, stock: 20, rating: 4.6
  }
])

// Computed
const currentProductId = computed(() => parseInt(route.params.id))

// Méthodes
const selectOption = (optionName, value) => {
  selectedOptions.value[optionName] = value
}

const increaseQuantity = () => {
  if (quantity.value < product.value.stock) {
    quantity.value++
  }
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const addToCart = () => {
  if (product.value.stock > 0) {
    const cartItem = {
      ...product.value,
      quantity: quantity.value,
      selectedOptions: { ...selectedOptions.value }
    }
    console.log('Ajout au panier:', cartItem)
    alert(`Produit ajouté au panier ! Quantité: ${quantity.value}`)
  }
}

// Lifecycle
onMounted(() => {
  // Simulation de chargement asynchrone
  setTimeout(() => {
    product.value = productData[currentProductId.value]
    if (product.value) {
      mainImage.value = product.value.images[0]
      // Sélectionner les premières options par défaut
      if (product.value.options) {
        product.value.options.forEach(option => {
          selectedOptions.value[option.name] = option.values[0]
        })
      }
    }
    loading.value = false // ← Arrête le loading
  }, 500)
})
</script>