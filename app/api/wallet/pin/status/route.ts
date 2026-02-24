import { type NextRequest, NextResponse } from "next/server"
import { getWalletPin } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    const userRole = request.headers.get("x-user-role")

    if (!userId || userRole !== "parent") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const pinHash = await getWalletPin(userId)

    return NextResponse.json({
      pinSet: !!pinHash,
    })
  } catch (error) {
    console.error("PIN status error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
