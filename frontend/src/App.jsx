import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import { useThemeStore } from './stores/themeStore'
import { useNotificationStore } from './stores/notificationStore'
import { useEffect } from 'react'

// Pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import MaterialApp from './pages/apps/MaterialApp'
import StoklabelApp from './pages/apps/StoklabelApp'
import LpsApp from './pages/apps/LpsApp'

// Components
import ProtectedRoute from './components/ProtectedRoute'

const getPageTitle = (pathname) => {
  const normalizedPath = pathname.toLowerCase()
  const baseTitle = 'RBM'

  if (normalizedPath === '/' || normalizedPath === '/login') {
    return `${baseTitle} | Label Production`
  }

  const appConfig = {
    material: {
      name: 'Material Management',
      routes: {
        dashboard: 'Dashboard',
        stock: 'Stock',
        categories: 'Kategori',
        labels: 'Labels',
        spk: 'SPK',
        reports: 'Laporan',
        users: 'Pengguna',
        settings: 'Pengaturan',
      },
    },
    stoklabel: {
      name: 'Stock Label',
      routes: {
        dashboard: 'Dashboard',
        stock: 'Stock',
        masuk: 'Label Masuk',
        keluar: 'Label Keluar',
        'surat-jalan': 'Surat Jalan',
        reports: 'Laporan',
        users: 'Pengguna',
        settings: 'Pengaturan',
      },
    },
    lps: {
      name: 'LPS Production',
      routes: {
        dashboard: 'Dashboard',
        list: 'Daftar LPS',
        create: 'Buat LPS',
        finish: 'Selesai',
        reports: 'Laporan',
        users: 'Pengguna',
        settings: 'Pengaturan',
      },
    },
  }

  const pathParts = normalizedPath.split('/').filter(Boolean)
  if (pathParts[0] !== 'apps' || !pathParts[1]) {
    return `${baseTitle} | Label Production`
  }

  const appKey = pathParts[1]
  const app = appConfig[appKey]
  if (!app) {
    return `${baseTitle} | Label Production`
  }

  const pageKey = pathParts[2]
  const pageName = app.routes[pageKey] || 'Dashboard'

  return `${baseTitle} | ${app.name} - ${pageName}`
}

function App() {
  const { user, checkAuth, isLoading } = useAuthStore()
  const { initTheme } = useThemeStore()
  const { initializeSocket, disconnectSocket } = useNotificationStore()
  const location = useLocation()

  useEffect(() => {
    checkAuth()
    initTheme() // Initialize theme on app load
  }, [checkAuth, initTheme])

  // Initialize Socket.io when user is authenticated
  useEffect(() => {
    if (user?.id && user?.app) {
      console.log('🔌 Initializing Socket.io for user:', user.id)
      initializeSocket(user.id, user.app)
    }

    // Cleanup on unmount or user logout
    return () => {
      if (user) {
        disconnectSocket()
      }
    }
  }, [user?.id, user?.app, initializeSocket, disconnectSocket])

  useEffect(() => {
    document.title = getPageTitle(location.pathname)
  }, [location.pathname])

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