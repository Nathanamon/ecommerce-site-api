<template>
  <div class="min-h-screen bg-gradient-to-b from-white to-neutral-50">
    <AppHeader />

    <main class="container mx-auto px-8 py-16">
      <!-- En-tête -->
      <div class="mb-12 text-center">
        <h1 class="text-5xl md:text-6xl font-black text-neutral-900 mb-6 tracking-tighter">Finaliser ma commande</h1>
        
        <!-- Stepper -->
        <div class="max-w-3xl mx-auto">
          <div class="flex items-center justify-between">
            <div
              v-for="(stepItem, index) in steps"
              :key="stepItem.id"
              class="flex items-center"
              :class="index < steps.length - 1 ? 'flex-1' : ''"
            >
              <!-- Cercle de l'étape -->
              <div class="flex flex-col items-center">
                <div
                  class="w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 mb-2"
                  :class="step >= stepItem.id 
                    ? 'bg-neutral-900 text-white shadow-xl' 
                    : 'bg-neutral-100 text-neutral-400'"
                >
                  {{ stepItem.id }}
                </div>
                <span
                  class="text-sm font-semibold"
                  :class="step >= stepItem.id ? 'text-neutral-900' : 'text-neutral-400'"
                >
                  {{ stepItem.label }}
                </span>
              </div>
              
              <!-- Ligne de connexion -->
              <div
                v-if="index < steps.length - 1"
                class="flex-1 h-1 mx-4 rounded-full transition-all duration-300"
                :class="step > stepItem.id ? 'bg-neutral-900' : 'bg-neutral-200'"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Formulaire -->
        <div class="lg:col-span-2">
          <!-- Étape 1: Livraison -->
          <div v-show="step === 1" class="bg-white rounded-3xl shadow-xl p-10 border border-neutral-100">
            <h2 class="text-3xl font-black text-neutral-900 mb-8 tracking-tight">Adresse de livraison</h2>

            <div class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-bold text-neutral-900 mb-2">Prénom</label>
                  <input
                    v-model="shippingData.firstName"
                    type="text"
                    class="w-full px-5 py-4 bg-neutral-50 border-2 border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-all duration-300"
                  />
                </div>
                <div>
                  <label class="block text-sm font-bold text-neutral-900 mb-2">Nom</label>
                  <input
                    v-model="shippingData.lastName"
                    type="text"
                    class="w-full px-5 py-4 bg-neutral-50 border-2 border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-all duration-300"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-bold text-neutral-900 mb-2">Adresse</label>
                <input
                  v-model="shippingData.address"
                  type="text"
                  class="w-full px-5 py-4 bg-neutral-50 border-2 border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-all duration-300"
                />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label class="block text-sm font-bold text-neutral-900 mb-2">Code postal</label>
                  <input
                    v-model="shippingData.zipCode"
                    type="text"
                    class="w-full px-5 py-4 bg-neutral-50 border-2 border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-all duration-300"
                  />
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-bold text-neutral-900 mb-2">Ville</label>
                  <input
                    v-model="shippingData.city"
                    type="text"
                    class="w-full px-5 py-4 bg-neutral-50 border-2 border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-all duration-300"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-bold text-neutral-900 mb-2">Téléphone</label>
                <input
                  v-model="shippingData.phone"
                  type="tel"
                  class="w-full px-5 py-4 bg-neutral-50 border-2 border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-all duration-300"
                />
              </div>

              <!-- Bouton Points de Retrait -->
              <button
                @click="showPickupMap = true"
                class="w-full py-4 border-2 border-neutral-900 text-neutral-900 rounded-2xl font-bold hover:bg-neutral-900 hover:text-white transition-all duration-300 flex items-center justify-center gap-3"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                Choisir un point de retrait
              </button>
            </div>

            <button
              @click="nextStep"
              class="w-full mt-8 bg-neutral-900 text-white py-5 rounded-2xl font-bold hover:bg-neutral-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-3"
            >
              <span>Continuer vers le paiement</span>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </button>
          </div>

          <!-- Étape 2: Paiement -->
          <div v-show="step === 2" class="bg-white rounded-3xl shadow-xl p-10 border border-neutral-100">
            <h2 class="text-3xl font-black text-neutral-900 mb-8 tracking-tight">Paiement</h2>

            <!-- Méthodes de paiement -->
            <div class="space-y-4 mb-8">
              <label
                v-for="method in paymentMethods"
                :key="method.id"
                class="flex items-center p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-lg"
                :class="paymentData.method === method.id 
                  ? 'border-neutral-900 bg-neutral-50' 
                  : 'border-neutral-200'"
              >
                <input
                  type="radio"
                  v-model="paymentData.method"
                  :value="method.id"
                  class="w-5 h-5 text-neutral-900 focus:ring-neutral-900"
                />
                <div class="ml-4 flex-1 flex items-center justify-between">
                  <div>
                    <p class="font-bold text-lg text-neutral-900">{{ method.label }}</p>
                    <p class="text-sm text-neutral-600">{{ method.description }}</p>
                  </div>
                  <svg class="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="method.icon"></path>
                  </svg>
                </div>
              </label>
            </div>

            <!-- Formulaire carte bancaire -->
            <div v-if="paymentData.method === 'card'" class="space-y-6 p-6 bg-neutral-50 rounded-2xl">
              <div>
                <label class="block text-sm font-bold text-neutral-900 mb-2">Numéro de carte</label>
                <input
                  v-model="paymentData.cardNumber"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  maxlength="19"
                  class="w-full px-5 py-4 bg-white border-2 border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-all duration-300"
                />
              </div>

              <div class="grid grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-bold text-neutral-900 mb-2">Date d'expiration</label>
                  <input
                    v-model="paymentData.expiry"
                    type="text"
                    placeholder="MM/AA"
                    maxlength="5"
                    class="w-full px-5 py-4 bg-white border-2 border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-all duration-300"
                  />
                </div>
                <div>
                  <label class="block text-sm font-bold text-neutral-900 mb-2">CVV</label>
                  <input
                    v-model="paymentData.cvv"
                    type="text"
                    placeholder="123"
                    maxlength="3"
                    class="w-full px-5 py-4 bg-white border-2 border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-all duration-300"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-bold text-neutral-900 mb-2">Nom sur la carte</label>
                <input
                  v-model="paymentData.cardName"
                  type="text"
                  placeholder="JEAN DUPONT"
                  class="w-full px-5 py-4 bg-white border-2 border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-all duration-300"
                />
              </div>
            </div>

            <div class="flex gap-4 mt-8">
              <button
                @click="prevStep"
                class="flex-1 py-5 border-2 border-neutral-200 rounded-2xl font-bold hover:border-neutral-900 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Retour
              </button>
              <button
                @click="nextStep"
                class="flex-1 bg-neutral-900 text-white py-5 rounded-2xl font-bold hover:bg-neutral-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-3"
              >
                <span>Confirmer</span>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Étape 3: Confirmation -->
          <div v-show="step === 3" class="bg-white rounded-3xl shadow-xl p-10 border border-neutral-100">
            <div class="text-center py-12">
              <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg class="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 class="text-4xl font-black text-neutral-900 mb-4">Commande confirmée !</h2>
              <p class="text-neutral-600 text-lg mb-2">Votre commande #{{ orderNumber }} a été enregistrée</p>
              <p class="text-neutral-500 mb-8">Vous recevrez un email de confirmation sous peu</p>

              <div class="flex gap-4 justify-center">
                <router-link
                  to="/profile"
                  class="bg-neutral-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-neutral-800 transition-all duration-300 shadow-lg"
                >
                  Voir mes commandes
                </router-link>
                <router-link
                  to="/"
                  class="px-8 py-4 border-2 border-neutral-200 rounded-2xl font-bold hover:border-neutral-900 transition-all duration-300"
                >
                  Retour à l'accueil
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- Résumé commande (sticky) -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-3xl shadow-2xl p-8 border border-neutral-100 sticky top-24">
            <h3 class="text-2xl font-black text-neutral-900 mb-6 tracking-tight">Récapitulatif</h3>

            <!-- Articles -->
            <div class="space-y-4 mb-6 pb-6 border-b border-neutral-100 max-h-64 overflow-y-auto">
              <div
                v-for="item in cartStore.items"
                :key="item.id"
                class="flex gap-3"
              >
                <img
                  :src="item.product.image"
                  :alt="item.product.name"
                  class="w-16 h-16 object-cover rounded-xl"
                />
                <div class="flex-1">
                  <p class="font-semibold text-sm text-neutral-900 line-clamp-2">{{ item.product.name }}</p>
                  <p class="text-sm text-neutral-500">Qté: {{ item.quantity }}</p>
                </div>
                <p class="font-bold text-neutral-900">{{ (item.product.price * item.quantity).toFixed(2) }}€</p>
              </div>
            </div>

            <!-- Totaux -->
            <div class="space-y-3 mb-6">
              <div class="flex justify-between text-neutral-600">
                <span class="font-medium">Sous-total</span>
                <span class="font-bold">{{ cartStore.subtotal.toFixed(2) }}€</span>
              </div>
              <div class="flex justify-between text-neutral-600">
                <span class="font-medium">Livraison</span>
                <span class="font-bold text-green-600">Gratuite</span>
              </div>
              <div class="flex justify-between text-neutral-600">
                <span class="font-medium">TVA</span>
                <span class="font-bold">{{ (cartStore.subtotal * 0.2).toFixed(2) }}€</span>
              </div>
            </div>

            <!-- Total final -->
            <div class="pt-6 border-t border-neutral-100">
              <div class="flex justify-between items-center mb-6">
                <span class="text-xl font-bold text-neutral-900">Total</span>
                <span class="text-3xl font-black text-neutral-900">{{ cartStore.total.toFixed(2) }}€</span>
              </div>

              <!-- Badge sécurité -->
              <div class="flex items-center justify-center gap-2 text-sm text-neutral-500">
                <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path>
                </svg>
                <span class="font-medium">Paiement sécurisé</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal Carte Points de Retrait -->
    <PickupMapModal v-if="showPickupMap" @close="showPickupMap = false" @select="selectPickupPoint" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from './stores/cart'
import AppHeader from './AppHeader.vue'
import PickupMapModal from './PickupMapModal.vue'

const router = useRouter()
const cartStore = useCartStore()

// Rediriger si le panier est vide
if (cartStore.itemCount === 0) {
  router.push('/cart')
}

const step = ref(1)
const showPickupMap = ref(false)
const orderNumber = ref(Math.floor(Math.random() * 10000))

const steps = [
  { id: 1, label: 'Livraison' },
  { id: 2, label: 'Paiement' },
  { id: 3, label: 'Confirmation' }
]

const shippingData = ref({
  firstName: '',
  lastName: '',
  address: '',
  zipCode: '',
  city: '',
  phone: ''
})

const paymentMethods = [
  {
    id: 'card',
    label: 'Carte bancaire',
    description: 'Visa, Mastercard, Amex',
    icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
  },
  {
    id: 'paypal',
    label: 'PayPal',
    description: 'Paiement sécurisé via PayPal',
    icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z'
  },
  {
    id: 'transfer',
    label: 'Virement bancaire',
    description: 'Paiement par virement',
    icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4'
  }
]

const paymentData = ref({
  method: 'card',
  cardNumber: '',
  expiry: '',
  cvv: '',
  cardName: ''
})

const nextStep = () => {
  if (step.value < 3) {
    step.value++
  }
  
  if (step.value === 3) {
    // Vider le panier après confirmation
    setTimeout(() => {
      cartStore.clearCart()
    }, 3000)
  }
}

const prevStep = () => {
  if (step.value > 1) {
    step.value--
  }
}

const selectPickupPoint = (point) => {
  shippingData.value.address = point.address
  shippingData.value.city = point.city
  shippingData.value.zipCode = point.zipCode
  showPickupMap.value = false
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>