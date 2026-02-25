import { type NextRequest, NextResponse } from "next/server"
import { getUserByEmail, verifyPassword } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    console.log("[SERVER] Parent Login API: Starting login process...")

    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error("[SERVER] Parent Login API: Failed to parse request body:", parseError)
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request format",
        },
        { status: 400 },
      )
    }

    const { email, password } = body

    console.log("[SERVER] Parent Login API: Received login attempt for:", email)

    // Validate input
    if (!email || !password) {
      console.log("[SERVER] Parent Login API: Missing email or password")
      return NextResponse.json(
        {
          success: false,
          error: "Email and password are required",
        },
        { status: 400 },
      )
    }

    // Get user from database
    console.log("[SERVER] Parent Login API: Querying database for user...")
    
    let user
    try {
      user = await getUserByEmail(email.trim().toLowerCase())
    } catch (dbError) {
      console.error("[SERVER] Parent Login API: Database error:", dbError)
      return NextResponse.json(
        {
          success: false,
          error: "Database error occurred. Please try again.",
        },
        { status: 500 },
      )
    }

    if (!user) {
      console.log("[SERVER] Parent Login API: User not found for email:", email)
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email or password",
        },
        { status: 401 },
      )
    }

    console.log("[SERVER] Parent Login API: User found:", { id: user.id, name: user.name, role: user.role })

    // Check if user is a parent
    if (user.role !== "parent") {
      console.log("[SERVER] Parent Login API: User is not a parent, role:", user.role)
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email or password",
        },
        { status: 401 },
      )
    }

    // Check if user has a password
    if (!user.password) {
      console.log("[SERVER] Parent Login API: User has no password set")
      return NextResponse.json(
        {
          success: false,
          error: "Account not properly configured. Please contact support.",
        },
        { status: 401 },
      )
    }

    // Verify password
    console.log("[SERVER] Parent Login API: Verifying password...")
    let isValidPassword
    try {
      isValidPassword = await verifyPassword(password, user.password)
    } catch (passwordError) {
      console.error("[SERVER] Parent Login API: Password verification error:", passwordError)
      return NextResponse.json(
        {
          success: false,
          error: "An error occurred during authentication. Please try again.",
        },
        { status: 500 },
      )
    }

    if (!isValidPassword) {
      console.log("[SERVER] Parent Login API: Invalid password for user:", user.email)
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email or password",
        },
        { status: 401 },
      )
    }

    console.log("[SERVER] Parent Login API: Login successful for:", user.name)

    // Return user data without sensitive information
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      coins: user.total_coins || 0,
      level: user.level || 1,
      xp: user.total_xp || 0,
      streak: user.streak_days || 0,
    }

    return NextResponse.json({
      success: true,
      user: userData,
      message: "Login successful",
    })
  } catch (error) {
    console.error("[SERVER] Parent Login API: Unexpected error during login:", error)

    // Log the full error for debugging
    if (error instanceof Error) {
      console.error("[SERVER] Parent Login API: Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      })
    }

    try {
      return NextResponse.json(
        {
          success: false,
          error: "An unexpected error occurred. Please try again.",
        },
        { status: 500 },
      )
    } catch (responseError) {
      console.error("[SERVER] Parent Login API: Failed to send error response:", responseError)
      // If JSON response fails, return a plain text error response
      return new NextResponse("Internal Server Error", { status: 500 })
    }
  }
}
