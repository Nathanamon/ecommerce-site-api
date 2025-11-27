<template>
  <div class="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden group flex flex-col h-full border border-neutral-100 hover:border-neutral-200">
    <div class="relative overflow-hidden h-64">
      <img 
        :src="product.image" 
        :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      <div v-if="product.discount" class="absolute top-4 left-4 bg-red-600 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
        -{{ product.discount }}%
      </div>
      <div class="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-500"></div>
    </div>

    <div class="p-6 flex flex-col flex-grow">
      <router-link 
        :to="'/product/' + product.id"
        class="font-bold text-xl mb-3 line-clamp-2 hover:text-neutral-600 transition-colors text-neutral-900"
      >
        {{ product.name }}
      </router-link>
      
      <div class="flex items-center mb-4">
        <div class="flex text-yellow-400 text-base">
          <span v-for="star in 5" :key="star">
            {{ star <= Math.round(product.rating || 0) ? '★' : '☆' }}
          </span>
        </div>
        <span class="text-sm text-neutral-500 ml-2">({{ product.reviewCount || 0 }})</span>
      </div>

      <div class="mt-auto flex items-center justify-between">
        <div class="flex items-baseline space-x-2">
          <span class="text-2xl font-black text-neutral-900">{{ product.price }}€</span>
          <span v-if="product.originalPrice" class="text-sm text-neutral-500 line-through">
            {{ product.originalPrice }}€
          </span>
        </div>
        
        <button 
          @click.prevent="addToCart"
          class="bg-neutral-900 text-white p-3 rounded-xl hover:bg-neutral-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
          :disabled="product.stock === 0"
          :class="product.stock === 0 ? 'bg-neutral-400 cursor-not-allowed hover:scale-100' : ''"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
        </button>
      </div>

      <p v-if="product.stock > 0 && product.stock < 5" class="text-xs text-red-600 mt-3 font-semibold">
        ⚠ Plus que {{ product.stock }} en stock
      </p>
      <p v-if="product.stock === 0" class="text-xs text-neutral-500 mt-3 italic">
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