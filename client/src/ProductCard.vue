<template>
  <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
    <!-- Image du produit -->
    <div class="relative overflow-hidden">
      <img 
        :src="product.image" 
        :alt="product.name"
        class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <!-- Badge de promotion (optionnel) -->
      <div v-if="product.discount" class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
        -{{ product.discount }}%
      </div>
    </div>

    <!-- Informations du produit -->
    <div class="p-4">
      <router-link 
        :to="'/product/' + product.id"
        class="font-semibold text-lg mb-2 line-clamp-2 hover:text-indigo-600 transition-colors"
      >
        {{ product.name }}
      </router-link>
      
      <!-- Avis -->
      <div class="flex items-center mb-2">
        <div class="flex text-yellow-400">
          <span v-for="star in 5" :key="star">
            ★
          </span>
        </div>
        <span class="text-sm text-gray-600 ml-1">({{ product.reviewCount }})</span>
      </div>

      <!-- Prix -->
      <div class="flex items-center justify-between">
        <div>
          <span class="text-2xl font-bold text-gray-900">{{ product.price }}€</span>
          <span v-if="product.originalPrice" class="text-sm text-gray-500 line-through ml-2">
            {{ product.originalPrice }}€
          </span>
        </div>
        <button 
          @click="addToCart"
          class="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
        </button>
      </div>

      <!-- Stock -->
      <p v-if="product.stock < 10" class="text-xs text-red-600 mt-2">
        Plus que {{ product.stock }} en stock !
      </p>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

// Définition des props avec des valeurs par défaut
const props = defineProps({
  product: {
    type: Object,
    required: true,
    default: () => ({
      id: 1,
      name: 'Nom du produit',
      price: 0,
      image: 'https://via.placeholder.com/300',
      reviewCount: 0,
      stock: 0
    })
  }
})

// Fonction pour ajouter au panier (à implémenter plus tard)
const addToCart = () => {
  console.log('Ajouter au panier:', props.product.name)
  // Émettre un événement ou appeler une store
}
</script>