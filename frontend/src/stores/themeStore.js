import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useThemeStore = create(
  persist(
    (set) => ({
      isDarkMode: false,
      
      toggleDarkMode: () => {
        set((state) => {
          const newMode = !state.isDarkMode
          // Update document class
          if (newMode) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
          return { isDarkMode: newMode }
        })
      },
      
      setDarkMode: (isDark) => {
        set({ isDarkMode: isDark })
        if (isDark) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      },
      
      initTheme: () => {
        const stored = localStorage.getItem('rbm-theme')
        if (stored) {
          const { state } = JSON.parse(stored)
          if (state.isDarkMode) {
            document.documentElement.classList.add('dark')
          }
        }
      }
    }),
    {
      name: 'rbm-theme',
      partialize: (state) => ({ isDarkMode: state.isDarkMode })
    }
  )
)
