import { NextResponse } from "next/server"
import { mockDb } from "@/lib/mock-db"

export async function GET(request: Request) {
  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const parentId = searchParams.get("parentId")

    if (!userId && !parentId) {
      return NextResponse.json({ error: "User ID or Parent ID is required" }, { status: 400 })
    }

    let rewards = []

    if (userId) {
      rewards = mockDb.getRewardsByUserId(userId)
    } else if (parentId) {
      rewards = mockDb.getRewardsByParentId(parentId)
    }

    return NextResponse.json({ rewards })
  } catch (error) {
    console.error("Error fetching rewards:", error)
    return NextResponse.json({ error: "Failed to fetch rewards" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 700))

    const data = await request.json()

    // In a real app, you would create the reward in the database
    // For demo purposes, we'll just return success
    return NextResponse.json({
      message: "Reward created successfully",
      reward: {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
        status: "available",
        createdAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Error creating reward:", error)
    return NextResponse.json({ error: "Failed to create reward" }, { status: 500 })
  }
}
