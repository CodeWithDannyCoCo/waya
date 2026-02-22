import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

const sql = neon(process.env.DATABASE_URL)

export interface User {
  id: string
  name: string
  email?: string
  password?: string
  role: "parent" | "child"
  parent_id?: string
  pin?: string
  total_coins?: number
  total_xp?: number
  level?: number
  streak_days?: number
  image?: string
  created_at?: string
  updated_at?: string
}

export interface Chore {
  id: string
  title: string
  description: string
  reward: number
  xp: number
  difficulty: "easy" | "medium" | "hard"
  due_date: string
  status: "pending" | "completed" | "approved"
  assigned_to: string
  created_at: string
}

export interface CreateUserData {
  name: string
  email?: string
  password_hash?: string
  pin_hash?: string
  role: "parent" | "child"
  parent_id?: string
}

// Create a new user
export async function createUser(userData: CreateUserData): Promise<User> {
  try {
    console.log("[SERVER] DB: Creating user with data:", {
      ...userData,
      password_hash: userData.password_hash ? "***" : undefined,
      pin_hash: userData.pin_hash ? "***" : undefined,
    })

    const result = await sql`
      INSERT INTO users (name, email, password, pin, role, parent_id)
      VALUES (
        ${userData.name},
        ${userData.email || null},
        ${userData.password_hash || null},
        ${userData.pin_hash || null},
        ${userData.role},
        ${userData.parent_id || null}
      )
      RETURNING id, name, email, role, parent_id, created_at, updated_at
    `

    if (!result || result.length === 0) {
      throw new Error("Failed to create user - no data returned")
    }

    const user = result[0]
    console.log("[SERVER] DB: User created successfully:", { id: user.id, name: user.name, email: user.email })

    // Create user stats record
    try {
      await sql`
        INSERT INTO user_stats (user_id, total_coins, total_xp, level, streak_days)
        VALUES (${user.id}, 0, 0, 1, 0)
      `
      console.log("DB: User stats created for user:", user.id)
    } catch (statsError) {
      console.error("DB: Error creating user stats:", statsError)
      // Don't fail the user creation if stats creation fails
    }

    return {
      ...user,
      total_coins: 0,
      total_xp: 0,
      level: 1,
      streak_days: 0,
    }
  } catch (error) {
    console.error("[SERVER] DB: Error creating user:", error)
    throw error
  }
}

// Get user by email
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    console.log("[SERVER] DB: Getting user by email:", email)

    const result = await sql`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.password,
        u.pin,
        u.role,
        u.parent_id,
        COALESCE(us.total_coins, 0) as total_coins,
        COALESCE(us.total_xp, 0) as total_xp,
        COALESCE(us.level, 1) as level,
        COALESCE(us.streak_days, 0) as streak_days,
        u.image,
        u.created_at,
        u.updated_at
      FROM users u
      LEFT JOIN user_stats us ON u.id = us.user_id
      WHERE LOWER(u.email) = LOWER(${email})
      LIMIT 1
    `

    if (!result || result.length === 0) {
      console.log("[SERVER] DB: No user found with email:", email)
      return null
    }

    const user = result[0]
    console.log("[SERVER] DB: User found:", { id: user.id, name: user.name, email: user.email, role: user.role })

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      parent_id: user.parent_id,
      pin: user.pin,
      total_coins: user.total_coins || 0,
      total_xp: user.total_xp || 0,
      level: user.level || 1,
      streak_days: user.streak_days || 0,
      image: user.image,
      created_at: user.created_at,
      updated_at: user.updated_at,
    }
  } catch (error) {
    console.error("[SERVER] DB: Error getting user by email:", error)
    throw error
  }
}

// Get user by ID
export async function getUserById(id: string): Promise<User | null> {
  try {
    console.log("[SERVER] DB: Getting user by ID:", id)

    const result = await sql`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.password,
        u.pin,
        u.role,
        u.parent_id,
        COALESCE(us.total_coins, 0) as total_coins,
        COALESCE(us.total_xp, 0) as total_xp,
        COALESCE(us.level, 1) as level,
        COALESCE(us.streak_days, 0) as streak_days,
        u.image,
        u.created_at,
        u.updated_at
      FROM users u
      LEFT JOIN user_stats us ON u.id = us.user_id
      WHERE u.id = ${id}
      LIMIT 1
    `

    if (!result || result.length === 0) {
      console.log("[SERVER] DB: No user found with ID:", id)
      return null
    }

    const user = result[0]
    console.log("[SERVER] DB: User found by ID:", { id: user.id, name: user.name })

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      parent_id: user.parent_id,
      pin: user.pin,
      total_coins: user.total_coins || 0,
      total_xp: user.total_xp || 0,
      level: user.level || 1,
      streak_days: user.streak_days || 0,
      image: user.image,
      created_at: user.created_at,
      updated_at: user.updated_at,
    }
  } catch (error) {
    console.error("[SERVER] DB: Error getting user by ID:", error)
    throw error
  }
}

// Get child by name and PIN (for login)
export async function getChildByNameAndPin(childName: string, pin: string): Promise<User | null> {
  try {
    console.log("[SERVER] DB: Getting child by name and PIN:", childName)

    const result = await sql`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.pin,
        u.role,
        u.parent_id,
        COALESCE(us.total_coins, 0) as total_coins,
        COALESCE(us.total_xp, 0) as total_xp,
        COALESCE(us.level, 1) as level,
        COALESCE(us.streak_days, 0) as streak_days,
        u.image
      FROM users u
      LEFT JOIN user_stats us ON u.id = us.user_id
      WHERE LOWER(u.name) = LOWER(${childName}) AND u.role = 'child'
      LIMIT 1
    `

    if (!result || result.length === 0) {
      console.log("[SERVER] DB: No child found with name:", childName)
      return null
    }

    const user = result[0]

    // Verify PIN
    if (!user.pin) {
      console.log("[SERVER] DB: Child has no PIN set")
      return null
    }

    const isValidPin = await bcrypt.compare(pin, user.pin)
    if (!isValidPin) {
      console.log("[SERVER] DB: Invalid PIN for child")
      return null
    }

    console.log("[SERVER] DB: Child authenticated successfully:", { id: user.id, name: user.name })

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      parent_id: user.parent_id,
      total_coins: user.total_coins || 0,
      total_xp: user.total_xp || 0,
      level: user.level || 1,
      streak_days: user.streak_days || 0,
      image: user.image,
    }
  } catch (error) {
    console.error("[SERVER] DB: Error getting child by name and PIN:", error)
    throw error
  }
}

// Get children for a parent
export async function getChildren(parentId: string) {
  try {
    console.log("[SERVER] DB: Getting children for parent:", parentId)

    const result = await sql`
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.role, 
        u.parent_id, 
        u.image, 
        u.created_at, 
        u.updated_at,
        COALESCE(us.total_coins, 0) as total_coins, 
        COALESCE(us.total_xp, 0) as total_xp, 
        COALESCE(us.level, 1) as level, 
        COALESCE(us.streak_days, 0) as streak_days
      FROM users u
      LEFT JOIN user_stats us ON u.id = us.user_id
      WHERE u.parent_id = ${parentId} AND u.role = 'child'
      ORDER BY u.created_at DESC
    `

    console.log("[SERVER] DB: Found children:", result.length)
    return result
  } catch (error) {
    console.error("[SERVER] DB: Error in getChildren:", error)
    throw error
  }
}

// Test database connection
export async function testConnection(): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    console.log("[SERVER] DB: Testing database connection...")
    const result = await sql`SELECT NOW() as current_time`
    console.log("[SERVER] DB: Connection successful:", result[0])
    return { success: true, data: result[0] }
  } catch (error) {
    console.error("[SERVER] DB: Connection failed:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// Update user coins
export async function updateUserCoins(userId: string, coinChange: number) {
  try {
    const result = await sql`
      UPDATE user_stats 
      SET total_coins = total_coins + ${coinChange}
      WHERE user_id = ${userId}
      RETURNING total_coins
    `
    return result[0]?.total_coins || 0
  } catch (error) {
    console.error("Error in updateUserCoins:", error)
    throw error
  }
}

// Create transaction
export async function createTransaction(transactionData: {
  user_id: string
  type: string
  amount: number
  description: string
  reference_id?: string
  reference_type?: string
}) {
  try {
    const result = await sql`
      INSERT INTO transactions (user_id, type, amount, description, reference_id, reference_type)
      VALUES (
        ${transactionData.user_id}, 
        ${transactionData.type}, 
        ${transactionData.amount}, 
        ${transactionData.description}, 
        ${transactionData.reference_id || null}, 
        ${transactionData.reference_type || null}
      )
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error in createTransaction:", error)
    throw error
  }
}

// Get child by ID
export async function getChildById(id: string): Promise<User | null> {
  try {
    console.log("[SERVER] DB: Getting child by ID:", id)

    const result = await sql`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.role,
        u.parent_id,
        u.pin,
        COALESCE(us.total_coins, 0) as total_coins,
        COALESCE(us.total_xp, 0) as total_xp,
        COALESCE(us.level, 1) as level,
        COALESCE(us.streak_days, 0) as streak_days,
        u.image
      FROM users u
      LEFT JOIN user_stats us ON u.id = us.user_id
      WHERE u.id = ${id} AND u.role = 'child'
      LIMIT 1
    `

    if (result.length === 0) {
      console.log("[SERVER] DB: No child found with ID:", id)
      return null
    }

    const user = result[0] as User
    console.log("[SERVER] DB: Found child:", { id: user.id, name: user.name })
    return user
  } catch (error) {
    console.error("[SERVER] DB: Error getting child by ID:", error)
    throw error
  }
}

// Get chores for a child by ID
export async function getChoresByChildId(childId: string): Promise<Chore[]> {
  try {
    console.log("[SERVER] DB: Getting chores for child:", childId)

    // For now, return empty array since chores table might not exist yet
    // You can uncomment and modify this when you have the chores table set up:
    /*
    const result = await sql`
      SELECT 
        id,
        title,
        description,
        reward,
        xp,
        difficulty,
        due_date,
        status,
        assigned_to,
        created_at
      FROM chores
      WHERE assigned_to = ${childId}
      ORDER BY created_at DESC
    `
    
    console.log("[SERVER] DB: Found chores:", result.length)
    return result as Chore[]
    */

    console.log("[SERVER] DB: Returning empty chores array (table not implemented)")
    return []
  } catch (error) {
    console.error("[SERVER] DB: Error getting chores:", error)
    return []
  }
}

// Verify password
export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  try {
    const isValid = await bcrypt.compare(plainPassword, hashedPassword)
    console.log("[SERVER] DB: Password verification:", isValid ? "success" : "failed")
    return isValid
  } catch (error) {
    console.error("[SERVER] DB: Error verifying password:", error)
    return false
  }
}
