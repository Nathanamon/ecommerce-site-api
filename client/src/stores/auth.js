import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(null)
  const loading = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const userName = computed(() => user.value?.nom || '')
  const userEmail = computed(() => user.value?.email || '')

  // Actions
  const login = (userData, authToken) => {
    user.value = userData
    token.value = authToken
    
    // Sauvegarder dans le localStorage
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', authToken)
  }

  const logout = () => {
    user.value = null
    token.value = null
    
    // Supprimer du localStorage
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  const initAuth = () => {
    // Récupérer depuis le localStorage au démarrage
    const savedUser = localStorage.getItem('user')
    const savedToken = localStorage.getItem('token')
    
    if (savedUser && savedToken) {
      user.value = JSON.parse(savedUser)
      token.value = savedToken
    }
  }

  const updateUser = (userData) => {
    user.value = { ...user.value, ...userData }
    localStorage.setItem('user', JSON.stringify(user.value))
  }

  // Initialiser au chargement
  initAuth()

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