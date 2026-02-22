import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { createUser, getUserByEmail } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    console.log("Signup API: Starting signup process...")

    const body = await request.json()
    const { name, email, password } = body

    console.log("Signup API: Received data:", { name, email, password: "***" })

    // Validate input
    if (!name || !email || !password) {
      console.log("Signup API: Missing required fields")
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      console.log("Signup API: Password too short")
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
    }

    // Check if user already exists
    console.log("Signup API: Checking if user exists...")
    const existingUser = await getUserByEmail(email.toLowerCase())
    if (existingUser) {
      console.log("Signup API: User already exists")
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 })
    }

    // Hash password
    console.log("Signup API: Hashing password...")
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    console.log("Signup API: Creating user...")
    const user = await createUser({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password_hash: hashedPassword,
      role: "parent",
    })

    console.log("Signup API: User created successfully:", { id: user.id, name: user.name, email: user.email })

    // Return user data (without password)
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      },
    })
  } catch (error) {
    console.error("Signup API: Error creating user:", error)

    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes("duplicate key")) {
        return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 })
      }

      if (error.message.includes("column") && error.message.includes("does not exist")) {
        console.error("Signup API: Database schema error:", error.message)
        return NextResponse.json({ error: "Database configuration error. Please contact support." }, { status: 500 })
      }
    }

    return NextResponse.json({ error: "Failed to create account. Please try again." }, { status: 500 })
  }
}
