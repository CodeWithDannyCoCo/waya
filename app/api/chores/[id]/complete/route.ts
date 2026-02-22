import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "child") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const choreId = params.id

    // Update chore status to completed
    const updatedChore = await db.updateChoreStatus(choreId, "completed")

    if (!updatedChore) {
      return NextResponse.json({ error: "Chore not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Chore completed successfully",
      chore: updatedChore,
    })
  } catch (error) {
    console.error("Error completing chore:", error)
    return NextResponse.json({ error: "Failed to complete chore" }, { status: 500 })
  }
}
