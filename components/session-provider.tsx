"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useAuth } from "@/contexts/auth-context"

interface SessionContextType {
  session: { user: any } | null
  loading: boolean
  login: (email: string, password: string, role: "parent" | "child") => Promise<{ success: boolean; error?: string }>
  signOut: () => void
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export function SessionProvider({ children }: { children: ReactNode }) {
  const { user, loading, signIn, logout } = useAuth()
  const [session, setSession] = useState<{ user: any } | null>(null)

  useEffect(() => {
    if (user) {
      setSession({ user })
    } else {
      setSession(null)
    }
    console.log("SessionProvider rendering with:", { session: session, loading })
  }, [user, loading])

  const login = async (email: string, password: string, role: "parent" | "child") => {
    try {
      const success = await signIn(email, password, role)
      if (success) {
        return { success: true }
      } else {
        return { success: false, error: "Invalid credentials" }
      }
    } catch (error) {
      return { success: false, error: "Login failed" }
    }
  }

  const signOut = () => {
    logout()
  }

  const value = {
    session,
    loading,
    login,
    signOut,
  }

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider")
  }
  return context
}
