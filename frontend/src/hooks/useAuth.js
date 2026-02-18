 import { useAuthStore } from '../stores/authStore'
import api from '../services/api'
import toast from 'react-hot-toast'

export const useAuth = () => {
  const { login, logout, user, isAuthenticated } = useAuthStore()

  const handleLogin = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials)
      const { user, token } = response.data
      login(user, token)
      toast.success('Login berhasil!')
      return true
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login gagal')
      return false
    }
  }

  const handleLogout = () => {
    logout()
    toast.success('Logout berhasil')
  }

  return {
    user,
    isAuthenticated,
    login: handleLogin,
    logout: handleLogout,
  }
}
