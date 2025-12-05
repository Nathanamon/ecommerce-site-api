<template>
  <div class="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center py-16 px-4">
    <!-- Effets de fond -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style="animation-delay: 1s"></div>
    </div>

    <div class="relative w-full max-w-md">
      <!-- Logo -->
      <router-link to="/" class="block text-center mb-8">
        <h1 class="text-5xl font-black text-white tracking-tighter mb-2">EcoMarket</h1>
        <p class="text-neutral-400 font-medium">Créez votre compte</p>
      </router-link>

      <!-- Carte d'inscription -->
      <div class="bg-white rounded-3xl shadow-2xl p-10 border border-neutral-100">
        <h2 class="text-3xl font-black text-neutral-900 mb-2 tracking-tight">Inscription</h2>
        <p class="text-neutral-600 mb-8">Rejoignez-nous dès aujourd'hui</p>

        <!-- Message d'erreur -->
        <div v-if="error" class="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl flex items-center gap-3">
          <svg class="w-5 h-5 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
          </svg>
          <p class="text-red-800 text-sm font-semibold">{{ error }}</p>
        </div>

        <!-- Message de succès -->
        <div v-if="success" class="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-2xl flex items-center gap-3">
          <svg class="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
          </svg>
          <p class="text-green-800 text-sm font-semibold">{{ success }}</p>
        </div>

        <!-- Formulaire -->
        <div class="space-y-5">
          <!-- Nom -->
          <div>
            <label for="name" class="block text-sm font-bold text-neutral-900 mb-2">Nom complet</label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              placeholder="Jean Dupont"
              class="w-full px-5 py-4 bg-neutral-50 border-2 border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-all duration-300 placeholder-neutral-400"
            />
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-bold text-neutral-900 mb-2">Email</label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              placeholder="vous@exemple.com"
              class="w-full px-5 py-4 bg-neutral-50 border-2 border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-all duration-300 placeholder-neutral-400"
            />
          </div>

          <!-- Mot de passe -->
          <div>
            <label for="password" class="block text-sm font-bold text-neutral-900 mb-2">Mot de passe</label>
            <div class="relative">
              <input
                id="password"
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                class="w-full px-5 py-4 bg-neutral-50 border-2 border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-all duration-300 placeholder-neutral-400"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900 transition-colors"
              >
                <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                </svg>
              </button>
            </div>
            <!-- Indicateur de force -->
            <div v-if="formData.password" class="mt-2">
              <div class="flex gap-2">
                <div class="flex-1 h-2 rounded-full transition-all duration-300"
                     :class="passwordStrength >= 1 ? 'bg-red-500' : 'bg-neutral-200'"></div>
                <div class="flex-1 h-2 rounded-full transition-all duration-300"
                     :class="passwordStrength >= 2 ? 'bg-orange-500' : 'bg-neutral-200'"></div>
                <div class="flex-1 h-2 rounded-full transition-all duration-300"
                     :class="passwordStrength >= 3 ? 'bg-yellow-500' : 'bg-neutral-200'"></div>
                <div class="flex-1 h-2 rounded-full transition-all duration-300"
                     :class="passwordStrength >= 4 ? 'bg-green-500' : 'bg-neutral-200'"></div>
              </div>
              <p class="text-xs mt-1 font-medium"
                 :class="{
                   'text-red-600': passwordStrength === 1,
                   'text-orange-600': passwordStrength === 2,
                   'text-yellow-600': passwordStrength === 3,
                   'text-green-600': passwordStrength === 4
                 }">
                {{ passwordStrengthText }}
              </p>
            </div>
          </div>

          <!-- Confirmation mot de passe -->
          <div>
            <label for="confirmPassword" class="block text-sm font-bold text-neutral-900 mb-2">Confirmer le mot de passe</label>
            <input
              id="confirmPassword"
              v-model="formData.confirmPassword"
              type="password"
              placeholder="••••••••"
              class="w-full px-5 py-4 bg-neutral-50 border-2 border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-all duration-300 placeholder-neutral-400"
            />
          </div>

          <!-- CGV -->
          <label class="flex items-start cursor-pointer group">
            <input
              v-model="formData.acceptTerms"
              type="checkbox"
              class="w-5 h-5 text-neutral-900 rounded-lg focus:ring-2 focus:ring-neutral-900 border-neutral-300 mt-0.5 flex-shrink-0"
            />
            <span class="ml-3 text-sm text-neutral-600 group-hover:text-neutral-900">
              J'accepte les <a href="#" class="font-bold text-neutral-900 hover:text-neutral-600">conditions générales</a> et la <a href="#" class="font-bold text-neutral-900 hover:text-neutral-600">politique de confidentialité</a>
            </span>
          </label>

          <!-- Bouton d'inscription -->
          <button
            @click="handleRegister"
            :disabled="loading"
            class="w-full bg-neutral-900 text-white py-4 rounded-2xl font-bold hover:bg-neutral-800 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-3 disabled:hover:translate-y-0"
          >
            <svg v-if="loading" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span v-else>Créer mon compte</span>
          </button>
        </div>

        <!-- Divider -->
        <div class="flex items-center gap-4 my-8">
          <div class="flex-1 h-px bg-neutral-200"></div>
          <span class="text-neutral-400 text-sm font-medium">OU</span>
          <div class="flex-1 h-px bg-neutral-200"></div>
        </div>

        <!-- Lien vers connexion -->
        <p class="mt-8 text-center text-neutral-600">
          Déjà un compte ?
          <router-link to="/login" class="font-bold text-neutral-900 hover:text-neutral-600 transition-colors">
            Se connecter
          </router-link>
        </p>
      </div>

      <!-- Retour à l'accueil -->
      <router-link to="/" class="block text-center mt-6 text-neutral-400 hover:text-white transition-colors font-medium">
        ← Retour à l'accueil
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const formData = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

const showPassword = ref(false)
const loading = ref(false)
const error = ref('')
const success = ref('')

const passwordStrength = computed(() => {
  const password = formData.value.password
  if (!password) return 0
  
  let strength = 0
  if (password.length >= 8) strength++
  if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++
  if (password.match(/[0-9]/)) strength++
  if (password.match(/[^a-zA-Z0-9]/)) strength++
  
  return strength
})

const passwordStrengthText = computed(() => {
  const texts = ['', 'Faible', 'Moyen', 'Bon', 'Fort']
  return texts[passwordStrength.value]
})

const handleRegister = async () => {
  error.value = ''
  success.value = ''
  
  // Validation
  if (!formData.value.name || !formData.value.email || !formData.value.password) {
    error.value = 'Veuillez remplir tous les champs'
    return
  }
  
  if (formData.value.password !== formData.value.confirmPassword) {
    error.value = 'Les mots de passe ne correspondent pas'
    return
  }
  
  if (formData.value.password.length < 8) {
    error.value = 'Le mot de passe doit contenir au moins 8 caractères'
    return
  }
  
  if (!formData.value.acceptTerms) {
    error.value = 'Vous devez accepter les conditions générales'
    return
  }

  loading.value = true
  
  try {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nom: formData.value.name,
        email: formData.value.email,
        mot_de_passe: formData.value.password
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de l\'inscription')
    }

    success.value = 'Compte créé avec succès ! Redirection...'
    
    // Rediriger vers la page de connexion après 2 secondes
    setTimeout(() => {
      router.push('/login')
    }, 2000)
    
  } catch (err) {
    console.error('Erreur d\'inscription:', err)
    error.value = err.message || 'Une erreur est survenue'
  } finally {
    loading.value = false
  }
}
</script>