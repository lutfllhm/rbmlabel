import axios from 'axios'
import toast from 'react-hot-toast'

// Use environment variable for API URL
// In production, VITE_API_URL MUST be set to backend service URL
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

console.log('API Base URL:', baseURL)
console.log('Environment:', import.meta.env.MODE)

const api = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const authStore = JSON.parse(localStorage.getItem('rbm-auth') || '{}')
    const token = authStore.state?.token
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const message = error.response?.data?.error || error.response?.data?.message || error.message || 'Terjadi kesalahan'
    const method = error.config?.method?.toUpperCase()
    const url = error.config?.url || ''
    
    // Don't show toast for:
    // - Auth errors (handled by components)
    // - GET requests that fail (let components handle display)
    // - 404 on notifications endpoint (endpoint might not exist yet)
    const isNotificationEndpoint = url.includes('/notifications')
    const is404 = error.response?.status === 404
    const isAuthError = error.response?.status === 401 || error.response?.status === 403
    const isGetRequest = method === 'GET'
    
    // Only show toast for write operations (POST, PUT, DELETE) that fail
    // This prevents annoying toasts when fetching data from endpoints that don't exist yet
    if (!isAuthError && !isGetRequest && !(isNotificationEndpoint && is404)) {
      toast.error(message)
    }
    
    // Log errors for debugging
    if (!isAuthError && !(isNotificationEndpoint && is404)) {
      console.error(`API Error [${method} ${url}]:`, message)
    }
    
    // If token expired, redirect to login
    if (error.response?.status === 401) {
      const authStore = JSON.parse(localStorage.getItem('rbm-auth') || '{}')
      if (authStore.state?.token) {
        localStorage.removeItem('rbm-auth')
        window.location.href = '/login'
        toast.error('Sesi Anda telah berakhir. Silakan login kembali.')
      }
    }
    
    return Promise.reject(error)
  }
)

export default api