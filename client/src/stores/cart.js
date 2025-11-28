import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref([])

  // Getters
  const itemCount = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })

  const subtotal = computed(() => {
    return items.value.reduce((total, item) => {
      return total + (item.product.price * item.quantity)
    }, 0)
  })

  const total = computed(() => {
    // Sous-total + TVA (20%)
    return subtotal.value * 1.2
  })

  // Actions
  const addToCart = (product, quantity = 1, options = {}) => {
    // Vérifier si le produit existe déjà dans le panier
    const existingItem = items.value.find(item => {
      return item.product.id === product.id && 
             JSON.stringify(item.options) === JSON.stringify(options)
    })

    if (existingItem) {
      // Si le produit existe, augmenter la quantité
      existingItem.quantity += quantity
    } else {
      // Sinon, ajouter un nouvel item
      items.value.push({
        id: Date.now(), // ID unique basé sur le timestamp
        product: product,
        quantity: quantity,
        options: options
      })
    }

    // Sauvegarder dans le localStorage
    saveToStorage()
  }

  const removeFromCart = (itemId) => {
    items.value = items.value.filter(item => item.id !== itemId)
    saveToStorage()
  }

  const increaseQuantity = (itemId) => {
    const item = items.value.find(i => i.id === itemId)
    if (item && item.quantity < item.product.stock) {
      item.quantity++
      saveToStorage()
    }
  }

  const decreaseQuantity = (itemId) => {
    const item = items.value.find(i => i.id === itemId)
    if (item) {
      if (item.quantity > 1) {
        item.quantity--
        saveToStorage()
      } else {
        removeFromCart(itemId)
      }
    }
  }

  const updateQuantity = (itemId, quantity) => {
    const item = items.value.find(i => i.id === itemId)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(itemId)
      } else if (quantity <= item.product.stock) {
        item.quantity = quantity
        saveToStorage()
      }
    }
  }

  const clearCart = () => {
    items.value = []
    saveToStorage()
  }

  const saveToStorage = () => {
    localStorage.setItem('cart', JSON.stringify(items.value))
  }

  const loadFromStorage = () => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        items.value = JSON.parse(savedCart)
      } catch (e) {
        console.error('Erreur lors du chargement du panier:', e)
        items.value = []
      }
    }
  }

  // Charger le panier au démarrage
  loadFromStorage()

  return {
    items,
    itemCount,
    subtotal,
    total,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    updateQuantity,
    clearCart
  }
})