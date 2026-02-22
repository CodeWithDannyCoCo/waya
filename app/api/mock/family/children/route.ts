import { NextResponse } from "next/server"
import { mockDb } from "@/lib/mock-db"

export async function GET(request: Request) {
  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 400))

    const { searchParams } = new URL(request.url)
    const parentId = searchParams.get("parentId")

    if (!parentId) {
      return NextResponse.json({ error: "Parent ID is required" }, { status: 400 })
    }

    const children = mockDb.getChildrenByParentId(parentId)

    return NextResponse.json({ children })
  } catch (error) {
    console.error("Error fetching children:", error)
    return NextResponse.json({ error: "Failed to fetch children" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 600))

    const data = await request.json()

    // In a real app, you would create the child account in the database
    // For demo purposes, we'll just return success
    return NextResponse.json({
      message: "Child account created successfully",
      child: {
        id: Math.random().toString(36).substr(2, 9),
        name: data.name,
        role: "child",
        parentId: data.parentId,
        image: "/placeholder.svg?height=40&width=40",
        totalCoins: 0,
        totalXp: 0,
        level: 1,
        streakDays: 0,
        createdAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Error creating child account:", error)
    return NextResponse.json({ error: "Failed to create child account" }, { status: 500 })
  }
}
