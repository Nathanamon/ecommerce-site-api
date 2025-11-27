<template>
  <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group flex flex-col h-full">
    <div class="relative overflow-hidden h-48">
      <img 
        :src="product.image" 
        :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div v-if="product.discount" class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
        -{{ product.discount }}%
      </div>
    </div>

    <div class="p-4 flex flex-col flex-grow">
      <router-link 
        :to="'/product/' + product.id"
        class="font-semibold text-lg mb-2 line-clamp-2 hover:text-indigo-600 transition-colors"
      >
        {{ product.name }}
      </router-link>
      
      <div class="flex items-center mb-2">
        <div class="flex text-yellow-400 text-sm">
          <span v-for="star in 5" :key="star">
            {{ star <= Math.round(product.rating || 0) ? '★' : '☆' }}
          </span>
        </div>
        <span class="text-xs text-gray-500 ml-1">({{ product.reviewCount || 0 }} avis)</span>
      </div>

      <div class="mt-auto flex items-center justify-between">
        <div>
          <span class="text-xl font-bold text-gray-900">{{ product.price }}€</span>
          <span v-if="product.originalPrice" class="text-xs text-gray-500 line-through ml-1">
            {{ product.originalPrice }}€
          </span>
        </div>
        
        <button 
          @click.prevent="addToCart"
          class="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors shadow-sm"
          :disabled="product.stock === 0"
          :class="product.stock === 0 ? 'bg-gray-400 cursor-not-allowed' : ''"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
        </button>
      </div>

      <p v-if="product.stock > 0 && product.stock < 5" class="text-xs text-red-600 mt-2 font-medium">
        Vite ! Plus que {{ product.stock }} en stock
      </p>
      <p v-if="product.stock === 0" class="text-xs text-gray-500 mt-2 italic">
        Rupture de stock
      </p>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { useCartStore } from './stores/cart'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const cartStore = useCartStore()

const addToCart = () => {
  if (props.product.stock > 0) {
    cartStore.addToCart(props.product, 1)
    // Optionnel : Petit feedback visuel ou toast
    alert("Ajouté au panier !")
  }
}
</script>