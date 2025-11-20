<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Titre de la section -->
    <h2 v-if="title" class="text-3xl font-bold text-gray-900 mb-8">{{ title }}</h2>
    
    <!-- Grille de produits -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      <ProductCard 
        v-for="product in products" 
        :key="product.id" 
        :product="product"
        class="flex"
      />
    </div>

    <!-- État de chargement -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Chargement des produits...</p>
    </div>

    <!-- Message si aucun produit -->
    <div v-if="!loading && products.length === 0" class="text-center py-12">
      <p class="text-gray-600 text-lg">Aucun produit trouvé.</p>
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