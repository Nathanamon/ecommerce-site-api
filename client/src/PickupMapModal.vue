<template>
  <!-- Overlay modal -->
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="$emit('close')">
    <div class="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden" @click.stop>
      <!-- Header -->
      <div class="p-8 border-b border-neutral-100 flex items-center justify-between">
        <div>
          <h2 class="text-3xl font-black text-neutral-900 mb-2 tracking-tight">Points de retrait</h2>
          <p class="text-neutral-600">Sélectionnez votre point de retrait préféré</p>
        </div>
        <button
          @click="$emit('close')"
          class="p-3 hover:bg-neutral-100 rounded-full transition-all duration-300"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Contenu -->
      <div class="grid grid-cols-1 lg:grid-cols-2 h-[600px]">
        <!-- Liste des points -->
        <div class="p-8 overflow-y-auto border-r border-neutral-100">
          <!-- Barre de recherche -->
          <div class="mb-6">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Rechercher par ville ou code postal..."
                class="w-full px-5 py-4 pl-12 bg-neutral-50 border-2 border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-all duration-300"
                @input="searchPickupPoints"
              />
              <svg class="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>

          <!-- État de chargement -->
          <div v-if="loading" class="text-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-neutral-200 border-t-neutral-900 mx-auto mb-4"></div>
            <p class="text-neutral-600">Recherche des points de retrait...</p>
          </div>

          <!-- Liste -->
          <div v-else class="space-y-4">
            <div
              v-for="point in filteredPoints"
              :key="point.id"
              class="border-2 rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:shadow-lg"
              :class="selectedPoint?.id === point.id 
                ? 'border-neutral-900 bg-neutral-50' 
                : 'border-neutral-200 hover:border-neutral-400'"
              @click="selectPoint(point)"
            >
              <div class="flex items-start gap-4">
                <!-- Icône -->
                <div class="w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>

                <!-- Infos -->
                <div class="flex-1">
                  <h3 class="font-bold text-lg text-neutral-900 mb-1">{{ point.name }}</h3>
                  <p class="text-sm text-neutral-600 mb-2">{{ point.address }}</p>
                  <p class="text-sm text-neutral-600">{{ point.zipCode }} {{ point.city }}</p>
                  
                  <!-- Distance -->
                  <div class="flex items-center gap-2 mt-3">
                    <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">
                      {{ point.distance }} km
                    </span>
                    <span class="text-xs text-neutral-500">
                      Ouvert {{ point.hours }}
                    </span>
                  </div>
                </div>

                <!-- Checkmark -->
                <div
                  v-if="selectedPoint?.id === point.id"
                  class="w-8 h-8 bg-neutral-900 rounded-full flex items-center justify-center"
                >
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Aucun résultat -->
            <div v-if="filteredPoints.length === 0" class="text-center py-12">
              <div class="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <p class="text-neutral-600 font-semibold">Aucun point de retrait trouvé</p>
              <p class="text-neutral-500 text-sm mt-1">Essayez une autre recherche</p>
            </div>
          </div>
        </div>

        <!-- Carte -->
        <div class="relative bg-neutral-100">
          <!-- Carte interactive (simulation) -->
          <div id="map-container" class="w-full h-full relative">
            <!-- Simulation de carte avec image -->
            <div class="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
              <div class="text-center">
                <svg class="w-24 h-24 text-neutral-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                </svg>
                <p class="text-neutral-600 font-semibold mb-2">Carte interactive</p>
                <p class="text-neutral-500 text-sm">{{ filteredPoints.length }} point(s) disponible(s)</p>
              </div>
            </div>

            <!-- Marqueurs simulés -->
            <div
              v-for="(point, index) in filteredPoints.slice(0, 5)"
              :key="point.id"
              class="absolute w-10 h-10 bg-red-600 rounded-full shadow-lg flex items-center justify-center text-white font-bold cursor-pointer hover:scale-110 transition-transform duration-300"
              :style="{
                left: `${20 + (index * 15)}%`,
                top: `${30 + (index * 10)}%`
              }"
              @click="selectPoint(point)"
            >
              {{ index + 1 }}
            </div>
          </div>

          <!-- Contrôles de la carte -->
          <div class="absolute bottom-6 left-6 flex gap-2">
            <button class="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center hover:bg-neutral-50 transition-all duration-300">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </button>
            <button class="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center hover:bg-neutral-50 transition-all duration-300">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
              </svg>
            </button>
          </div>

          <!-- Bouton Ma position -->
          <button class="absolute top-6 right-6 bg-white px-6 py-3 rounded-full shadow-lg font-bold text-neutral-900 hover:bg-neutral-50 transition-all duration-300 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            Ma position
          </button>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-8 border-t border-neutral-100 flex items-center justify-between">
        <p class="text-neutral-600">
          <span class="font-bold text-neutral-900">{{ filteredPoints.length }}</span> points de retrait disponibles
        </p>
        <div class="flex gap-4">
          <button
            @click="$emit('close')"
            class="px-8 py-4 border-2 border-neutral-200 rounded-2xl font-bold hover:border-neutral-900 transition-all duration-300"
          >
            Annuler
          </button>
          <button
            @click="confirmSelection"
            :disabled="!selectedPoint"
            class="bg-neutral-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Confirmer la sélection
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const emit = defineEmits(['close', 'select'])

const loading = ref(true)
const searchQuery = ref('')
const selectedPoint = ref(null)
const pickupPoints = ref([])

// Simulation d'appel API pour récupérer les points de retrait
onMounted(async () => {
  loading.value = true
  
  try {
    // Simuler un délai d'API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Données mockées - à remplacer par un vrai appel API
    // Par exemple: const response = await fetch('https://api.pickuppoints.com/locations')
    pickupPoints.value = [
      {
        id: 1,
        name: 'Relais Colis Paris Centre',
        address: '45 Rue de Rivoli',
        zipCode: '75001',
        city: 'Paris',
        distance: 0.8,
        hours: '9h-19h',
        lat: 48.8566,
        lng: 2.3522
      },
      {
        id: 2,
        name: 'Mondial Relay Marais',
        address: '23 Rue des Francs-Bourgeois',
        zipCode: '75004',
        city: 'Paris',
        distance: 1.2,
        hours: '10h-20h',
        lat: 48.8575,
        lng: 2.3626
      },
      {
        id: 3,
        name: 'Chronopost Bastille',
        address: '12 Boulevard Beaumarchais',
        zipCode: '75011',
        city: 'Paris',
        distance: 1.5,
        hours: '8h-18h',
        lat: 48.8534,
        lng: 2.3688
      },
      {
        id: 4,
        name: 'Pickup Station République',
        address: '89 Avenue de la République',
        zipCode: '75011',
        city: 'Paris',
        distance: 1.8,
        hours: '24h/24',
        lat: 48.8673,
        lng: 2.3719
      },
      {
        id: 5,
        name: 'Point Relais Opéra',
        address: '15 Avenue de l\'Opéra',
        zipCode: '75001',
        city: 'Paris',
        distance: 2.1,
        hours: '9h-19h',
        lat: 48.8649,
        lng: 2.3349
      },
      {
        id: 6,
        name: 'Colissimo Châtelet',
        address: '8 Place du Châtelet',
        zipCode: '75001',
        city: 'Paris',
        distance: 2.3,
        hours: '7h-21h',
        lat: 48.8583,
        lng: 2.3470
      }
    ]
  } catch (error) {
    console.error('Erreur lors du chargement des points de retrait:', error)
  } finally {
    loading.value = false
  }
})

const filteredPoints = computed(() => {
  if (!searchQuery.value) {
    return pickupPoints.value
  }
  
  const query = searchQuery.value.toLowerCase()
  return pickupPoints.value.filter(point => 
    point.name.toLowerCase().includes(query) ||
    point.address.toLowerCase().includes(query) ||
    point.city.toLowerCase().includes(query) ||
    point.zipCode.includes(query)
  )
})

const searchPickupPoints = () => {
  // Fonction de recherche - peut être améliorée avec un debounce
  console.log('Recherche:', searchQuery.value)
}

const selectPoint = (point) => {
  selectedPoint.value = point
}

const confirmSelection = () => {
  if (selectedPoint.value) {
    emit('select', selectedPoint.value)
    emit('close')
  }
}
</script>