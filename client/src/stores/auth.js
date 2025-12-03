import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // 1. STATE : On initialise directement depuis le localStorage si disponible
  // Cela permet de récupérer la session dès le chargement de la page
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)
  const token = ref(localStorage.getItem('token') || null)
  const loading = ref(false)

  // 2. GETTERS
  const isAuthenticated = computed(() => !!token.value)
  const userName = computed(() => user.value?.nom || '')
  const userEmail = computed(() => user.value?.email || '')

  // 3. ACTIONS
  
  // Fonction appelée par LoginView après succès
  const login = (userData, authToken) => {
    user.value = userData
    token.value = authToken
    
    // On sauvegarde immédiatement dans le navigateur
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', authToken)
  }

  const logout = () => {
    user.value = null
    token.value = null
    
    // On vide le stockage pour déconnecter réellement
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  const updateUser = (userData) => {
    // Fusionne les anciennes données avec les nouvelles (ex: ajout téléphone)
    user.value = { ...user.value, ...userData }
    localStorage.setItem('user', JSON.stringify(user.value))
  }

  return {
    user,
    token,
    loading,
    isAuthenticated,
    userName,
    userEmail,
    login,
    logout,
    updateUser
  }
})