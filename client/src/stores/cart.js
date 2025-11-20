import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])

  // Computed properties
  const totalItems = computed(() => 
    items.value.reduce((total, item) => total + item.quantity, 0)
  )

  const totalPrice = computed(() =>
    items.value.reduce((total, item) => total + (item.price * item.quantity), 0)
  )

  const isInCart = (productId) => 
    items.value.some(item => item.id === productId)

  // Actions
  const addToCart = (product, quantity = 1, selectedOptions = {}) => {
    const existingItem = items.value.find(item => 
      item.id === product.id && 
      JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
    )

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      items.value.push({
        ...product,
        quantity,
        selectedOptions,
        addedAt: new Date().toISOString()
      })
    }
  }

  const removeFromCart = (itemId) => {
    items.value = items.value.filter(item => item.id !== itemId)
  }

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId)
      return
    }

    const item = items.value.find(item => item.id === itemId)
    if (item) {
      item.quantity = newQuantity
    }
  }

  const clearCart = () => {
    items.value = []
  }

  return {
    items,
    totalItems,
    totalPrice,
    isInCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  }
})