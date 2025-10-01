'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  login: (username: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is logged in on mount
    const authData = localStorage.getItem('admin-auth')
    if (authData) {
      const parsed = JSON.parse(authData)
      const now = new Date().getTime()
      // Session expires after 24 hours
      if (now - parsed.timestamp < 24 * 60 * 60 * 1000) {
        setIsAuthenticated(true)
      } else {
        localStorage.removeItem('admin-auth')
      }
    }
  }, [])

  const login = (username: string, password: string) => {
    const adminUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin'
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'password123'

    if (username === adminUsername && password === adminPassword) {
      const authData = {
        username,
        timestamp: new Date().getTime()
      }
      localStorage.setItem('admin-auth', JSON.stringify(authData))
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem('admin-auth')
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
