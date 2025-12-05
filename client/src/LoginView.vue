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
        <p class="text-neutral-400 font-medium">Bienvenue !</p>
      </router-link>

      <!-- Carte de connexion -->
      <div class="bg-white rounded-3xl shadow-2xl p-10 border border-neutral-100">
        <h2 class="text-3xl font-black text-neutral-900 mb-2 tracking-tight">Connexion</h2>
        <p class="text-neutral-600 mb-8">Accédez à votre compte</p>

        <!-- Message d'erreur -->
        <div v-if="error" class="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl flex items-center gap-3">
          <svg class="w-5 h-5 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
          </svg>
          <p class="text-red-800 text-sm font-semibold">{{ error }}</p>
        </div>

        <!-- Formulaire -->
        <div class="space-y-5">
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-bold text-neutral-900 mb-2">Email</label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              placeholder="vous@exemple.com"
              class="w-full px-5 py-4 bg-neutral-50 border-2 border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-all duration-300 placeholder-neutral-400"
              @keyup.enter="handleLogin"
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
                @keyup.enter="handleLogin"
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
          </div>

          <!-- Se souvenir de moi + Mot de passe oublié -->
          <div class="flex items-center justify-between">
            <label class="flex items-center cursor-pointer group">
              <input
                v-model="formData.remember"
                type="checkbox"
                class="w-5 h-5 text-neutral-900 rounded-lg focus:ring-2 focus:ring-neutral-900 border-neutral-300"
              />
              <span class="ml-2 text-sm text-neutral-600 group-hover:text-neutral-900 font-medium">Se souvenir de moi</span>
            </label>
            <a href="#" class="text-sm font-semibold text-neutral-900 hover:text-neutral-600 transition-colors">
              Mot de passe oublié ?
            </a>
          </div>

          <!-- Bouton de connexion -->
          <button
            @click="handleLogin"
            :disabled="loading"
            class="w-full bg-neutral-900 text-white py-4 rounded-2xl font-bold hover:bg-neutral-800 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-3 disabled:hover:translate-y-0"
          >
            <svg v-if="loading" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span v-else>Se connecter</span>
          </button>
        </div>

        <!-- Divider -->
        <div class="flex items-center gap-4 my-8">
          <div class="flex-1 h-px bg-neutral-200"></div>
          <span class="text-neutral-400 text-sm font-medium">OU</span>
          <div class="flex-1 h-px bg-neutral-200"></div>
        </div>
        <!-- Lien vers inscription -->
        <p class="mt-8 text-center text-neutral-600">
          Pas encore de compte ?
          <router-link to="/register" class="font-bold text-neutral-900 hover:text-neutral-600 transition-colors">
            S'inscrire
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const formData = ref({
  email: '',
  password: '',
  remember: false
})

const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  error.value = ''
  
  if (!formData.value.email || !formData.value.password) {
    error.value = 'Veuillez remplir tous les champs'
    return
  }

  loading.value = true
  
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: formData.value.email,
        password: formData.value.password
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Erreur de connexion')
    }

    // Sauvegarder l'utilisateur dans le store
    authStore.login(data.user, data.token)
    
    // Rediriger vers la page d'accueil
    router.push('/')
    
  } catch (err) {
    console.error('Erreur de connexion:', err)
    error.value = err.message || 'Email ou mot de passe incorrect'
  } finally {
    loading.value = false
  }
}
</script>