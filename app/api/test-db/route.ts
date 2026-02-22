import { NextResponse } from "next/server"
import { testConnection } from "@/lib/db"

export async function GET() {
  try {
    console.log("Test DB API: Testing database connection...")

    const isConnected = await testConnection()

    if (isConnected) {
      console.log("Test DB API: Database connection successful")
      return NextResponse.json({
        success: true,
        message: "Database connection successful",
        timestamp: new Date().toISOString(),
      })
    } else {
      console.log("Test DB API: Database connection failed")
      return NextResponse.json(
        {
          success: false,
          message: "Database connection failed",
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Test DB API: Error testing connection:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Database connection error",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
