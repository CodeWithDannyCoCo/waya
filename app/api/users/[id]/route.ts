import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = params.id

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Get user with stats
    const result = await sql`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.username,
        u.role,
        u.parent_id,
        u.image,
        u.created_at,
        us.coins,
        us.wallet_balance,
        us.streak,
        us.level,
        us.xp
      FROM users u
      LEFT JOIN user_stats us ON u.id = us.user_id
      WHERE u.id = ${userId}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const user = result[0]

    // Format response
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
      parentId: user.parent_id,
      image: user.image,
      totalCoins: user.coins || 0,
      totalXp: user.xp || 0,
      level: user.level || 1,
      streakDays: user.streak || 0,
      walletBalance: Number.parseFloat(user.wallet_balance || "0"),
      createdAt: user.created_at,
    }

    return NextResponse.json(userResponse)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}
