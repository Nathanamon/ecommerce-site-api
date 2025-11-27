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
        :title="weatherMessage || 'Recommandés pour vous'"
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
const weatherMessage = ref('')

// Simulation de chargement asynchrone
onMounted(async () => {
  try {
    // A. Chargement des produits classiques (Populaires)
    const resProducts = await fetch('http://localhost:3000/api/products');
    const allProducts = await resProducts.json();
    featuredProducts.value = allProducts.slice(0, 4);

    // B. Recommandation IA / Météo (API Externe)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            // Appel à TON API qui va parler à OpenWeather
            const resWeather = await fetch(`http://localhost:3000/api/recommendations/weather?lat=${latitude}&lon=${longitude}`);
            const data = await resWeather.json();
            
            if (data.products && data.products.length > 0) {
              recommendedProducts.value = data.products;
              weatherMessage.value = data.message; // Le message dynamique !
            } else {
              // Fallback si pas de produits trouvés
              recommendedProducts.value = allProducts.slice(4, 8);
              weatherMessage.value = "Recommandés pour vous";
            }
          } catch (e) {
            console.error("Erreur API Météo", e);
            recommendedProducts.value = allProducts.slice(4, 8); // Fallback
          }
        },
        (error) => {
          console.log("Géolocalisation refusée, affichage par défaut.");
          recommendedProducts.value = allProducts.slice(4, 8);
          weatherMessage.value = "Recommandés pour vous";
        }
      );
    } else {
      recommendedProducts.value = allProducts.slice(4, 8);
    }

  } catch (error) {
    console.error("Erreur globale Home:", error);
  } finally {
    loading.value = false;
  }
});
</script>