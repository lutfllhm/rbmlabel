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
    const iconClassName = 'h-5 w-5 text-slate-600 dark:text-slate-300'
    switch (type) {
      case 'success':
        return <CheckCircle2 className={iconClassName} strokeWidth={2} />
      case 'warning':
        return <AlertTriangle className={iconClassName} strokeWidth={2} />
      case 'error':
        return <AlertCircle className={iconClassName} strokeWidth={2} />
      case 'info':
      default:
        return <Info className={iconClassName} strokeWidth={2} />
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
        type="button"
        onClick={toggleDropdown}
        className="relative rounded-xl border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        title="Notifikasi"
      >
        <Bell className="h-5 w-5" strokeWidth={2} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 z-50 mt-2 flex max-h-[min(600px,80vh)] w-80 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900 sm:w-96">
          <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/50">
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <Bell className="h-5 w-5 shrink-0 text-slate-600 dark:text-slate-400" strokeWidth={2} />
                <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-white">Notifikasi</h3>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-950/50 dark:text-red-300">
                    {unreadCount}
                  </span>
                )}
                {useMockData && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                    Demo
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={closeDropdown}
                className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>

            {notifications.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-3 text-xs font-medium">
                {unreadCount > 0 && (
                  <button type="button" onClick={handleMarkAllAsRead} className="text-material-600 hover:underline dark:text-material-400">
                    Tandai semua dibaca
                  </button>
                )}
                <button type="button" onClick={handleClearAll} className="text-red-600 hover:underline dark:text-red-400">
                  Hapus semua
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-900">
            {loading && notifications.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-material-600 dark:border-slate-700" />
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Memuat notifikasi…</p>
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`border-b border-slate-100 px-4 py-3 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50 ${
                    !notification.read ? 'bg-material-50/80 dark:bg-material-950/20' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm ${!notification.read ? 'font-semibold text-slate-900 dark:text-white' : 'font-medium text-slate-600 dark:text-slate-400'}`}
                      >
                        {notification.title}
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-xs text-slate-500 dark:text-slate-500">{notification.message}</p>
                      <p className="mt-1 text-xs text-slate-400">{formatTimeAgo(notification.created_at)}</p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      {!notification.read && (
                        <button
                          type="button"
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="rounded-lg p-1.5 text-material-600 transition hover:bg-material-100 dark:text-material-400 dark:hover:bg-material-950/40"
                          title="Tandai dibaca"
                        >
                          <Check className="h-4 w-4" strokeWidth={2} />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteNotification(notification.id)}
                        className="rounded-lg p-1.5 text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950/30"
                        title="Hapus"
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                  <Bell className="h-8 w-8 text-slate-400" strokeWidth={2} />
                </div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Tidak ada notifikasi</p>
                <p className="mt-1 text-xs text-slate-500">Notifikasi akan muncul di sini</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBell
