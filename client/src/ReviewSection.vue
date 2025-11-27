<template>
  <section class="mt-24">
    <div class="bg-white rounded-3xl shadow-2xl p-12 border border-neutral-100">
      <h2 class="text-4xl md:text-5xl font-black text-neutral-900 mb-12 tracking-tight">Avis clients</h2>
      
      <!-- Résumé des notes -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 pb-16 border-b border-neutral-100">
        <div class="flex items-center gap-8">
          <div class="text-7xl font-black text-neutral-900">{{ averageRating }}</div>
          <div>
            <div class="flex text-yellow-400 text-3xl mb-2">
              <span v-for="star in 5" :key="star" class="drop-shadow-md">
                {{ star <= Math.round(averageRating) ? '★' : '☆' }}
              </span>
            </div>
            <p class="text-neutral-600 text-lg font-semibold">{{ reviews.length }} avis</p>
          </div>
        </div>
        
        <!-- Répartition des notes -->
        <div class="space-y-3">
          <div v-for="rating in [5, 4, 3, 2, 1]" :key="rating" class="flex items-center gap-4">
            <span class="w-20 text-sm text-neutral-600 font-semibold">{{ rating }} étoile{{ rating > 1 ? 's' : '' }}</span>
            <div class="flex-1 bg-neutral-100 rounded-full h-3 overflow-hidden">
              <div 
                class="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full transition-all duration-1000 shadow-sm" 
                :style="{ width: `${ratingDistribution[rating] || 0}%` }"
              ></div>
            </div>
            <span class="w-16 text-sm text-neutral-600 font-semibold text-right">{{ ratingDistribution[rating] || 0 }}%</span>
          </div>
        </div>
      </div>

      <!-- Liste des avis -->
      <div class="space-y-8 mb-12">
        <div 
          v-for="review in reviews" 
          :key="review.id"
          class="pb-8 border-b border-neutral-100 last:border-0 hover:bg-neutral-50 -mx-6 px-6 rounded-2xl transition-all duration-300"
        >
          <div class="flex justify-between items-start mb-4">
            <div>
              <h4 class="font-bold text-xl text-neutral-900 mb-2">{{ review.user }}</h4>
              <div class="flex items-center gap-3">
                <div class="flex text-yellow-400 text-lg">
                  <span v-for="star in 5" :key="star" class="drop-shadow-sm">
                    {{ star <= review.rating ? '★' : '☆' }}
                  </span>
                </div>
                <span class="text-sm text-neutral-500 font-medium">{{ formatDate(review.date) }}</span>
              </div>
            </div>
          </div>
          <p class="text-neutral-700 mt-4 text-lg leading-relaxed">{{ review.comment }}</p>
        </div>
      </div>

      <!-- Bouton pour ajouter un avis -->
      <div class="mt-12 pt-12 border-t border-neutral-200">
        <button 
          @click="showReviewForm = !showReviewForm"
          class="bg-neutral-900 text-white px-10 py-4 rounded-full font-bold hover:bg-neutral-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 inline-flex items-center gap-3"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          {{ showReviewForm ? 'Annuler' : 'Ajouter un avis' }}
        </button>

        <!-- Formulaire d'avis -->
        <div v-if="showReviewForm" class="mt-10 p-10 bg-gradient-to-br from-neutral-50 to-neutral-100/50 rounded-3xl border border-neutral-200">
          <h3 class="text-2xl font-bold mb-8 text-neutral-900">Donnez votre avis</h3>
          <div @submit.prevent="submitReview">
            <!-- Note -->
            <div class="mb-8">
              <label class="block text-lg font-bold text-neutral-900 mb-4">Votre note</label>
              <div class="flex gap-3">
                <button 
                  v-for="star in 5" 
                  :key="star"
                  type="button"
                  @click="newReview.rating = star"
                  class="text-5xl focus:outline-none transition-all duration-300 hover:scale-125"
                  :class="star <= newReview.rating ? 'text-yellow-400 drop-shadow-lg' : 'text-neutral-300'"
                >
                  ★
                </button>
              </div>
            </div>

            <!-- Commentaire -->
            <div class="mb-8">
              <label for="comment" class="block text-lg font-bold text-neutral-900 mb-4">Votre commentaire</label>
              <textarea 
                id="comment"
                v-model="newReview.comment"
                rows="6"
                class="w-full px-6 py-4 bg-white border-2 border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-all duration-300 placeholder-neutral-400 resize-none"
                placeholder="Partagez votre expérience avec ce produit..."
              ></textarea>
            </div>

            <button 
              type="button"
              @click="submitReview"
              :disabled="!newReview.rating || !newReview.comment"
              class="bg-neutral-900 text-white px-10 py-4 rounded-full font-bold hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100 inline-flex items-center gap-3"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Publier mon avis
            </button>
          </div>
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

const submitReview = async () => {
  if (newReview.value.rating && newReview.value.comment) {
    try {
      // 1. Appel à l'API qu'on vient de créer
      const response = await fetch(`http://localhost:3000/api/products/${props.productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rating: newReview.value.rating,
          comment: newReview.value.comment
        })
      });

      if (!response.ok) throw new Error("Erreur lors de l'envoi");

      const savedReview = await response.json();

      // 2. Mise à jour instantanée de l'affichage (sans recharger)
      props.reviews.unshift({
        id: savedReview.id,
        user: 'Vous (à l\'instant)',
        rating: savedReview.rating,
        comment: savedReview.commentaire, // On utilise le champ renvoyé par la base
        date: new Date().toISOString()
      });

      // 3. Nettoyage du formulaire
      newReview.value = { rating: 0, comment: '' };
      showReviewForm.value = false;
      alert('Merci pour votre avis !');

    } catch (e) {
      console.error(e);
      alert("Impossible d'envoyer l'avis. Vérifiez que le serveur tourne.");
    }
  }
}
</script>