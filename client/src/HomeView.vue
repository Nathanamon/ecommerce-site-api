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
          <router-link 
            to="/products" 
            class="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            Découvrir nos produits
          </router-link>
        </div>
      </section>

      <!-- Produits populaires -->
      <ProductGrid 
        :products="featuredProducts"
        title="Produits Populaires"
        :loading="false"
      />

      <!-- Section de recommandations IA -->
      <ProductGrid 
        :products="recommendedProducts"
        title="Recommandés pour vous"
        :loading="false"
      />
    </main>
  </div>
</template>

<script setup>
import AppHeader from './AppHeader.vue'
import ProductGrid from './ProductGrid.vue'
import { ref, onMounted } from 'vue'

// Données mockées pour l'instant - seront remplacées par un appel API
const featuredProducts = ref([])
const recommendedProducts = ref([])

// Simulation de chargement asynchrone
onMounted(async () => {
  // Simule un appel API
  await new Promise(resolve => setTimeout(resolve, 300))
  
  featuredProducts.value = [
    {
      id: 1,
      name: 'Smartphone High-Tech 2024',
      price: 799,
      originalPrice: 899,
      discount: 11,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
      reviewCount: 152,
      stock: 5,
      rating: 4.5
    },
    {
      id: 2,
      name: 'Casque Audio Sans Fil',
      price: 199,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      reviewCount: 89,
      stock: 15,
      rating: 4.2
    },
    {
      id: 3,
      name: 'Montre Connectée Sport',
      price: 299,
      originalPrice: 349,
      discount: 14,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      reviewCount: 203,
      stock: 25,
      rating: 4.8
    },
    {
      id: 4,
      name: 'Laptop Ultra Mince',
      price: 1299,
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
      reviewCount: 67,
      stock: 8,
      rating: 4.1
    },
    {
      id: 5,
      name: 'Enceinte Bluetooth',
      price: 149,
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
      reviewCount: 134,
      stock: 0,
      rating: 4.3
    }
  ]

  // Produits recommandés mockés (simulation IA)
  recommendedProducts.value = [
    {
      id: 6,
      name: 'Souris Gaming RGB',
      price: 89,
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
      reviewCount: 234,
      stock: 20,
      rating: 4.6
    },
    {
      id: 7,
      name: 'Clavier Mécanique Rétroéclairé',
      price: 149,
      originalPrice: 179,
      discount: 17,
      image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400',
      reviewCount: 189,
      stock: 12,
      rating: 4.4
    },
    {
      id: 8,
      name: 'Webcam 4K avec Micro',
      price: 129,
      image: 'https://images.unsplash.com/photo-1558089684-f07c6d95f7c6?w=400',
      reviewCount: 76,
      stock: 30,
      rating: 4.7
    },
    {
      id: 9,
      name: 'Tablette Graphique Professionnelle',
      price: 349,
      image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400',
      reviewCount: 45,
      stock: 7,
      rating: 4.9
    },
    {
      id: 10,
      name: 'Disque Dur SSD 1TB',
      price: 119,
      image: 'https://images.unsplash.com/photo-1597852074816-d933c7d2b988?w=400',
      reviewCount: 312,
      stock: 45,
      rating: 4.5
    }
  ]
})
</script>