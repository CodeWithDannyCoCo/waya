import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { getConversionRequests } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id || session.user.role !== "parent") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const requests = await getConversionRequests(session.user.id)

    return NextResponse.json({
      requests,
    })
  } catch (error) {
    console.error("Get conversion requests error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
