import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AlertCircle, AlertTriangle, Bell, Check, CheckCircle2, Info, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNotificationStore } from '../stores/notificationStore'

const NotificationBell = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const notifMenuRef = useRef(null)
  const [activeTab, setActiveTab] = useState('all') // 'all' | 'unread'
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all') // all | info | success | warning | error
  const [pageSize, setPageSize] = useState(20)
  const pendingDeleteTimersRef = useRef(new Map())
  
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
    removeNotificationLocal,
    restoreNotificationLocal,
    currentApp,
    toastEnabled,
    mutedToastTypes,
    mutedToastApps,
    toggleToastEnabled,
    toggleMutedToastType,
    toggleMutedToastApp,
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

  useEffect(() => {
    return () => {
      pendingDeleteTimersRef.current.forEach((timerId) => clearTimeout(timerId))
      pendingDeleteTimersRef.current.clear()
    }
  }, [])

  // Close dropdown when route changes
  useEffect(() => {
    closeDropdown()
  }, [location.pathname, closeDropdown])

  useEffect(() => {
    setPageSize(20)
  }, [activeTab, query, typeFilter])

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

  const handleDeleteNotification = (notificationId) => {
    const existingTimer = pendingDeleteTimersRef.current.get(notificationId)
    if (existingTimer) {
      clearTimeout(existingTimer)
      pendingDeleteTimersRef.current.delete(notificationId)
    }

    const { notifications: currentNotifs } = useNotificationStore.getState()
    const deletedNotif = currentNotifs.find((n) => n.id === notificationId)
    if (!deletedNotif) return
    const deletedIndex = currentNotifs.findIndex((n) => n.id === notificationId)

    // Optimistic remove
    removeNotificationLocal(notificationId)

    // Undo toast
    const toastId = toast(
      (t) => (
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900">Notifikasi dihapus</p>
            <p className="truncate text-xs text-slate-600">{deletedNotif.title}</p>
          </div>
          <button
            type="button"
            className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
            onClick={() => {
              const timer = pendingDeleteTimersRef.current.get(notificationId)
              if (timer) clearTimeout(timer)
              pendingDeleteTimersRef.current.delete(notificationId)
              restoreNotificationLocal(deletedNotif, deletedIndex)
              toast.dismiss(t.id)
              toast.success('Dibatalkan')
            }}
          >
            Undo
          </button>
        </div>
      ),
      { duration: 5000 }
    )

    // Finalize delete after grace period
    const timerId = setTimeout(async () => {
      pendingDeleteTimersRef.current.delete(notificationId)
      const result = await deleteNotification(notificationId)
      if (!result.success && result.error) {
        // Restore if server delete failed
        restoreNotificationLocal(deletedNotif, deletedIndex)
        toast.error(result.error)
      }
      toast.dismiss(toastId)
    }, 5200)

    pendingDeleteTimersRef.current.set(notificationId, timerId)
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

  const getDayBucketLabel = (isoDate) => {
    const d = new Date(isoDate)
    if (Number.isNaN(d.getTime())) return 'Lainnya'

    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfThatDay = new Date(d.getFullYear(), d.getMonth(), d.getDate())
    const diffDays = Math.floor((startOfToday - startOfThatDay) / (24 * 60 * 60 * 1000))

    if (diffDays === 0) return 'Hari ini'
    if (diffDays === 1) return 'Kemarin'
    if (diffDays > 1 && diffDays < 7) return 'Minggu ini'

    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const visibleNotifications = useMemo(() => {
    let list = notifications

    if (activeTab === 'unread') list = list.filter((n) => !n.read)
    if (typeFilter !== 'all') list = list.filter((n) => (n.type || 'info') === typeFilter)

    const q = query.trim().toLowerCase()
    if (q) {
      list = list.filter((n) => {
        const title = (n.title || '').toString().toLowerCase()
        const msg = (n.message || '').toString().toLowerCase()
        return title.includes(q) || msg.includes(q)
      })
    }

    return list
  }, [activeTab, notifications, query, typeFilter])

  const groupedNotifications = useMemo(() => {
    const groups = new Map()
    const limited = visibleNotifications.slice(0, pageSize)
    limited.forEach((n) => {
      const key = getDayBucketLabel(n.created_at)
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key).push(n)
    })

    const ordering = ['Hari ini', 'Kemarin', 'Minggu ini']
    const entries = Array.from(groups.entries())
    entries.sort(([a], [b]) => {
      const ia = ordering.indexOf(a)
      const ib = ordering.indexOf(b)
      if (ia !== -1 || ib !== -1) {
        if (ia === -1) return 1
        if (ib === -1) return -1
        return ia - ib
      }
      return 0
    })

    return entries
  }, [pageSize, visibleNotifications])

  const canLoadMore = visibleNotifications.length > pageSize

  const resolveNotificationTarget = (notification) => {
    const raw = notification?.path || notification?.url || notification?.href || notification?.link
    if (!raw || typeof raw !== 'string') return null
    return raw
  }

  const handleOpenNotification = async (notification) => {
    const target = resolveNotificationTarget(notification)
    if (!target) return

    if (!notification.read) {
      await handleMarkAsRead(notification.id)
    }

    closeDropdown()

    if (/^https?:\/\//i.test(target)) {
      window.open(target, '_blank', 'noopener,noreferrer')
      return
    }

    navigate(target)
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
        <div className="fixed inset-x-3 bottom-3 z-50 flex max-h-[80vh] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900 sm:absolute sm:inset-x-auto sm:bottom-auto sm:right-0 sm:mt-2 sm:max-h-[min(600px,80vh)] sm:w-96">
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
                aria-label="Tutup notifikasi"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>

            {notifications.length > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    activeTab === 'all'
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  Semua
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('unread')}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    activeTab === 'unread'
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  Belum dibaca
                </button>
              </div>
            )}

            {notifications.length > 0 && (
              <div className="mt-3 space-y-2">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari notifikasi…"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-material-400 focus:ring-2 focus:ring-material-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-material-600 dark:focus:ring-material-950/40"
                  aria-label="Cari notifikasi"
                />

                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'all', label: 'Semua' },
                    { key: 'info', label: 'Info' },
                    { key: 'success', label: 'Sukses' },
                    { key: 'warning', label: 'Peringatan' },
                    { key: 'error', label: 'Error' }
                  ].map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => setTypeFilter(t.key)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                        typeFilter === t.key
                          ? 'bg-material-600 text-white dark:bg-material-500'
                          : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

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

            <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3 text-xs dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">Toast notifikasi</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Mengatur pop-up realtime</p>
                </div>
                <button
                  type="button"
                  onClick={toggleToastEnabled}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    toastEnabled ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {toastEnabled ? 'ON' : 'OFF'}
                </button>
              </div>

              <div className="mt-2 flex flex-wrap gap-2">
                {[
                  { key: 'info', label: 'Info' },
                  { key: 'success', label: 'Sukses' },
                  { key: 'warning', label: 'Peringatan' },
                  { key: 'error', label: 'Error' }
                ].map((t) => {
                  const muted = mutedToastTypes.includes(t.key)
                  return (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => toggleMutedToastType(t.key)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                        muted
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                      }`}
                      title={muted ? 'Toast tipe ini dimute' : 'Klik untuk mute toast tipe ini'}
                    >
                      {muted ? `Mute ${t.label}` : t.label}
                    </button>
                  )
                })}
              </div>

              {currentApp && (
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => toggleMutedToastApp(currentApp)}
                    className={`w-full rounded-lg px-3 py-2 text-left text-xs font-semibold transition ${
                      mutedToastApps.includes(currentApp)
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {mutedToastApps.includes(currentApp) ? `Senyap untuk app "${currentApp}"` : `Senyapkan toast untuk app "${currentApp}"`}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-900">
            {loading && notifications.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-material-600 dark:border-slate-700" />
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Memuat notifikasi…</p>
              </div>
            ) : visibleNotifications.length > 0 ? (
              <>
                <div className="border-b border-slate-100 px-4 py-2 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  Menampilkan <span className="font-semibold text-slate-700 dark:text-slate-200">{Math.min(pageSize, visibleNotifications.length)}</span> dari{' '}
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{visibleNotifications.length}</span>
                </div>

                {groupedNotifications.map(([groupLabel, groupItems]) => (
                  <div key={groupLabel}>
                    <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/95 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 dark:text-slate-400">
                      {groupLabel}
                    </div>
                    {groupItems.map((notification) => {
                      const target = resolveNotificationTarget(notification)
                      return (
                        <div
                          key={notification.id}
                          role={target ? 'button' : undefined}
                          tabIndex={target ? 0 : undefined}
                          onClick={target ? () => handleOpenNotification(notification) : undefined}
                          onKeyDown={
                            target
                              ? (e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault()
                                    handleOpenNotification(notification)
                                  }
                                }
                              : undefined
                          }
                          className={`border-b border-slate-100 px-4 py-3 transition-colors dark:border-slate-800 ${
                            target ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                          } ${!notification.read ? 'bg-material-50/80 dark:bg-material-950/20' : ''}`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                              {getNotificationIcon(notification.type)}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <p
                                  className={`text-sm ${
                                    !notification.read ? 'font-semibold text-slate-900 dark:text-white' : 'font-medium text-slate-600 dark:text-slate-400'
                                  }`}
                                >
                                  {notification.title}
                                </p>
                                {!notification.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-material-500" aria-label="Belum dibaca" />}
                              </div>
                              <p className="mt-0.5 line-clamp-2 text-xs text-slate-500 dark:text-slate-500">{notification.message}</p>
                              <p className="mt-1 text-xs text-slate-400">{formatTimeAgo(notification.created_at)}</p>
                            </div>
                            <div className="flex shrink-0 gap-1">
                              {!notification.read && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleMarkAsRead(notification.id)
                                  }}
                                  className="rounded-lg p-1.5 text-material-600 transition hover:bg-material-100 dark:text-material-400 dark:hover:bg-material-950/40"
                                  title="Tandai dibaca"
                                  aria-label="Tandai dibaca"
                                >
                                  <Check className="h-4 w-4" strokeWidth={2} />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteNotification(notification.id)
                                }}
                                className="rounded-lg p-1.5 text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950/30"
                                title="Hapus"
                                aria-label="Hapus"
                              >
                                <Trash2 className="h-4 w-4" strokeWidth={2} />
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ))}

                {canLoadMore && (
                  <div className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setPageSize((s) => Math.min(s + 20, visibleNotifications.length))}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      Muat lebih banyak
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="px-4 py-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                  <Bell className="h-8 w-8 text-slate-400" strokeWidth={2} />
                </div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {activeTab === 'unread' ? 'Tidak ada notifikasi belum dibaca' : 'Tidak ada notifikasi'}
                </p>
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
