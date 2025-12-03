// client/src/stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {

  // ============================
  // STATE
  // ============================
  const user = ref(null)
  const token = ref(null)

  // ============================
  // GETTERS
  // ============================
  const isAuthenticated = computed(() => !!token.value)
  const userName = computed(() => user.value?.nom || "")
  const userEmail = computed(() => user.value?.email || "")

  // ============================
  // ACTIONS
  // ============================

  // 1) REGISTER
  const register = async (name, email, password, adresse) => {
    const res = await axios.post("http://localhost:3000/api/register", {
      name,
      email,
      password,
      adresse
    })
    return res.data
  }

  // 2) LOGIN
  const login = async (email, password) => {
    const res = await axios.post("http://localhost:3000/api/login", {
      email,
      password
    })

    token.value = res.data.token
    user.value = res.data.user

    localStorage.setItem("token", token.value)
    localStorage.setItem("user", JSON.stringify(user.value))

    return res.data
  }

  // Service axios autorisé
  const authHeader = () => {
    return {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    }
  }

  // 3) LOGOUT
  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }

  // 4) LOAD PROFILE
  const loadUserProfile = async () => {
    if (!token.value) return

    const res = await axios.get("http://localhost:3000/api/profile", authHeader())
    user.value = res.data.user
    localStorage.setItem("user", JSON.stringify(user.value))
  }

  // 5) UPDATE PROFILE
  const updateProfile = async (updates) => {
    await axios.put("http://localhost:3000/api/profile", updates, authHeader())
    Object.assign(user.value, updates)
    localStorage.setItem("user", JSON.stringify(user.value))
  }

  // 6) DELETE ACCOUNT
  const deleteAccount = async () => {
    await axios.delete("http://localhost:3000/api/delete", authHeader())
    logout()
  }

  // 7) GET USER ORDERS HISTORY
  const getUserOrders = async () => {
    const res = await axios.get("http://localhost:3000/api/orders", authHeader())
    return res.data.orders
  }

  // ============================
  // INIT AUTH AUTOMATIQUE AU DEMARRAGE
  // ============================
  const initAuth = () => {
    const savedUser = localStorage.getItem("user")
    const savedToken = localStorage.getItem("token")

    if (savedUser && savedToken) {
      token.value = savedToken
      user.value = JSON.parse(savedUser)
    }
  }

  initAuth()

  return {
    user,
    token,
    isAuthenticated,
    userName,
    userEmail,
    register,
    login,
    logout,
    loadUserProfile,
    updateProfile,
    deleteAccount,
    getUserOrders
  }
})
