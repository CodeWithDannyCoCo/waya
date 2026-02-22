import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { createConversionRequest, createNotification, updateUserCoins } from "@/lib/db"
import { sql } from "@/lib/db"

const CONVERSION_RATE = 5.0 // 5 coins = $1

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id || session.user.role !== "child") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { coinAmount, note } = await request.json()

    if (!coinAmount || coinAmount <= 0) {
      return NextResponse.json({ message: "Invalid coin amount" }, { status: 400 })
    }

    // Check if child has enough coins
    const userResult = await sql`
      SELECT us.coins, u.parent_id, u.name
      FROM user_stats us
      JOIN users u ON us.user_id = u.id
      WHERE u.id = ${session.user.id}
    `

    if (!userResult[0]) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    const { coins, parent_id, name } = userResult[0]

    if (coins < coinAmount) {
      return NextResponse.json({ message: "Insufficient coins" }, { status: 400 })
    }

    const moneyAmount = coinAmount / CONVERSION_RATE

    // Create conversion request
    const conversionRequest = await createConversionRequest({
      child_id: session.user.id,
      coin_amount: coinAmount,
      money_amount: moneyAmount,
      conversion_rate: CONVERSION_RATE,
      note,
    })

    // Deduct coins temporarily (will be restored if rejected)
    await updateUserCoins(session.user.id, -coinAmount)

    // Notify parent
    await createNotification({
      user_id: parent_id,
      title: "Conversion Request",
      message: `${name} wants to convert ${coinAmount} coins to $${moneyAmount.toFixed(2)}`,
      type: "conversion",
      related_id: conversionRequest.id,
    })

    // Notify child
    await createNotification({
      user_id: session.user.id,
      title: "Conversion Requested",
      message: `Your request to convert ${coinAmount} coins to $${moneyAmount.toFixed(2)} is pending approval`,
      type: "conversion",
      related_id: conversionRequest.id,
    })

    return NextResponse.json({
      message: "Conversion request submitted successfully",
      conversionRequest,
    })
  } catch (error) {
    console.error("Conversion request error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
