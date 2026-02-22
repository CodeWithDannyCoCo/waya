import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { getWalletPin } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id || session.user.role !== "parent") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const pinHash = await getWalletPin(session.user.id)

    return NextResponse.json({
      pinSet: !!pinHash,
    })
  } catch (error) {
    console.error("PIN status error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
