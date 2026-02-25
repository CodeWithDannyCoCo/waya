import { type NextRequest, NextResponse } from "next/server"
import { getChildByNameAndPin } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    console.log("[SERVER] Child Login API: Starting login process...")

    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error("[SERVER] Child Login API: Failed to parse request body:", parseError)
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request format",
        },
        { status: 400 },
      )
    }

    const { childName, pin } = body

    console.log("[SERVER] Child Login API: Received login attempt for:", childName)

    // Validate input
    if (!childName || !pin) {
      console.log("[SERVER] Child Login API: Missing child name or PIN")
      return NextResponse.json(
        {
          success: false,
          error: "Child name and PIN are required",
        },
        { status: 400 },
      )
    }

    // Validate PIN format
    if (!/^\d{4}$/.test(pin)) {
      console.log("[SERVER] Child Login API: Invalid PIN format:", pin)
      return NextResponse.json(
        {
          success: false,
          error: "PIN must be exactly 4 digits",
        },
        { status: 400 },
      )
    }

    // Get child from database and verify PIN
    console.log("[SERVER] Child Login API: Querying database for child...")
    
    let child
    try {
      child = await getChildByNameAndPin(childName.trim(), pin)
    } catch (dbError) {
      console.error("[SERVER] Child Login API: Database error:", dbError)
      return NextResponse.json(
        {
          success: false,
          error: "Database error occurred. Please try again.",
        },
        { status: 500 },
      )
    }

    if (!child) {
      console.log("[SERVER] Child Login API: Invalid child name or PIN for:", childName)
      return NextResponse.json(
        {
          success: false,
          error: "Invalid child name or PIN",
        },
        { status: 401 },
      )
    }

    console.log("[SERVER] Child Login API: Login successful for:", child.name)

    // Return child data without sensitive information
    const userData = {
      id: child.id,
      name: child.name,
      role: child.role,
      parentId: child.parent_id,
      coins: child.total_coins || 0,
      level: child.level || 1,
      xp: child.total_xp || 0,
      streak: child.streak_days || 0,
    }

    return NextResponse.json({
      success: true,
      user: userData,
      message: "Login successful",
    })
  } catch (error) {
    console.error("[SERVER] Child Login API: Unexpected error during login:", error)

    // Log the full error for debugging
    if (error instanceof Error) {
      console.error("[SERVER] Child Login API: Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      })
    }

    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      },
      { status: 500 },
    )
  }
}
