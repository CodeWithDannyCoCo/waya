import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { markNotificationAsRead } from "@/lib/db"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const notification = await markNotificationAsRead(params.id, session.user.id)

    if (!notification) {
      return NextResponse.json({ message: "Notification not found" }, { status: 404 })
    }

    return NextResponse.json({
      notification,
    })
  } catch (error) {
    console.error("Mark notification as read error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
