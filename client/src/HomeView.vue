<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    
    <main>
      <!-- Bannière Hero -->
      <section class="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-20">
        <div class="container mx-auto px-4 text-center">
          <h1 class="text-5xl font-bold mb-6">Bienvenue chez EcoMarket</h1>
          <p class="text-xl mb-8 max-w-2xl mx-auto">
            Découvrez notre sélection exclusive de produits soigneusement choisis pour vous.
          </p>
          <router-link to="/products" class="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors">
            Découvrir nos produits
          </router-link>
        </div>
      </section>

      <!-- Produits populaires -->
      <ProductGrid 
        :products="featuredProducts"
        title="Produits Populaires"
      />

      <!-- Section de recommandations (à implémenter plus tard) -->
      <section class="container mx-auto px-4 py-12">
        <h2 class="text-3xl font-bold text-gray-900 mb-8">Recommandés pour vous</h2>
        <div class="bg-gray-100 rounded-lg p-12 text-center">
          <p class="text-gray-600">Section des recommandations IA à venir...</p>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import AppHeader from './AppHeader.vue'
import ProductGrid from './ProductGrid.vue'
import { ref } from 'vue'

// Données mockées pour l'instant - seront remplacées par un appel API
const featuredProducts = ref([
  {
    id: 1,
    name: 'Smartphone High-Tech 2024',
    price: 799,
    originalPrice: 899,
    discount: 11,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
    reviewCount: 152,
    stock: 5
  },
  {
    id: 2,
    name: 'Casque Audio Sans Fil',
    price: 199,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    reviewCount: 89,
    stock: 15
  },
  {
    id: 3,
    name: 'Montre Connectée Sport',
    price: 299,
    originalPrice: 349,
    discount: 14,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    reviewCount: 203,
    stock: 25
  },
  {
    id: 4,
    name: 'Laptop Ultra Mince',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
    reviewCount: 67,
    stock: 8
  },
  {
    id: 5,
    name: 'Enceinte Bluetooth',
    price: 149,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
    reviewCount: 134,
    stock: 0
  }
])
</script>