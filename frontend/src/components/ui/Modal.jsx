import { X } from 'lucide-react'
import { useEffect } from 'react'
import Card from './Card'

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true 
}) => {
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-7xl'
  }

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
      
      {/* Modal Container - Centered with padding */}
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Modal */}
        <div 
          className={`relative w-full ${sizes[size]} my-8 animate-slide-up`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white dark:bg-slate-800 border-8 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] overflow-hidden max-h-[90vh] flex flex-col -rotate-1">
            {/* Header - Fixed */}
            <div className="flex items-center justify-between p-6 border-b-4 border-black bg-gradient-to-r from-yellow-300 to-pink-300 dark:from-slate-700 dark:to-slate-600 flex-shrink-0">
              <h2 className="text-2xl font-black uppercase text-black dark:text-white">
                {title}
              </h2>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-2 border-4 border-black bg-red-500 text-white hover:bg-red-600 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] rotate-3"
                >
                  <X className="h-5 w-5" strokeWidth={3} />
                </button>
              )}
            </div>
            
            {/* Content - Scrollable */}
            <div className="p-6 overflow-y-auto flex-1 bg-white dark:bg-slate-800">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal
