<template>
  <div class="min-h-screen bg-gradient-to-b from-white to-neutral-50">
    <AppHeader />

    <main class="container mx-auto px-8 py-16">
      <!-- En-tête -->
      <div class="mb-12">
        <h1 class="text-5xl md:text-6xl font-black text-neutral-900 mb-4 tracking-tighter">Mon Panier</h1>
        <p class="text-neutral-600 text-lg">{{ cartStore.itemCount }} article{{ cartStore.itemCount > 1 ? 's' : '' }} dans votre panier</p>
      </div>

      <!-- Panier vide -->
      <div v-if="cartStore.itemCount === 0" class="text-center py-20">
        <div class="w-32 h-32 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg class="w-16 h-16 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
          </svg>
        </div>
        <h2 class="text-3xl font-black text-neutral-900 mb-4">Votre panier est vide</h2>
        <p class="text-neutral-600 mb-8 text-lg">Découvrez nos produits et ajoutez-les à votre panier</p>
        <router-link
          to="/products"
          class="inline-flex items-center gap-3 bg-neutral-900 text-white px-10 py-4 rounded-full font-bold hover:bg-neutral-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
        >
          <span>Continuer mes achats</span>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
          </svg>
        </router-link>
      </div>

      <!-- Panier avec articles -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Liste des articles -->
        <div class="lg:col-span-2 space-y-6">
          <div
            v-for="item in cartStore.items"
            :key="item.id"
            class="bg-white rounded-3xl shadow-lg p-6 border border-neutral-100 hover:shadow-xl transition-all duration-300"
          >
            <div class="flex gap-6">
              <!-- Image produit -->
              <router-link :to="'/product/' + item.product.id" class="flex-shrink-0">
                <img
                  :src="item.product.image"
                  :alt="item.product.name"
                  class="w-32 h-32 object-cover rounded-2xl hover:scale-105 transition-transform duration-300"
                />
              </router-link>

              <!-- Infos produit -->
              <div class="flex-1">
                <router-link
                  :to="'/product/' + item.product.id"
                  class="font-bold text-xl text-neutral-900 hover:text-neutral-600 transition-colors mb-2 block"
                >
                  {{ item.product.name }}
                </router-link>

                <!-- Options sélectionnées -->
                <div v-if="item.options && Object.keys(item.options).length > 0" class="flex flex-wrap gap-2 mb-3">
                  <span
                    v-for="(value, key) in item.options"
                    :key="key"
                    class="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {{ key }}: {{ value }}
                  </span>
                </div>

                <!-- Prix unitaire -->
                <p class="text-neutral-600 mb-4">
                  Prix unitaire: <span class="font-bold text-neutral-900">{{ item.product.price }}€</span>
                </p>

                <!-- Contrôles quantité -->
                <div class="flex items-center gap-4">
                  <div class="flex items-center gap-3 bg-neutral-50 rounded-2xl p-2">
                    <button
                      @click="cartStore.decreaseQuantity(item.id)"
                      class="w-10 h-10 rounded-xl bg-white border-2 border-neutral-200 flex items-center justify-center hover:border-neutral-900 hover:shadow-md transition-all duration-300"
                    >
                      <span class="text-xl font-bold">-</span>
                    </button>
                    <span class="w-12 text-center text-lg font-bold">{{ item.quantity }}</span>
                    <button
                      @click="cartStore.increaseQuantity(item.id)"
                      :disabled="item.quantity >= item.product.stock"
                      class="w-10 h-10 rounded-xl bg-white border-2 border-neutral-200 flex items-center justify-center hover:border-neutral-900 hover:shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span class="text-xl font-bold">+</span>
                    </button>
                  </div>

                  <!-- Bouton supprimer -->
                  <button
                    @click="cartStore.removeFromCart(item.id)"
                    class="ml-auto p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300"
                  >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Prix total de la ligne -->
              <div class="text-right">
                <p class="text-3xl font-black text-neutral-900">{{ (item.product.price * item.quantity).toFixed(2) }}€</p>
              </div>
            </div>
          </div>

          <!-- Bouton continuer shopping -->
          <router-link
            to="/products"
            class="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 font-semibold transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Continuer mes achats
          </router-link>
        </div>

        <!-- Résumé de commande -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-3xl shadow-2xl p-8 border border-neutral-100 sticky top-24">
            <h2 class="text-2xl font-black text-neutral-900 mb-6 tracking-tight">Résumé</h2>

            <div class="space-y-4 mb-6 pb-6 border-b border-neutral-100">
              <div class="flex justify-between text-neutral-600">
                <span class="font-medium">Sous-total</span>
                <span class="font-bold">{{ cartStore.subtotal.toFixed(2) }}€</span>
              </div>
              <div class="flex justify-between text-neutral-600">
                <span class="font-medium">Livraison</span>
                <span class="font-bold text-green-600">Gratuite</span>
              </div>
              <div class="flex justify-between text-neutral-600">
                <span class="font-medium">TVA (20%)</span>
                <span class="font-bold">{{ (cartStore.subtotal * 0.2).toFixed(2) }}€</span>
              </div>
            </div>

            <!-- Total -->
            <div class="flex justify-between items-center mb-8 pb-8 border-b border-neutral-100">
              <span class="text-xl font-bold text-neutral-900">Total</span>
              <span class="text-3xl font-black text-neutral-900">{{ cartStore.total.toFixed(2) }}€</span>
            </div>

            <!-- Code promo -->
            <div class="mb-6">
              <div class="flex gap-2">
                <input
                  v-model="promoCode"
                  type="text"
                  placeholder="Code promo"
                  class="flex-1 px-4 py-3 bg-neutral-50 border-2 border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-all duration-300 placeholder-neutral-400"
                />
                <button
                  class="px-6 py-3 bg-neutral-100 hover:bg-neutral-200 border-2 border-neutral-200 rounded-xl font-bold transition-all duration-300"
                >
                  Appliquer
                </button>
              </div>
            </div>

            <!-- Bouton commander -->
            <router-link
              to="/checkout"
              class="block w-full bg-neutral-900 text-white py-5 rounded-2xl font-bold hover:bg-neutral-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-center mb-4"
            >
              Commander
            </router-link>

            <!-- Paiement sécurisé -->
            <div class="flex items-center justify-center gap-3 text-sm text-neutral-500">
              <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="font-medium">Paiement 100% sécurisé</span>
            </div>

            <!-- Moyens de paiement -->
            <div class="mt-6 pt-6 border-t border-neutral-100">
              <p class="text-xs text-neutral-500 text-center mb-3">Moyens de paiement acceptés</p>
              <div class="flex justify-center items-center gap-3 flex-wrap">
                <div class="w-12 h-8 bg-neutral-100 rounded flex items-center justify-center">
                  <span class="text-xs font-bold text-neutral-600">VISA</span>
                </div>
                <div class="w-12 h-8 bg-neutral-100 rounded flex items-center justify-center">
                  <span class="text-xs font-bold text-neutral-600">MC</span>
                </div>
                <div class="w-12 h-8 bg-neutral-100 rounded flex items-center justify-center">
                  <span class="text-xs font-bold text-neutral-600">AMEX</span>
                </div>
                <div class="w-12 h-8 bg-neutral-100 rounded flex items-center justify-center">
                  <span class="text-xs font-bold text-neutral-600">PP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section recommandations -->
      <section v-if="cartStore.itemCount > 0" class="mt-24">
        <h2 class="text-4xl font-black text-neutral-900 mb-12 text-center tracking-tight">Vous aimerez aussi</h2>
        <div class="w-24 h-1.5 bg-neutral-900 mx-auto rounded-full mb-16"></div>
        <ProductGrid :products="recommendedProducts" :loading="false" />
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCartStore } from './stores/cart'
import AppHeader from './AppHeader.vue'
import ProductGrid from './ProductGrid.vue'

const cartStore = useCartStore()
const promoCode = ref('')

// à remplacer par un vrai appel API
const recommendedProducts = ref([
  {
    id: 101,
    name: 'Produit recommandé 1',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    rating: 4.5,
    reviewCount: 120,
    stock: 15
  },
  {
    id: 102,
    name: 'Produit recommandé 2',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    rating: 4.8,
    reviewCount: 89,
    stock: 8
  },
  {
    id: 103,
    name: 'Produit recommandé 3',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
    rating: 4.6,
    reviewCount: 156,
    stock: 22
  },
  {
    id: 104,
    name: 'Produit recommandé 4',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400',
    rating: 4.7,
    reviewCount: 94,
    stock: 12
  }
])
</script>