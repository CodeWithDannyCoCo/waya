import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"

export async function GET(request: NextRequest) {
  try {
    console.log("[SERVER] Wallet Transactions API: Getting transactions...")

    // Get current user session
    const session = await getSession()
    if (!session) {
      console.log("[SERVER] Wallet Transactions API: Unauthorized access")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[SERVER] Wallet Transactions API: Getting transactions for user:", session.id)

    // For now, return mock data since transactions table might not be fully set up
    // TODO: Replace with actual database query when transactions table is ready
    const mockTransactions = [
      {
        id: "1",
        type: "earned",
        amount: 50,
        description: "Completed chore: Clean room",
        date: new Date().toISOString(),
      },
      {
        id: "2",
        type: "spent",
        amount: -25,
        description: "Redeemed reward: Extra screen time",
        date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      },
    ]

    return NextResponse.json({
      success: true,
      transactions: mockTransactions,
    })
  } catch (error) {
    console.error("[SERVER] Wallet Transactions API: Error getting transactions:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch transactions",
      },
      { status: 500 },
    )
  }
}
