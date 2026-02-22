import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getSession } from "@/lib/session"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || session.role !== "parent") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { requestId, action, pin, reason } = await request.json()

    if (!requestId || !action || !pin || !["approve", "reject"].includes(action)) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Verify PIN
    const walletPin = await db.getWalletPin(session.userId)
    if (!walletPin || !(await bcrypt.compare(pin, walletPin.pin_hash))) {
      return NextResponse.json({ success: false, error: "Invalid PIN" }, { status: 401 })
    }

    // Get the conversion request
    const conversionRequest = await db.updateConversionRequest(
      requestId,
      action === "approve" ? "approved" : "rejected",
      reason,
    )

    if (!conversionRequest) {
      return NextResponse.json({ success: false, error: "Conversion request not found" }, { status: 404 })
    }

    if (action === "approve") {
      // Deduct coins from child
      const childStats = await db.getUserStats(conversionRequest.child_id)
      if (childStats) {
        await db.updateUserStats(conversionRequest.child_id, {
          total_coins: childStats.total_coins - conversionRequest.coin_amount,
        })

        // Add money to child's wallet
        await db.updateWalletBalance(conversionRequest.child_id, conversionRequest.money_amount)

        // Create transaction records
        await db.createTransaction({
          user_id: conversionRequest.child_id,
          type: "conversion",
          amount: conversionRequest.money_amount,
          coin_amount: -conversionRequest.coin_amount,
          description: `Converted ${conversionRequest.coin_amount} coins to ₦${conversionRequest.money_amount}`,
          reference_id: requestId,
          reference_type: "conversion",
          status: "completed",
        })
      }

      // Get updated child balance
      const updatedChildStats = await db.getUserStats(conversionRequest.child_id)

      // Notify child
      const child = await db.getUserById(conversionRequest.child_id)
      if (child) {
        await db.createNotification({
          user_id: conversionRequest.child_id,
          title: "Conversion Approved",
          message: `Your request to convert ${conversionRequest.coin_amount} coins to ₦${conversionRequest.money_amount} has been approved!`,
          type: "conversion_approved",
          urgent: true,
          read: false,
        })
      }

      return NextResponse.json({
        success: true,
        message: "Conversion request approved",
        childBalance: updatedChildStats?.wallet_balance || 0,
      })
    } else {
      // Notify child of rejection
      const child = await db.getUserById(conversionRequest.child_id)
      if (child) {
        await db.createNotification({
          user_id: conversionRequest.child_id,
          title: "Conversion Rejected",
          message: `Your conversion request was rejected. ${reason || ""}`,
          type: "conversion_rejected",
          urgent: true,
          read: false,
        })
      }

      return NextResponse.json({
        success: true,
        message: "Conversion request rejected",
      })
    }
  } catch (error) {
    console.error("Approve conversion error:", error)
    return NextResponse.json({ success: false, error: "Failed to process conversion request" }, { status: 500 })
  }
}
