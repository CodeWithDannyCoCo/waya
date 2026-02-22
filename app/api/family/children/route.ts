import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getChildren, createUser } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function GET(request: NextRequest) {
  try {
    console.log("[SERVER] Family Children API: Getting children...")

    // Get current user session
    const session = await getSession()
    if (!session || session.role !== "parent") {
      console.log("[SERVER] Family Children API: Unauthorized access")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[SERVER] Family Children API: Getting children for parent:", session.id)

    // Get children from database
    const children = await getChildren(session.id)

    console.log("[SERVER] Family Children API: Found children:", children.length)

    // Transform data for frontend
    const transformedChildren = children.map((child) => ({
      id: child.id,
      name: child.name,
      totalCoins: child.total_coins || 0,
      totalXp: child.total_xp || 0,
      level: child.level || 1,
      streakDays: child.streak_days || 0,
      completedChores: 0, // TODO: Calculate from chores table
      pendingChores: 0, // TODO: Calculate from chores table
      image: child.image || `/placeholder.svg?height=40&width=40&text=${child.name.charAt(0)}`,
    }))

    return NextResponse.json({
      success: true,
      children: transformedChildren,
    })
  } catch (error) {
    console.error("[SERVER] Family Children API: Error getting children:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch children",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("[SERVER] Family Children API: Creating child...")

    // Get current user session
    const session = await getSession()
    if (!session || session.role !== "parent") {
      console.log("[SERVER] Family Children API: Unauthorized access")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, pin } = body

    console.log("[SERVER] Family Children API: Creating child:", { name, pin: pin ? "****" : "missing" })

    // Validate input
    if (!name || !pin) {
      return NextResponse.json(
        {
          success: false,
          error: "Name and PIN are required",
        },
        { status: 400 },
      )
    }

    if (!/^\d{4}$/.test(pin)) {
      return NextResponse.json(
        {
          success: false,
          error: "PIN must be exactly 4 digits",
        },
        { status: 400 },
      )
    }

    // Check if child name already exists for this parent
    const existingChildren = await getChildren(session.id)
    const nameExists = existingChildren.some((child) => child.name.toLowerCase() === name.toLowerCase())

    if (nameExists) {
      return NextResponse.json(
        {
          success: false,
          error: "A child with this name already exists",
        },
        { status: 400 },
      )
    }

    // Hash the PIN
    const hashedPin = await bcrypt.hash(pin, 10)

    // Create child user
    const childData = {
      name: name.trim(),
      pin_hash: hashedPin,
      role: "child" as const,
      parent_id: session.id,
    }

    const newChild = await createUser(childData)

    console.log("[SERVER] Family Children API: Child created successfully:", newChild.id)

    // Return child data
    const childResponse = {
      id: newChild.id,
      name: newChild.name,
      totalCoins: newChild.total_coins || 0,
      totalXp: newChild.total_xp || 0,
      level: newChild.level || 1,
      streakDays: newChild.streak_days || 0,
      completedChores: 0,
      pendingChores: 0,
      image: `/placeholder.svg?height=40&width=40&text=${newChild.name.charAt(0)}`,
    }

    return NextResponse.json({
      success: true,
      child: childResponse,
      message: "Child account created successfully",
    })
  } catch (error) {
    console.error("[SERVER] Family Children API: Error creating child:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create child account",
      },
      { status: 500 },
    )
  }
}
