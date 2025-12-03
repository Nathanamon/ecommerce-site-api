<template>
  <div class="min-h-screen bg-gradient-to-b from-white to-neutral-50">
    <AppHeader />
    
    <main>
      <!-- Bannière Hero -->
      <section class="relative overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white">
        <!-- Effets de fond animés -->
        <div class="absolute inset-0 opacity-20">
          <div class="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style="animation-delay: 1s"></div>
        </div>
        
        <div class="container mx-auto px-8 py-32 relative z-10">
          <div class="max-w-4xl mx-auto text-center">
            <h1 class="text-7xl md:text-8xl font-black mb-8 tracking-tighter bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent animate-fade-in">
              EcoMarket
            </h1>
            <p class="text-xl md:text-2xl mb-12 max-w-2xl mx-auto text-neutral-300 leading-relaxed font-light">
              L'excellence réinventée. Découvrez notre sélection exclusive de produits soigneusement choisis pour vous.
            </p>
            <router-link 
              to="/products" 
              class="inline-flex items-center gap-3 bg-white text-neutral-900 px-10 py-5 rounded-full font-bold text-lg hover:bg-neutral-100 transition-all duration-500 shadow-2xl hover:shadow-white/20 hover:scale-105 group"
            >
              <span>Découvrir la collection</span>
              <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </router-link>
          </div>
        </div>

        <!-- Vague décorative -->
        <div class="absolute bottom-0 left-0 right-0">
          <svg class="w-full h-24 fill-white" viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      <!-- Produits populaires -->
      <section class="py-24">
        <ProductGrid 
          :products="featuredProducts"
          title="Produits Populaires"
          :loading="false"
        />
      </section>

      <!-- Section de recommandations IA -->
      <section class="py-24 bg-white">
        <ProductGrid 
          :products="recommendedProducts"
          :title="weatherMessage || 'Recommandés pour vous'"
          :loading="false"
        />
      </section>

      <!-- Section valeurs / confiance -->
      <section class="py-24 bg-gradient-to-br from-neutral-50 to-white">
        <div class="container mx-auto px-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <!-- Livraison -->
            <div class="bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-500 border border-neutral-100 hover:-translate-y-2 group">
              <div class="w-16 h-16 bg-neutral-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                </svg>
              </div>
              <h3 class="text-2xl font-black text-neutral-900 mb-3">Livraison Gratuite</h3>
              <p class="text-neutral-600 leading-relaxed">Sur toutes vos commandes, sans minimum d'achat</p>
            </div>

            <!-- Paiement sécurisé -->
            <div class="bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-500 border border-neutral-100 hover:-translate-y-2 group">
              <div class="w-16 h-16 bg-neutral-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <h3 class="text-2xl font-black text-neutral-900 mb-3">Paiement Sécurisé</h3>
              <p class="text-neutral-600 leading-relaxed">Vos transactions sont 100% protégées</p>
            </div>

            <!-- SAV -->
            <div class="bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-500 border border-neutral-100 hover:-translate-y-2 group">
              <div class="w-16 h-16 bg-neutral-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                </svg>
              </div>
              <h3 class="text-2xl font-black text-neutral-900 mb-3">Support 24/7</h3>
              <p class="text-neutral-600 leading-relaxed">Notre équipe à votre écoute en permanence</p>
            </div>
          </div>
        </div>
      </section>
      
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
const loading = ref(true)

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


<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 1s ease-out;
}
</style>