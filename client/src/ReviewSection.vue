<template>
  <section class="mt-12">
    <div class="bg-white rounded-lg shadow-lg p-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Avis clients</h2>
      
      <!-- Résumé des notes -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <div class="flex items-center mb-4">
            <div class="text-4xl font-bold text-gray-900 mr-4">{{ averageRating }}/5</div>
            <div class="flex text-yellow-400 text-2xl">
              <span v-for="star in 5" :key="star">
                {{ star <= Math.round(averageRating) ? '★' : '☆' }}
              </span>
            </div>
          </div>
          <p class="text-gray-600">{{ reviews.length }} avis</p>
        </div>
        
        <!-- Répartition des notes -->
        <div class="space-y-2">
          <div v-for="rating in 5" :key="rating" class="flex items-center">
            <span class="w-12 text-sm text-gray-600">{{ rating }} étoile{{ rating > 1 ? 's' : '' }}</span>
            <div class="flex-1 bg-gray-200 rounded-full h-2 mx-2">
              <div 
                class="bg-yellow-400 h-2 rounded-full" 
                :style="{ width: `${ratingDistribution[rating] || 0}%` }"
              ></div>
            </div>
            <span class="w-12 text-sm text-gray-600">{{ ratingDistribution[rating] || 0 }}%</span>
          </div>
        </div>
      </div>

      <!-- Liste des avis -->
      <div class="space-y-6">
        <div 
          v-for="review in reviews" 
          :key="review.id"
          class="border-b border-gray-200 pb-6 last:border-0"
        >
          <div class="flex justify-between items-start mb-2">
            <div>
              <h4 class="font-semibold text-gray-900">{{ review.user }}</h4>
              <div class="flex items-center mt-1">
                <div class="flex text-yellow-400">
                  <span v-for="star in 5" :key="star">
                    {{ star <= review.rating ? '★' : '☆' }}
                  </span>
                </div>
                <span class="text-sm text-gray-600 ml-2">{{ formatDate(review.date) }}</span>
              </div>
            </div>
          </div>
          <p class="text-gray-700 mt-2">{{ review.comment }}</p>
        </div>
      </div>

      <!-- Bouton pour ajouter un avis -->
      <div class="mt-8 pt-6 border-t border-gray-200">
        <button 
          @click="showReviewForm = !showReviewForm"
          class="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
        >
          {{ showReviewForm ? 'Annuler' : 'Ajouter un avis' }}
        </button>

        <!-- Formulaire d'avis -->
        <div v-if="showReviewForm" class="mt-6 p-6 bg-gray-50 rounded-lg">
          <h3 class="text-lg font-semibold mb-4">Donnez votre avis</h3>
          <form @submit.prevent="submitReview">
            <!-- Note -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Votre note</label>
              <div class="flex space-x-1">
                <button 
                  v-for="star in 5" 
                  :key="star"
                  type="button"
                  @click="newReview.rating = star"
                  class="text-2xl focus:outline-none"
                  :class="star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'"
                >
                  ★
                </button>
              </div>
            </div>

            <!-- Commentaire -->
            <div class="mb-4">
              <label for="comment" class="block text-sm font-medium text-gray-700 mb-2">Votre commentaire</label>
              <textarea 
                id="comment"
                v-model="newReview.comment"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Partagez votre expérience avec ce produit..."
              ></textarea>
            </div>

            <button 
              type="submit"
              :disabled="!newReview.rating || !newReview.comment"
              class="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Publier mon avis
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, defineProps } from 'vue'

const props = defineProps({
  productId: {
    type: Number,
    required: true
  },
  reviews: {
    type: Array,
    default: () => []
  }
})

const showReviewForm = ref(false)
const newReview = ref({
  rating: 0,
  comment: ''
})

// Computed
const averageRating = computed(() => {
  if (props.reviews.length === 0) return 0
  const sum = props.reviews.reduce((acc, review) => acc + review.rating, 0)
  return (sum / props.reviews.length).toFixed(1)
})

const ratingDistribution = computed(() => {
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  props.reviews.forEach(review => {
    distribution[review.rating]++
  })
  
  // Convertir en pourcentages
  Object.keys(distribution).forEach(rating => {
    distribution[rating] = Math.round((distribution[rating] / props.reviews.length) * 100)
  })
  
  return distribution
})

// Méthodes
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

const submitReview = () => {
  if (newReview.value.rating && newReview.value.comment) {
    const review = {
      id: Date.now(),
      user: 'Vous',
      rating: newReview.value.rating,
      comment: newReview.value.comment,
      date: new Date().toISOString().split('T')[0]
    }
    
    // Ici, nous appellerons l'API plus tard
    console.log('Nouvel avis:', review)
    props.reviews.unshift(review)
    
    // Réinitialiser le formulaire
    newReview.value = { rating: 0, comment: '' }
    showReviewForm.value = false
    
    alert('Merci pour votre avis !')
  }
}
</script>