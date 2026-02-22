import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const childId = params.id
    const { searchParams } = new URL(request.url)
    const parentId = searchParams.get("parentId")

    if (!parentId) {
      return NextResponse.json({ error: "Parent ID is required" }, { status: 400 })
    }

    // Get the child to check if it belongs to this parent
    const child = await db.getUserById(childId)

    if (!child) {
      return NextResponse.json({ error: "Child not found" }, { status: 404 })
    }

    // Ensure the parent is deleting their own child
    if (child.parent_id !== parentId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Delete the child account
    const deletedChild = await db.deleteUser(childId)

    if (!deletedChild) {
      return NextResponse.json({ error: "Failed to delete child account" }, { status: 500 })
    }

    return NextResponse.json({
      message: "Child account deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting child account:", error)
    return NextResponse.json({ error: "Failed to delete child account" }, { status: 500 })
  }
}
