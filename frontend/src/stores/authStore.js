import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../services/api'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      
      login: async (credentials) => {
        set({ isLoading: true })
        try {
          const response = await api.post('/auth/login', credentials)
          const { token, user } = response.data
          
          set({ user, token, isLoading: false })
          
          // Set token in api headers
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
          
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          return { 
            success: false, 
            error: error.response?.data?.error || 'Login failed' 
          }
        }
      },
      
      logout: () => {
        set({ user: null, token: null })
        delete api.defaults.headers.common['Authorization']
      },
      
      checkAuth: async () => {
        const { token } = get()
        if (!token) return
        
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
          const response = await api.get('/auth/me')
          set({ user: response.data.user })
        } catch (error) {
          // Token is invalid, clear auth state
          set({ user: null, token: null })
          delete api.defaults.headers.common['Authorization']
        }
      },
      
      hasPermission: (requiredApp, requiredRole = null) => {
        const { user } = get()
        if (!user) return false
        
        // Check app access
        if (requiredApp && user.app !== requiredApp) return false
        
        // Check role access
        if (requiredRole && user.role !== requiredRole) return false
        
        return true
      }
    }),
    {
      name: 'rbm-auth',
      partialize: (state) => ({ 
        token: state.token,
        user: state.user 
      }),
    }
  )
)