import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { getUserNotifications, createNotification } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const notifications = await getUserNotifications(session.user.id, limit, offset)
    const unreadCount = notifications.filter((n) => !n.read).length

    return NextResponse.json({
      notifications,
      unreadCount,
      hasMore: notifications.length === limit,
    })
  } catch (error) {
    console.error("Get notifications error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { userId, title, message, type, urgent } = await request.json()

    if (!userId || !title || !message || !type) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const notification = await createNotification({
      user_id: userId,
      title,
      message,
      type,
      urgent,
    })

    return NextResponse.json(
      {
        notification,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create notification error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
