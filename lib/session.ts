export interface User {
  id: string
  name: string
  email: string
  role: "parent" | "child"
  parent_id?: string
  pin?: string
  total_coins?: number
  total_xp?: number
  level?: number
  streak_days?: number
  image?: string
}

export interface Session {
  user: User
}

const SESSION_KEY = "chorequest_session"

export function getSession(): Session | null {
  try {
    if (typeof window === "undefined") return null

    const sessionData = localStorage.getItem(SESSION_KEY)
    if (!sessionData) return null

    console.log("Retrieved session from localStorage:", JSON.parse(sessionData))
    return JSON.parse(sessionData)
  } catch (error) {
    console.error("Error getting session:", error)
    return null
  }
}

export function setSession(session: Session): void {
  try {
    if (typeof window === "undefined") return

    console.log("Saving session to localStorage:", session)
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))

    // Dispatch storage event for other tabs
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: SESSION_KEY,
        newValue: JSON.stringify(session),
        storageArea: localStorage,
      }),
    )
  } catch (error) {
    console.error("Error setting session:", error)
  }
}

export function clearSession(): void {
  try {
    if (typeof window === "undefined") return

    console.log("Clearing session from localStorage")
    localStorage.removeItem(SESSION_KEY)

    // Dispatch storage event for other tabs
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: SESSION_KEY,
        newValue: null,
        storageArea: localStorage,
      }),
    )
  } catch (error) {
    console.error("Error clearing session:", error)
  }
}

// Aliases for compatibility
export const loadSession = getSession
export const saveSession = setSession
