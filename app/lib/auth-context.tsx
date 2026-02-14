'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import {
  signIn,
  signUp,
  confirmSignUp,
  signOut,
  deleteUser,
  getCurrentUser,
  fetchUserAttributes,
} from 'aws-amplify/auth'

interface User {
  username: string
  email: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<{ needsConfirmation: boolean }>
  confirmSignup: (email: string, code: string) => Promise<void>
  logout: () => void
  deleteAccount: () => Promise<void>
  /** ログイン時はメール、未ログイン時は 'trial-user' */
  userId: string
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkCurrentUser()
  }, [])

  const checkCurrentUser = async () => {
    try {
      const currentUser = await getCurrentUser()
      const attributes = await fetchUserAttributes()
      setUser({
        username: currentUser.username,
        email: attributes.email ?? currentUser.username,
      })
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const result = await signIn({ username: email, password })
    if (result.isSignedIn) {
      await checkCurrentUser()
    }
  }

  const handleSignup = async (email: string, password: string) => {
    const result = await signUp({
      username: email,
      password,
      options: {
        userAttributes: { email },
      },
    })
    if (result.isSignUpComplete) {
      return { needsConfirmation: false }
    }
    return { needsConfirmation: true }
  }

  const handleConfirmSignup = async (email: string, code: string) => {
    await confirmSignUp({ username: email, confirmationCode: code })
  }

  const logout = async () => {
    try {
      await signOut()
    } catch {
      // ignore
    }
    setUser(null)
  }

  const deleteAccount = async () => {
    try {
      await deleteUser()
    } catch {
      // ignore
    }
    setUser(null)
  }

  const userId = user ? user.email : 'trial-user'

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup: handleSignup,
        confirmSignup: handleConfirmSignup,
        logout,
        deleteAccount,
        userId,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
