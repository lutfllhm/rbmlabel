import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { AlertCircle, AlertTriangle, Bell, Check, CheckCircle2, Info, Trash2, X } from 'lucide-react'
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
    const iconClassName = 'h-5 w-5 text-black dark:text-white'
    switch (type) {
      case 'success':
        return <CheckCircle2 className={iconClassName} strokeWidth={3} />
      case 'warning':
        return <AlertTriangle className={iconClassName} strokeWidth={3} />
      case 'error':
        return <AlertCircle className={iconClassName} strokeWidth={3} />
      case 'info':
      default:
        return <Info className={iconClassName} strokeWidth={3} />
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
        className="relative p-3 border-4 border-black bg-white dark:bg-slate-800 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        title="Notifikasi"
      >
        <Bell className="h-5 w-5 text-black dark:text-white" strokeWidth={3} />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full bg-red-500 border-2 border-black"></span>
            <span className="relative inline-flex h-6 w-6 bg-red-500 text-[10px] text-white items-center justify-center font-black border-2 border-black">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          </span>
        )}
      </button>

      {/* Notifications dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] z-50 max-h-[600px] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 border-b-4 border-black bg-gradient-to-r from-yellow-300 to-pink-300 dark:from-slate-700 dark:to-slate-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-black dark:text-white" strokeWidth={3} />
                <h3 className="text-sm font-black uppercase text-black dark:text-white">
                  Notifikasi
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-1 text-xs font-black bg-red-500 text-white border-2 border-black">
                    {unreadCount}
                  </span>
                )}
                {useMockData && (
                  <span className="px-2 py-1 text-xs font-black bg-yellow-500 text-black border-2 border-black">
                    DEMO
                  </span>
                )}
              </div>
              <button
                onClick={closeDropdown}
                className="p-1 border-2 border-black bg-red-500 hover:bg-red-600 transition-colors"
              >
                <X className="h-4 w-4 text-white" strokeWidth={3} />
              </button>
            </div>
            
            {notifications.length > 0 && (
              <div className="flex items-center space-x-3 mt-3">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-black dark:text-white hover:underline font-black uppercase"
                  >
                    Tandai semua dibaca
                  </button>
                )}
                <button
                  onClick={handleClearAll}
                  className="text-xs text-black dark:text-white hover:underline font-black uppercase"
                >
                  Hapus semua
                </button>
              </div>
            )}
          </div>

          {/* Notifications list */}
          <div className="overflow-y-auto flex-1 bg-white dark:bg-slate-800">
            {loading && notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-black border-t-transparent mx-auto"></div>
                <p className="text-sm font-bold text-black dark:text-white mt-2">Memuat notifikasi...</p>
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 border-b-2 border-black hover:bg-yellow-200 dark:hover:bg-slate-700 transition-colors ${
                    !notification.read ? 'bg-blue-300 dark:bg-blue-900/30 border-l-8 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <span className="w-9 h-9 border-2 border-black bg-white dark:bg-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!notification.read ? 'font-black text-black dark:text-white' : 'font-bold text-black/70 dark:text-white/70'}`}>
                        {notification.title}
                      </p>
                      <p className="text-xs font-bold text-black/70 dark:text-white/70 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs font-bold text-black/50 dark:text-white/50 mt-1">
                        {formatTimeAgo(notification.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1 flex-shrink-0">
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-1.5 border-2 border-black bg-blue-300 hover:bg-blue-400 transition-colors"
                          title="Tandai dibaca"
                        >
                          <Check className="h-3.5 w-3.5 text-black" strokeWidth={3} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteNotification(notification.id)}
                        className="p-1.5 border-2 border-black bg-red-500 hover:bg-red-600 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-12 text-center">
                <div className="w-20 h-20 bg-yellow-300 dark:bg-slate-700 border-4 border-black flex items-center justify-center mx-auto mb-4">
                  <Bell className="h-10 w-10 text-black dark:text-white" strokeWidth={3} />
                </div>
                <p className="text-sm font-black uppercase text-black dark:text-white">Tidak ada notifikasi</p>
                <p className="text-xs font-bold text-black/70 dark:text-white/70 mt-1">Anda akan menerima notifikasi di sini</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBell
