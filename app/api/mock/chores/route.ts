import { NextResponse } from "next/server"
import { mockDb } from "@/lib/mock-db"

export async function GET(request: Request) {
  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const parentId = searchParams.get("parentId")
    const status = searchParams.get("status")

    if (!userId && !parentId) {
      return NextResponse.json({ error: "User ID or Parent ID is required" }, { status: 400 })
    }

    let chores = []

    if (userId) {
      chores = mockDb.getChoresByUserId(userId, status || undefined)
    } else if (parentId) {
      chores = mockDb.getChoresByParentId(parentId, status || undefined)
    }

    return NextResponse.json({ chores })
  } catch (error) {
    console.error("Error fetching chores:", error)
    return NextResponse.json({ error: "Failed to fetch chores" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    const data = await request.json()

    // In a real app, you would create the chore in the database
    // For demo purposes, we'll just return success
    return NextResponse.json({
      message: "Chore created successfully",
      chore: {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
        status: "pending",
        createdAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Error creating chore:", error)
    return NextResponse.json({ error: "Failed to create chore" }, { status: 500 })
  }
}
