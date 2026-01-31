import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { Bell, Check, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNotificationStore } from '../stores/notificationStore'

const NotificationBell = () => {
  const location = useLocation()
  const notifMenuRef = useRef(null)
  
  // Get state and actions from store
  const {
    notifications,
    unreadCount,
    loading,
    useMockData,
    showDropdown,
    toggleDropdown,
    closeDropdown,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications
  } = useNotificationStore()

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target)) {
        closeDropdown()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [closeDropdown])

  // Fetch notifications on mount and poll every 30 seconds
  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(() => fetchNotifications(), 30000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  // Close dropdown when route changes
  useEffect(() => {
    closeDropdown()
  }, [location.pathname, closeDropdown])

  const handleMarkAsRead = async (notificationId) => {
    const result = await markAsRead(notificationId)
    if (!result.success && result.error) {
      toast.error(result.error)
    }
  }

  const handleMarkAllAsRead = async () => {
    const result = await markAllAsRead()
    if (result.success) {
      toast.success('Semua notifikasi ditandai sudah dibaca')
    } else if (result.error) {
      toast.error(result.error)
    }
  }

  const handleDeleteNotification = async (notificationId) => {
    const result = await deleteNotification(notificationId)
    if (result.success) {
      toast.success('Notifikasi dihapus')
    } else if (result.error) {
      toast.error(result.error)
    }
  }

  const handleClearAll = async () => {
    if (!confirm('Hapus semua notifikasi?')) return
    
    const result = await clearAllNotifications()
    if (result.success) {
      toast.success('Semua notifikasi dihapus')
    } else if (result.error) {
      toast.error(result.error)
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return '✅'
      case 'warning':
        return '⚠️'
      case 'error':
        return '❌'
      case 'info':
      default:
        return 'ℹ️'
    }
  }

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000)
    
    if (seconds < 60) return 'Baru saja'
    if (seconds < 3600) return `${Math.floor(seconds / 60)} menit yang lalu`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} jam yang lalu`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} hari yang lalu`
    
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="relative" ref={notifMenuRef}>
      <button
        onClick={toggleDropdown}
        className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
        title="Notifikasi"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] text-white items-center justify-center font-bold">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          </span>
        )}
      </button>

      {/* Notifications dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[600px] overflow-hidden flex flex-col animate-slide-up">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-semibold text-gray-900">
                  Notifikasi
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-red-500 text-white rounded-full">
                    {unreadCount}
                  </span>
                )}
                {useMockData && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-yellow-500 text-white rounded-full">
                    DEMO
                  </span>
                )}
              </div>
              <button
                onClick={closeDropdown}
                className="p-1 hover:bg-white rounded transition-colors"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
            
            {notifications.length > 0 && (
              <div className="flex items-center space-x-2 mt-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Tandai semua dibaca
                  </button>
                )}
                <button
                  onClick={handleClearAll}
                  className="text-xs text-red-600 hover:text-red-700 font-medium"
                >
                  Hapus semua
                </button>
              </div>
            )}
          </div>

          {/* Notifications list */}
          <div className="overflow-y-auto flex-1">
            {loading && notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Memuat notifikasi...</p>
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-xl flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatTimeAgo(notification.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1 flex-shrink-0">
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                          title="Tandai dibaca"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteNotification(notification.id)}
                        className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Bell className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-900">Tidak ada notifikasi</p>
                <p className="text-xs text-gray-500 mt-1">Anda akan menerima notifikasi di sini</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBell
