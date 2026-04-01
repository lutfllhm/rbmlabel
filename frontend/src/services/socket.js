import { io } from 'socket.io-client'

class SocketService {
  constructor() {
    this.socket = null
    this.listeners = new Map()
  }

  connect(token) {
    if (this.socket?.connected) {
      return this.socket
    }

    const serverUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    
    this.socket = io(serverUrl, {
      auth: {
        token
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    })

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.id)
    })

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason)
    })

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
    })

    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.listeners.clear()
    }
  }

  joinRoom(room) {
    if (this.socket?.connected) {
      this.socket.emit('join-room', room)
      console.log(`Joined room: ${room}`)
    }
  }

  leaveRoom(room) {
    if (this.socket?.connected) {
      this.socket.emit('leave-room', room)
      console.log(`Left room: ${room}`)
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback)
      
      // Store listener for cleanup
      if (!this.listeners.has(event)) {
        this.listeners.set(event, [])
      }
      this.listeners.get(event).push(callback)
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback)
      
      // Remove from stored listeners
      if (this.listeners.has(event)) {
        const callbacks = this.listeners.get(event)
        const index = callbacks.indexOf(callback)
        if (index > -1) {
          callbacks.splice(index, 1)
        }
      }
    }
  }

  emit(event, data) {
    if (this.socket?.connected) {
      this.socket.emit(event, data)
    }
  }

  isConnected() {
    return this.socket?.connected || false
  }
}

// Export singleton instance
export const socketService = new SocketService()
export default socketService
