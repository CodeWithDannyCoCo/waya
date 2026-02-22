import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"

export async function GET(request: NextRequest) {
  try {
    console.log("[SERVER] Wallet Balance API: Getting wallet balance...")

    // Get current user session
    const session = await getSession()
    if (!session) {
      console.log("[SERVER] Wallet Balance API: Unauthorized access")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[SERVER] Wallet Balance API: Getting balance for user:", session.id)

    // For now, return mock data since wallet_balances table might not exist
    // TODO: Replace with actual database query when wallet_balances table is ready
    const mockBalance = {
      coins: session.coins || 0,
      realMoney: 0, // TODO: Get from wallet_balances table
      conversionRate: 100, // 100 coins = $1
    }

    return NextResponse.json({
      success: true,
      balance: mockBalance,
    })
  } catch (error) {
    console.error("[SERVER] Wallet Balance API: Error getting balance:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch wallet balance",
      },
      { status: 500 },
    )
  }
}
