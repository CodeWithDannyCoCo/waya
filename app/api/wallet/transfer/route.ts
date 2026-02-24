import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { updateWalletBalance, createTransaction, createNotification, getWalletPin } from "@/lib/db"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    const userRole = request.headers.get("x-user-role")

    if (!userId || userRole !== "parent") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { childId, amount, pin, note } = await request.json()

    if (!childId || !amount || !pin) {
      return NextResponse.json({ message: "Child ID, amount, and PIN are required" }, { status: 400 })
    }

    if (amount <= 0) {
      return NextResponse.json({ message: "Amount must be greater than 0" }, { status: 400 })
    }

    // Verify PIN
    const storedPinHash = await getWalletPin(userId)
    if (!storedPinHash) {
      return NextResponse.json({ message: "PIN not set. Please set up your wallet PIN first." }, { status: 400 })
    }

    const isValidPin = await bcrypt.compare(pin, storedPinHash)
    if (!isValidPin) {
      return NextResponse.json({ message: "Invalid PIN" }, { status: 400 })
    }

    // Check parent balance
    const parentResult = await sql`
      SELECT wallet_balance FROM user_stats WHERE user_id = ${userId}
    `
    const parentBalance = parentResult[0]?.wallet_balance || 0

    if (parentBalance < amount) {
      return NextResponse.json({ message: "Insufficient funds" }, { status: 403 })
    }

    // Verify child exists and belongs to parent
    const childResult = await sql`
      SELECT u.*, us.wallet_balance 
      FROM users u
      LEFT JOIN user_stats us ON u.id = us.user_id
      WHERE u.id = ${childId} AND u.parent_id = ${session.user.id} AND u.role = 'child'
    `

    if (!childResult[0]) {
      return NextResponse.json({ message: "Child not found" }, { status: 404 })
    }

    const child = childResult[0]

    // Perform transfer
    const newParentBalance = await updateWalletBalance(session.user.id, -amount)
    const newChildBalance = await updateWalletBalance(childId, amount)

    // Create transaction records
    const parentTransaction = await createTransaction({
      user_id: session.user.id,
      type: "transfer",
      amount: -amount,
      description: `Transfer to ${child.name}${note ? `: ${note}` : ""}`,
      related_id: childId,
      status: "completed",
    })

    const childTransaction = await createTransaction({
      user_id: childId,
      type: "transfer",
      amount: amount,
      description: `Transfer from parent${note ? `: ${note}` : ""}`,
      related_id: session.user.id,
      status: "completed",
    })

    // Create notifications
    await createNotification({
      user_id: session.user.id,
      title: "Money Transferred",
      message: `You sent $${amount.toFixed(2)} to ${child.name}`,
      type: "wallet",
    })

    await createNotification({
      user_id: childId,
      title: "Money Received",
      message: `You received $${amount.toFixed(2)} from your parent`,
      type: "wallet",
    })

    return NextResponse.json({
      message: "Transfer completed successfully",
      transaction: parentTransaction,
      parentBalance: newParentBalance,
      childBalance: newChildBalance,
    })
  } catch (error) {
    console.error("Transfer error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
