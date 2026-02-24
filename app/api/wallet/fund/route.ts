import { type NextRequest, NextResponse } from "next/server"
import { updateWalletBalance, createTransaction, createNotification } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { amount, paymentMethod } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ message: "Invalid amount" }, { status: 400 })
    }

    if (!paymentMethod) {
      return NextResponse.json({ message: "Payment method is required" }, { status: 400 })
    }

    // Update wallet balance
    const newBalance = await updateWalletBalance(userId, amount)

    // Create transaction record
    const transaction = await createTransaction({
      user_id: userId,
      type: "funding",
      amount: amount,
      description: `Wallet funded via ${paymentMethod}`,
      status: "completed",
    })

    // Create notification
    await createNotification({
      user_id: userId,
      title: "Wallet Funded",
      message: `Your wallet has been funded with $${amount.toFixed(2)}`,
      type: "wallet",
    })

    return NextResponse.json({
      message: "Wallet funded successfully",
      newBalance,
      transaction,
    })
  } catch (error) {
    console.error("Wallet funding error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
