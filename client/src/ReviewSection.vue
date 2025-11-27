<template>
  <section class="mt-20">
    <div class="bg-white rounded-3xl shadow-xl p-12 border border-neutral-100">
      <h2 class="text-3xl font-black text-neutral-900 mb-8">Avis clients</h2>
      
      <!-- Résumé des notes -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
        <div>
          <div class="flex items-center mb-6">
            <div class="text-5xl font-black text-neutral-900 mr-6">{{ averageRating }}/5</div>
            <div class="flex text-yellow-400 text-3xl">
              <span v-for="star in 5" :key="star">
                {{ star <= Math.round(averageRating) ? '★' : '☆' }}
              </span>
            </div>
          </div>
          <p class="text-neutral-600 text-lg font-medium">{{ reviews.length }} avis</p>
        </div>
        
        <!-- Répartition des notes -->
        <div class="space-y-4">
          <div v-for="rating in 5" :key="rating" class="flex items-center">
            <span class="w-16 text-base text-neutral-600 font-medium">{{ rating }} étoile{{ rating > 1 ? 's' : '' }}</span>
            <div class="flex-1 bg-neutral-200 rounded-full h-3 mx-4">
              <div 
                class="bg-yellow-400 h-3 rounded-full transition-all duration-1000" 
                :style="{ width: `${ratingDistribution[rating] || 0}%` }"
              ></div>
            </div>
            <span class="w-16 text-base text-neutral-600 font-medium">{{ ratingDistribution[rating] || 0 }}%</span>
          </div>
        </div>
      </div>

      <!-- Liste des avis -->
      <div class="space-y-8">
        <div 
          v-for="review in reviews" 
          :key="review.id"
          class="border-b border-neutral-200 pb-8 last:border-0"
        >
          <div class="flex justify-between items-start mb-4">
            <div>
              <h4 class="font-bold text-xl text-neutral-900">{{ review.user }}</h4>
              <div class="flex items-center mt-2">
                <div class="flex text-yellow-400 text-lg">
                  <span v-for="star in 5" :key="star">
                    {{ star <= review.rating ? '★' : '☆' }}
                  </span>
                </div>
                <span class="text-base text-neutral-600 ml-3 font-medium">{{ formatDate(review.date) }}</span>
              </div>
            </div>
          </div>
          <p class="text-neutral-700 mt-4 text-lg leading-relaxed">{{ review.comment }}</p>
        </div>
      </div>

      <!-- Bouton pour ajouter un avis -->
      <div class="mt-12 pt-8 border-t border-neutral-200">
        <button 
          @click="showReviewForm = !showReviewForm"
          class="bg-neutral-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-neutral-800 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          {{ showReviewForm ? 'Annuler' : 'Ajouter un avis' }}
        </button>

        <!-- Formulaire d'avis -->
        <div v-if="showReviewForm" class="mt-8 p-8 bg-neutral-50 rounded-2xl">
          <h3 class="text-xl font-bold mb-6 text-neutral-900">Donnez votre avis</h3>
          <form @submit.prevent="submitReview">
            <!-- Note -->
            <div class="mb-6">
              <label class="block text-lg font-bold text-neutral-900 mb-4">Votre note</label>
              <div class="flex space-x-2">
                <button 
                  v-for="star in 5" 
                  :key="star"
                  type="button"
                  @click="newReview.rating = star"
                  class="text-4xl focus:outline-none transition-transform hover:scale-110"
                  :class="star <= newReview.rating ? 'text-yellow-400' : 'text-neutral-300'"
                >
                  ★
                </button>
              </div>
            </div>

            <!-- Commentaire -->
            <div class="mb-6">
              <label for="comment" class="block text-lg font-bold text-neutral-900 mb-4">Votre commentaire</label>
              <textarea 
                id="comment"
                v-model="newReview.comment"
                rows="5"
                class="w-full px-4 py-3 border-2 border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-all duration-300"
                placeholder="Partagez votre expérience avec ce produit..."
              ></textarea>
            </div>

            <button 
              type="submit"
              :disabled="!newReview.rating || !newReview.comment"
              class="bg-neutral-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-neutral-800 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg"
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