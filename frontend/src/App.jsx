import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import { useThemeStore } from './stores/themeStore'
import { useEffect } from 'react'

// Pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import MaterialApp from './pages/apps/MaterialApp'
import StoklabelApp from './pages/apps/StoklabelApp'
import LpsApp from './pages/apps/LpsApp'

// Components
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const { user, checkAuth, isLoading } = useAuthStore()
  const { initTheme } = useThemeStore()

  useEffect(() => {
    checkAuth()
    initTheme() // Initialize theme on app load
  }, [checkAuth, initTheme])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 dark:border-primary-400"></div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      
      {/* Protected App Routes - ModernLayout is now inside each App component */}
      <Route 
        path="/apps/material/*" 
        element={
          <ProtectedRoute requiredApp="material">
            <MaterialApp />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/apps/stoklabel/*" 
        element={
          <ProtectedRoute requiredApp="stoklabel">
            <StoklabelApp />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/apps/lps/*" 
        element={
          <ProtectedRoute requiredApp="lps">
            <LpsApp />
          </ProtectedRoute>
        } 
      />
      
      {/* Redirect /apps to home */}
      <Route path="/apps" element={<Navigate to="/" replace />} />
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App