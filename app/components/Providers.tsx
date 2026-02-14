'use client'

import { ReactNode } from 'react'
import { AuthProvider } from '../lib/auth-context'
import { configureAmplify } from '../lib/cognito-config'

configureAmplify()

export default function Providers({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}
