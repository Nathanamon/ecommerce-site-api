<template>
  <div class="min-h-screen bg-gradient-to-b from-white to-neutral-50">
    <AppHeader />

    <main class="container mx-auto px-8 py-16">
      <!-- En-tête du profil -->
      <div class="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 rounded-3xl shadow-2xl p-12 mb-10 relative overflow-hidden">
        <div class="absolute inset-0 opacity-10">
          <div class="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div class="relative flex items-center gap-8">
          <!-- Avatar -->
          <div class="w-32 h-32 rounded-full bg-gradient-to-br from-neutral-700 to-neutral-600 flex items-center justify-center text-white text-5xl font-black shadow-2xl">
            {{ userInitials }}
          </div>
          
          <!-- Infos utilisateur -->
          <div class="flex-1">
            <h1 class="text-4xl font-black text-white mb-2 tracking-tight">{{ authStore.userName }}</h1>
            <p class="text-neutral-300 text-lg mb-4">{{ authStore.userEmail }}</p>
            <div class="flex gap-3">
              <span class="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold">
                Membre depuis {{ memberSince }}
              </span>
              <span class="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold">
                {{ orderCount }} commandes
              </span>
            </div>
          </div>

          <!-- Bouton déconnexion -->
          <button
            @click="handleLogout"
            class="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-2xl font-bold transition-all duration-300 border border-white/20"
          >
            Déconnexion
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Sidebar -->
        <aside class="lg:col-span-1">
          <div class="bg-white rounded-3xl shadow-xl p-8 border border-neutral-100 sticky top-24">
            <h3 class="font-black text-xl mb-6 text-neutral-900">Navigation</h3>
            <nav class="space-y-2">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                class="w-full text-left px-5 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-3"
                :class="activeTab === tab.id 
                  ? 'bg-neutral-900 text-white shadow-lg' 
                  : 'text-neutral-600 hover:bg-neutral-50'"
              >
                <component :is="tab.icon" />
                {{ tab.label }}
              </button>
            </nav>
          </div>
        </aside>

        <!-- Contenu principal -->
        <div class="lg:col-span-2">
          <!-- Onglet Mes Commandes -->
          <div v-if="activeTab === 'orders'" class="space-y-6">
            <div class="bg-white rounded-3xl shadow-xl p-10 border border-neutral-100">
              <h2 class="text-3xl font-black text-neutral-900 mb-8 tracking-tight">Mes Commandes</h2>

              <!-- Liste des commandes -->
              <div v-if="orders.length > 0" class="space-y-6">
                <div
                  v-for="order in orders"
                  :key="order.id"
                  class="border-2 border-neutral-100 rounded-2xl p-6 hover:border-neutral-300 hover:shadow-lg transition-all duration-300"
                >
                  <div class="flex justify-between items-start mb-4">
                    <div>
                      <p class="text-sm text-neutral-500 font-medium">Commande #{{ order.id }}</p>
                      <p class="text-lg font-bold text-neutral-900">{{ formatDate(order.date) }}</p>
                    </div>
                    <span
                      class="px-4 py-2 rounded-full text-sm font-bold"
                      :class="getStatusClass(order.status)"
                    >
                      {{ getStatusText(order.status) }}
                    </span>
                  </div>

                  <!-- Produits de la commande -->
                  <div class="space-y-3 mb-4">
                    <div
                      v-for="item in order.items"
                      :key="item.id"
                      class="flex items-center gap-4"
                    >
                      <img
                        :src="item.image"
                        :alt="item.name"
                        class="w-16 h-16 object-cover rounded-xl"
                      />
                      <div class="flex-1">
                        <p class="font-semibold text-neutral-900">{{ item.name }}</p>
                        <p class="text-sm text-neutral-500">Quantité: {{ item.quantity }}</p>
                      </div>
                      <p class="font-bold text-neutral-900">{{ item.price }}€</p>
                    </div>
                  </div>

                  <div class="flex justify-between items-center pt-4 border-t border-neutral-100">
                    <p class="text-sm text-neutral-500">Total</p>
                    <p class="text-2xl font-black text-neutral-900">{{ order.total }}€</p>
                  </div>

                  <!-- Actions -->
                  <div class="flex gap-3 mt-4">
                    <button class="flex-1 bg-neutral-900 text-white py-3 rounded-xl font-bold hover:bg-neutral-800 transition-all duration-300">
                      Suivre ma commande
                    </button>
                    <button class="px-6 py-3 border-2 border-neutral-200 rounded-xl font-bold hover:border-neutral-900 transition-all duration-300">
                      Facture
                    </button>
                  </div>
                </div>
              </div>

              <!-- Aucune commande -->
              <div v-else class="text-center py-16">
                <div class="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg class="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                  </svg>
                </div>
                <h3 class="text-2xl font-bold text-neutral-900 mb-3">Aucune commande</h3>
                <p class="text-neutral-600 mb-8">Vous n'avez pas encore passé de commande</p>
                <router-link
                  to="/products"
                  class="inline-flex items-center gap-2 bg-neutral-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-neutral-800 transition-all duration-300"
                >
                  Découvrir nos produits
                </router-link>
              </div>
            </div>
          </div>

          <!-- Onglet Informations Personnelles -->
          <div v-if="activeTab === 'info'" class="bg-white rounded-3xl shadow-xl p-10 border border-neutral-100">
            <h2 class="text-3xl font-black text-neutral-900 mb-8 tracking-tight">Informations Personnelles</h2>

            <div class="space-y-6">
              <div>
                <label class="block text-sm font-bold text-neutral-900 mb-2">Nom complet</label>
                <input
                  v-model="profileData.name"
                  type="text"
                  class="w-full px-5 py-4 bg-neutral-50 border-2 border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-all duration-300"
                />
              </div>

              <div>
                <label class="block text-sm font-bold text-neutral-900 mb-2">Email</label>
                <input
                  v-model="profileData.email"
                  type="email"
                  class="w-full px-5 py-4 bg-neutral-50 border-2 border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-all duration-300"
                />
              </div>

              <div>
                <label class="block text-sm font-bold text-neutral-900 mb-2">Téléphone</label>
                <input
                  v-model="profileData.phone"
                  type="tel"
                  class="w-full px-5 py-4 bg-neutral-50 border-2 border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-all duration-300"
                />
              </div>

              <div>
                <label class="block text-sm font-bold text-neutral-900 mb-2">Adresse</label>
                <textarea
                  v-model="profileData.address"
                  rows="3"
                  class="w-full px-5 py-4 bg-neutral-50 border-2 border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-all duration-300 resize-none"
                ></textarea>
              </div>

              <button
                @click="saveProfile"
                class="w-full bg-neutral-900 text-white py-4 rounded-2xl font-bold hover:bg-neutral-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Enregistrer les modifications
              </button>
            </div>
          </div>

          <!-- Onglet Adresses -->
          <div v-if="activeTab === 'addresses'" class="bg-white rounded-3xl shadow-xl p-10 border border-neutral-100">
            <div class="flex justify-between items-center mb-8">
              <h2 class="text-3xl font-black text-neutral-900 tracking-tight">Mes Adresses</h2>
              <button class="bg-neutral-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-neutral-800 transition-all duration-300 flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Ajouter une adresse
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                v-for="address in addresses"
                :key="address.id"
                class="border-2 border-neutral-200 rounded-2xl p-6 hover:border-neutral-900 transition-all duration-300"
              >
                <div class="flex justify-between items-start mb-4">
                  <h3 class="font-bold text-lg text-neutral-900">{{ address.label }}</h3>
                  <span
                    v-if="address.default"
                    class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold"
                  >
                    Par défaut
                  </span>
                </div>
                <p class="text-neutral-700 leading-relaxed mb-4">{{ address.fullAddress }}</p>
                <div class="flex gap-2">
                  <button class="flex-1 py-2 px-4 border-2 border-neutral-200 rounded-xl text-sm font-bold hover:border-neutral-900 transition-all duration-300">
                    Modifier
                  </button>
                  <button class="flex-1 py-2 px-4 border-2 border-red-200 text-red-600 rounded-xl text-sm font-bold hover:border-red-600 transition-all duration-300">
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Onglet Sécurité -->
          <div v-if="activeTab === 'security'" class="bg-white rounded-3xl shadow-xl p-10 border border-neutral-100">
            <h2 class="text-3xl font-black text-neutral-900 mb-8 tracking-tight">Sécurité</h2>

            <div class="space-y-6">
              <div>
                <label class="block text-sm font-bold text-neutral-900 mb-2">Mot de passe actuel</label>
                <input
                  v-model="securityData.currentPassword"
                  type="password"
                  class="w-full px-5 py-4 bg-neutral-50 border-2 border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-all duration-300"
                />
              </div>

              <div>
                <label class="block text-sm font-bold text-neutral-900 mb-2">Nouveau mot de passe</label>
                <input
                  v-model="securityData.newPassword"
                  type="password"
                  class="w-full px-5 py-4 bg-neutral-50 border-2 border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-all duration-300"
                />
              </div>

              <div>
                <label class="block text-sm font-bold text-neutral-900 mb-2">Confirmer le nouveau mot de passe</label>
                <input
                  v-model="securityData.confirmPassword"
                  type="password"
                  class="w-full px-5 py-4 bg-neutral-50 border-2 border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-all duration-300"
                />
              </div>

              <button
                @click="changePassword"
                class="w-full bg-neutral-900 text-white py-4 rounded-2xl font-bold hover:bg-neutral-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Modifier le mot de passe
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, h } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
import AppHeader from './AppHeader.vue'

const router = useRouter()
const authStore = useAuthStore()

// Vérifier si l'utilisateur est connecté
if (!authStore.isAuthenticated) {
  router.push('/login')
}

const activeTab = ref('orders')

const tabs = [
  { id: 'orders', label: 'Mes Commandes', icon: () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' })) },
  { id: 'info', label: 'Informations', icon: () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' })) },
  { id: 'addresses', label: 'Adresses', icon: () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' }), h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M15 11a3 3 0 11-6 0 3 3 0 016 0z' })) },
  { id: 'security', label: 'Sécurité', icon: () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' })) }
]

const userInitials = computed(() => {
  const name = authStore.userName
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const memberSince = computed(() => {
  return 'Nov 2024' // À remplacer par la vraie date
})

const orderCount = computed(() => orders.value.length)

// Données mockées
const orders = ref([
  {
    id: 1001,
    date: '2024-11-20',
    status: 'delivered',
    total: 149.99,
    items: [
      { id: 1, name: 'MacBook Pro 16"', quantity: 1, price: 149.99, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400' }
    ]
  },
  {
    id: 1002,
    date: '2024-11-15',
    status: 'processing',
    total: 79.99,
    items: [
      { id: 2, name: 'AirPods Pro', quantity: 1, price: 79.99, image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400' }
    ]
  }
])

const profileData = ref({
  name: authStore.userName,
  email: authStore.userEmail,
  phone: '+33 6 12 34 56 78',
  address: '123 Rue de la Paix, 75001 Paris'
})

const addresses = ref([
  {
    id: 1,
    label: 'Domicile',
    fullAddress: '123 Rue de la Paix, 75001 Paris, France',
    default: true
  },
  {
    id: 2,
    label: 'Bureau',
    fullAddress: '456 Avenue des Champs-Élysées, 75008 Paris, France',
    default: false
  }
])

const securityData = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getStatusClass = (status) => {
  const classes = {
    delivered: 'bg-green-100 text-green-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-neutral-100 text-neutral-800'
}

const getStatusText = (status) => {
  const texts = {
    delivered: 'Livrée',
    processing: 'En préparation',
    shipped: 'Expédiée',
    cancelled: 'Annulée'
  }
  return texts[status] || 'Inconnue'
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}

const saveProfile = () => {
  authStore.updateUser({ nom: profileData.value.name, email: profileData.value.email })
  alert('Profil mis à jour !')
}

const changePassword = () => {
  if (securityData.value.newPassword !== securityData.value.confirmPassword) {
    alert('Les mots de passe ne correspondent pas')
    return
  }
  alert('Mot de passe modifié !')
  securityData.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
}
</script>