'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  email: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  logout: () => void
  /** ログイン時はメール、未ログイン時は 'trial-user' */
  userId: string
}

const AuthContext = createContext<AuthContextType | null>(null)

const STORAGE_KEY = 'aihen_auth_user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, _password: string) => {
    // TODO: バックエンド認証APIができたら差し替え
    const u: User = { email }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
    setUser(u)
  }

  const signup = async (email: string, _password: string) => {
    // TODO: バックエンド認証APIができたら差し替え
    const u: User = { email }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
    setUser(u)
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  const userId = user ? user.email : 'trial-user'

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, userId }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
