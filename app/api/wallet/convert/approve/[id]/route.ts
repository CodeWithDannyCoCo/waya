import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import bcrypt from "bcryptjs"
import {
  updateConversionRequest,
  updateWalletBalance,
  createTransaction,
  createNotification,
  getWalletPin,
} from "@/lib/db"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id || session.user.role !== "parent") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { pin, note } = await request.json()

    if (!pin) {
      return NextResponse.json({ message: "PIN is required" }, { status: 400 })
    }

    // Verify PIN
    const storedPinHash = await getWalletPin(session.user.id)
    if (!storedPinHash) {
      return NextResponse.json({ message: "PIN not set" }, { status: 400 })
    }

    const isValidPin = await bcrypt.compare(pin, storedPinHash)
    if (!isValidPin) {
      return NextResponse.json({ message: "Invalid PIN" }, { status: 400 })
    }

    // Get conversion request
    const requestResult = await sql`
      SELECT cr.*, u.name as child_name
      FROM conversion_requests cr
      JOIN users u ON cr.child_id = u.id
      WHERE cr.id = ${params.id} AND u.parent_id = ${session.user.id} AND cr.status = 'pending'
    `

    if (!requestResult[0]) {
      return NextResponse.json({ message: "Conversion request not found" }, { status: 404 })
    }

    const conversionRequest = requestResult[0]

    // Update child's wallet balance
    const newChildBalance = await updateWalletBalance(conversionRequest.child_id, conversionRequest.money_amount)

    // Create transaction
    const transaction = await createTransaction({
      user_id: conversionRequest.child_id,
      type: "conversion",
      amount: conversionRequest.money_amount,
      coin_amount: -conversionRequest.coin_amount,
      description: `Converted ${conversionRequest.coin_amount} coins to money`,
      related_id: params.id,
      status: "completed",
    })

    // Update request status
    await updateConversionRequest(params.id, "approved", note)

    // Notify child
    await createNotification({
      user_id: conversionRequest.child_id,
      title: "Conversion Approved",
      message: `Your conversion of ${conversionRequest.coin_amount} coins to $${conversionRequest.money_amount.toFixed(2)} has been approved`,
      type: "conversion",
      related_id: params.id,
    })

    return NextResponse.json({
      message: "Conversion request approved successfully",
      transaction,
      childBalance: newChildBalance,
    })
  } catch (error) {
    console.error("Approve conversion error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
