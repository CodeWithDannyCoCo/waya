"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email?: string
  role: "parent" | "child"
  parentId?: string
  image?: string
  coins?: number
  level?: number
  xp?: number
  streak?: number
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signInParent: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signInChild: (childName: string, pin: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log("AuthProvider: Initializing...")
    // Check for existing session
    const savedUser = localStorage.getItem("chorequest-user")
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        console.log("AuthProvider: Found saved user:", userData)
        setUser(userData)
      } catch (error) {
        console.error("AuthProvider: Error parsing saved user:", error)
        localStorage.removeItem("chorequest-user")
      }
    }
    setLoading(false)
  }, [])

  const signInParent = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log("AuthProvider: Parent sign in attempt for:", email)

      const response = await fetch("/api/auth/callback/parent-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      console.log("AuthProvider: Response status:", response.status)
      console.log("AuthProvider: Response content-type:", response.headers.get("content-type"))

      // Check if response is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        console.error("AuthProvider: Response is not JSON:", contentType)
        const text = await response.text()
        console.error("AuthProvider: Response body:", text)
        return { success: false, error: "Server error occurred. Please try again." }
      }

      const data = await response.json()
      console.log("AuthProvider: Parent sign in response:", data)

      if (data.success && data.user) {
        setUser(data.user)
        localStorage.setItem("chorequest-user", JSON.stringify(data.user))
        console.log("AuthProvider: Parent sign in successful")
        return { success: true }
      } else {
        console.log("AuthProvider: Parent sign in failed:", data.error)
        return { success: false, error: data.error || "Sign in failed" }
      }
    } catch (error) {
      console.error("AuthProvider: Parent sign in error:", error)
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  const signInChild = async (childName: string, pin: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log("AuthProvider: Child sign in attempt for:", childName)

      const response = await fetch("/api/auth/callback/child-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ childName, pin }),
      })

      console.log("AuthProvider: Response status:", response.status)
      console.log("AuthProvider: Response content-type:", response.headers.get("content-type"))

      // Check if response is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        console.error("AuthProvider: Response is not JSON:", contentType)
        const text = await response.text()
        console.error("AuthProvider: Response body:", text)
        return { success: false, error: "Server error occurred. Please try again." }
      }

      const data = await response.json()
      console.log("AuthProvider: Child sign in response:", data)

      if (data.success && data.user) {
        setUser(data.user)
        localStorage.setItem("chorequest-user", JSON.stringify(data.user))
        console.log("AuthProvider: Child sign in successful")
        return { success: true }
      } else {
        console.log("AuthProvider: Child sign in failed:", data.error)
        return { success: false, error: data.error || "Sign in failed" }
      }
    } catch (error) {
      console.error("AuthProvider: Child sign in error:", error)
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  const logout = () => {
    console.log("AuthProvider: Logging out")
    setUser(null)
    localStorage.removeItem("chorequest-user")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInParent,
        signInChild,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
