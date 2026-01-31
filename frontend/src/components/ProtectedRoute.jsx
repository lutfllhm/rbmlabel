import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

const ProtectedRoute = ({ children, requiredApp, requiredRole }) => {
  const { user, hasPermission } = useAuthStore()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!hasPermission(requiredApp, requiredRole)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute