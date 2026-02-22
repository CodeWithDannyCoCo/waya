import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import bcrypt from "bcryptjs"
import { setWalletPin } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id || session.user.role !== "parent") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { pin, confirmPin } = await request.json()

    if (!pin || !confirmPin) {
      return NextResponse.json({ message: "PIN and confirmation are required" }, { status: 400 })
    }

    if (pin !== confirmPin) {
      return NextResponse.json({ message: "PINs do not match" }, { status: 400 })
    }

    // Validate PIN format (4 digits)
    if (!/^\d{4}$/.test(pin)) {
      return NextResponse.json({ message: "PIN must be exactly 4 digits" }, { status: 400 })
    }

    // Hash the PIN
    const pinHash = await bcrypt.hash(pin, 12)

    // Save to database
    await setWalletPin(session.user.id, pinHash)

    return NextResponse.json({
      message: "PIN set successfully",
      pinSet: true,
    })
  } catch (error) {
    console.error("Set PIN error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
