import { type NextRequest, NextResponse } from "next/server"
import { getConversionRequests } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    const userRole = request.headers.get("x-user-role")

    if (!userId || userRole !== "parent") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const requests = await getConversionRequests(userId)

    return NextResponse.json({
      requests,
    })
  } catch (error) {
    console.error("Get conversion requests error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
