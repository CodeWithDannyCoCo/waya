import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "child") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const rewardId = params.id

    try {
      const redeemedReward = await db.redeemReward(rewardId, session.user.id)

      return NextResponse.json({
        message: "Reward redeemed successfully",
        reward: redeemedReward,
      })
    } catch (error) {
      if (error.message === "Insufficient coins or invalid reward") {
        return NextResponse.json({ error: "Insufficient coins or invalid reward" }, { status: 400 })
      }
      throw error
    }
  } catch (error) {
    console.error("Error redeeming reward:", error)
    return NextResponse.json({ error: "Failed to redeem reward" }, { status: 500 })
  }
}
