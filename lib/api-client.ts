/**
 * API Client
 *
 * This module provides a client for interacting with the backend API.
 * It uses Next.js API routes for mocking during development.
 */

// Base URL for API requests
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ""

// Helper function to handle API responses
async function handleResponse(response: Response) {
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || "An error occurred")
  }

  return data
}

// API client for authentication
const auth = {
  // Login as a parent
  async loginParent(email: string, password: string) {
    try {
      const response = await fetch(`/api/auth/callback/parent-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      return handleResponse(response)
    } catch (error) {
      console.error("Login error:", error)
      return { error: error instanceof Error ? error.message : "Login failed" }
    }
  },

  // Login as a child
  async loginChild(username: string, password: string) {
    try {
      const response = await fetch(`/api/auth/callback/child-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      return handleResponse(response)
    } catch (error) {
      console.error("Login error:", error)
      return { error: error instanceof Error ? error.message : "Login failed" }
    }
  },

  // Register a new parent account
  async registerParent(name: string, email: string, password: string) {
    try {
      const response = await fetch(`/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      return handleResponse(response)
    } catch (error) {
      console.error("Registration error:", error)
      return { error: error instanceof Error ? error.message : "Registration failed" }
    }
  },
}

// API client for family management
const family = {
  // Get children for the authenticated parent
  async getChildren() {
    try {
      const response = await fetch(`/api/mock/family/children`)
      return handleResponse(response)
    } catch (error) {
      console.error("Error fetching children:", error)
      return { error: error instanceof Error ? error.message : "Failed to fetch children" }
    }
  },

  // Create a new child account
  async createChild(name: string, password: string) {
    try {
      const response = await fetch(`/api/mock/family/children`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, password }),
      })

      return handleResponse(response)
    } catch (error) {
      console.error("Error creating child account:", error)
      return { error: error instanceof Error ? error.message : "Failed to create child account" }
    }
  },
}

// API client for chores
const chores = {
  // Get chores based on user role and filters
  async getChores(filters: { childId?: string; parentId?: string } = {}) {
    try {
      const queryParams = new URLSearchParams()

      if (filters.childId) {
        queryParams.append("childId", filters.childId)
      }

      if (filters.parentId) {
        queryParams.append("parentId", filters.parentId)
      }

      const response = await fetch(`/api/mock/chores?${queryParams.toString()}`)
      return handleResponse(response)
    } catch (error) {
      console.error("Error fetching chores:", error)
      return { error: error instanceof Error ? error.message : "Failed to fetch chores" }
    }
  },

  // Create a new chore
  async createChore(choreData: {
    title: string
    description?: string
    points: number
    childId: string
    dueDate?: string
  }) {
    try {
      const response = await fetch(`/api/mock/chores`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(choreData),
      })

      return handleResponse(response)
    } catch (error) {
      console.error("Error creating chore:", error)
      return { error: error instanceof Error ? error.message : "Failed to create chore" }
    }
  },
}

// API client for rewards
const rewards = {
  // Get rewards based on user role and filters
  async getRewards(filters: { childId?: string } = {}) {
    try {
      const queryParams = new URLSearchParams()

      if (filters.childId) {
        queryParams.append("childId", filters.childId)
      }

      const response = await fetch(`/api/mock/rewards?${queryParams.toString()}`)
      return handleResponse(response)
    } catch (error) {
      console.error("Error fetching rewards:", error)
      return { error: error instanceof Error ? error.message : "Failed to fetch rewards" }
    }
  },

  // Create a new reward
  async createReward(rewardData: {
    title: string
    description?: string
    cost: number
    childId: string
    image?: string
  }) {
    try {
      const response = await fetch(`/api/mock/rewards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rewardData),
      })

      return handleResponse(response)
    } catch (error) {
      console.error("Error creating reward:", error)
      return { error: error instanceof Error ? error.message : "Failed to create reward" }
    }
  },
}

// Export the API client
export const api = {
  auth,
  family,
  chores,
  rewards,
}
