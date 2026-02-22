import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { deleteNotification } from "@/lib/db"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const notification = await deleteNotification(params.id, session.user.id)

    if (!notification) {
      return NextResponse.json({ message: "Notification not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Notification deleted successfully",
    })
  } catch (error) {
    console.error("Delete notification error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
