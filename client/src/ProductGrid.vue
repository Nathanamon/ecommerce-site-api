<template>
  <div class="container mx-auto px-8 py-20">
    <!-- Titre de la section -->
    <div v-if="title" class="text-center mb-16">
      <h2 class="text-5xl md:text-6xl font-black text-neutral-900 mb-4 tracking-tighter">
        {{ title }}
      </h2>
      <div class="w-24 h-1.5 bg-neutral-900 mx-auto rounded-full"></div>
    </div>
    
    <!-- Grille de produits -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      <ProductCard 
        v-for="product in products" 
        :key="product.id" 
        :product="product"
        class="flex"
      />
    </div>

    <!-- État de chargement -->
    <div v-if="loading" class="text-center py-32">
      <div class="relative inline-flex items-center justify-center">
        <div class="animate-spin rounded-full h-20 w-20 border-4 border-neutral-200 border-t-neutral-900"></div>
        <div class="absolute animate-ping rounded-full h-16 w-16 border-2 border-neutral-300 opacity-20"></div>
      </div>
      <p class="mt-8 text-neutral-600 text-lg font-medium">Chargement des produits...</p>
    </div>

    <!-- Message si aucun produit -->
    <div v-if="!loading && products.length === 0" class="text-center py-32">
      <div class="max-w-md mx-auto">
        <div class="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
          </svg>
        </div>
        <p class="text-neutral-600 text-2xl font-bold mb-2">Aucun produit trouvé</p>
        <p class="text-neutral-500">Essayez de modifier vos critères de recherche</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import ProductCard from './ProductCard.vue'

defineProps({
  products: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>