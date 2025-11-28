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

        <!-- Connexion sociale -->
        <div class="space-y-3">
          <button class="w-full py-4 px-6 border-2 border-neutral-200 rounded-2xl font-semibold hover:border-neutral-900 hover:bg-neutral-50 transition-all duration-300 flex items-center justify-center gap-3">
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"></path>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path>
            </svg>
            Continuer avec Google
          </button>
          
          <button class="w-full py-4 px-6 border-2 border-neutral-200 rounded-2xl font-semibold hover:border-neutral-900 hover:bg-neutral-50 transition-all duration-300 flex items-center justify-center gap-3">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
            </svg>
            Continuer avec GitHub
          </button>
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