import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../services/api'
import { mockNotifications } from '../utils/mockNotifications'

export const useNotificationStore = create(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      loading: false,
      useMockData: false,
      lastFetch: null,
      showDropdown: false,

      // Toggle dropdown visibility
      toggleDropdown: () => {
        set((state) => ({ showDropdown: !state.showDropdown }))
      },

      // Close dropdown
      closeDropdown: () => {
        set({ showDropdown: false })
      },

      // Fetch notifications from API
      fetchNotifications: async (force = false) => {
        const { lastFetch } = get()
        
        // Don't fetch if already fetched in last 30 seconds (unless forced)
        if (!force && lastFetch && Date.now() - lastFetch < 30000) {
          return
        }

        set({ loading: true })
        
        try {
          const response = await api.get('/notifications')
          const notifications = response.data || []
          
          set({
            notifications,
            unreadCount: notifications.filter(n => !n.read).length,
            useMockData: false,
            loading: false,
            lastFetch: Date.now()
          })
        } catch (error) {
          // Silently handle 404 - use mock data if endpoint not available
          if (error.response?.status === 404) {
            console.log('Notifications endpoint not available, using mock data')
            set({
              notifications: mockNotifications,
              unreadCount: mockNotifications.filter(n => !n.read).length,
              useMockData: true,
              loading: false,
              lastFetch: Date.now()
            })
          } else {
            console.error('Failed to fetch notifications:', error)
            set({
              notifications: [],
              unreadCount: 0,
              loading: false,
              lastFetch: Date.now()
            })
          }
        }
      },

      // Mark single notification as read
      markAsRead: async (notificationId) => {
        const { notifications, useMockData } = get()

        if (useMockData) {
          // Handle mock data locally
          const updatedNotifications = notifications.map(n =>
            n.id === notificationId ? { ...n, read: true } : n
          )
          set({
            notifications: updatedNotifications,
            unreadCount: updatedNotifications.filter(n => !n.read).length
          })
          return { success: true }
        }

        try {
          await api.put(`/notifications/${notificationId}/read`)
          const updatedNotifications = notifications.map(n =>
            n.id === notificationId ? { ...n, read: true } : n
          )
          set({
            notifications: updatedNotifications,
            unreadCount: updatedNotifications.filter(n => !n.read).length
          })
          return { success: true }
        } catch (error) {
          if (error.response?.status !== 404) {
            console.error('Failed to mark notification as read:', error)
            return { success: false, error: 'Gagal menandai notifikasi' }
          }
          return { success: true }
        }
      },

      // Mark all notifications as read
      markAllAsRead: async () => {
        const { notifications, useMockData } = get()

        if (useMockData) {
          // Handle mock data locally
          const updatedNotifications = notifications.map(n => ({ ...n, read: true }))
          set({
            notifications: updatedNotifications,
            unreadCount: 0
          })
          return { success: true }
        }

        try {
          await api.put('/notifications/read-all')
          const updatedNotifications = notifications.map(n => ({ ...n, read: true }))
          set({
            notifications: updatedNotifications,
            unreadCount: 0
          })
          return { success: true }
        } catch (error) {
          if (error.response?.status !== 404) {
            console.error('Failed to mark all as read:', error)
            return { success: false, error: 'Gagal menandai notifikasi' }
          }
          return { success: true }
        }
      },

      // Delete single notification
      deleteNotification: async (notificationId) => {
        const { notifications, useMockData } = get()

        if (useMockData) {
          // Handle mock data locally
          const deletedNotif = notifications.find(n => n.id === notificationId)
          const updatedNotifications = notifications.filter(n => n.id !== notificationId)
          set({
            notifications: updatedNotifications,
            unreadCount: updatedNotifications.filter(n => !n.read).length
          })
          return { success: true }
        }

        try {
          await api.delete(`/notifications/${notificationId}`)
          const deletedNotif = notifications.find(n => n.id === notificationId)
          const updatedNotifications = notifications.filter(n => n.id !== notificationId)
          set({
            notifications: updatedNotifications,
            unreadCount: updatedNotifications.filter(n => !n.read).length
          })
          return { success: true }
        } catch (error) {
          if (error.response?.status !== 404) {
            console.error('Failed to delete notification:', error)
            return { success: false, error: 'Gagal menghapus notifikasi' }
          }
          return { success: true }
        }
      },

      // Clear all notifications
      clearAllNotifications: async () => {
        const { useMockData } = get()

        if (useMockData) {
          // Handle mock data locally
          set({
            notifications: [],
            unreadCount: 0
          })
          return { success: true }
        }

        try {
          await api.delete('/notifications/clear-all')
          set({
            notifications: [],
            unreadCount: 0
          })
          return { success: true }
        } catch (error) {
          if (error.response?.status !== 404) {
            console.error('Failed to clear notifications:', error)
            return { success: false, error: 'Gagal menghapus notifikasi' }
          }
          return { success: true }
        }
      }
    }),
    {
      name: 'rbm-notifications',
      partialize: (state) => ({
        notifications: state.notifications,
        unreadCount: state.unreadCount,
        useMockData: state.useMockData,
        lastFetch: state.lastFetch
      })
    }
  )
)
