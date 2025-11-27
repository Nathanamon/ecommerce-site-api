<template>
  <div class="container mx-auto px-6 py-16">
    <!-- Titre de la section -->
    <h2 v-if="title" class="text-4xl font-black text-neutral-900 mb-12 text-center">{{ title }}</h2>
    
    <!-- Grille de produits -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-8">
      <ProductCard 
        v-for="product in products" 
        :key="product.id" 
        :product="product"
        class="flex"
      />
    </div>

    <!-- État de chargement -->
    <div v-if="loading" class="text-center py-20">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-neutral-900 mx-auto"></div>
      <p class="mt-6 text-neutral-600 text-lg">Chargement des produits...</p>
    </div>

    <!-- Message si aucun produit -->
    <div v-if="!loading && products.length === 0" class="text-center py-20">
      <p class="text-neutral-600 text-xl">Aucun produit trouvé.</p>
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