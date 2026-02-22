"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { GameState } from "./types"
import { TrendingUp, TrendingDown, Users, Star, Award, DollarSign } from "lucide-react"

interface BusinessDashboardProps {
  gameState: GameState
}

export function BusinessDashboard({ gameState }: BusinessDashboardProps) {
  const { businessName, business, day, balance, inventory, reputation, xp, level, history } = gameState

  // Calculate profit trend
  const profitTrend =
    history.length >= 2 ? history[history.length - 1]?.profit > history[history.length - 2]?.profit : true

  // Calculate total profit
  const totalProfit = history.reduce((sum, day) => sum + day.profit, 0)

  // Calculate average customers
  const avgCustomers =
    history.length > 0 ? Math.round(history.reduce((sum, day) => sum + day.customers, 0) / history.length) : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">{businessName || "Your Business"}</h2>
          <p className="text-muted-foreground">
            {business?.name} • Day {day}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-yellow-500" />
          <span className="font-medium">Level {level}</span>
          <Progress value={xp % 100} className="w-24 h-2" />
          <span className="text-xs text-muted-foreground">{xp} XP</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">${balance.toFixed(2)}</div>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total Profit: ${totalProfit.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{inventory} units</div>
              <div
                className={`text-xs px-2 py-1 rounded-full ${
                  inventory > 10
                    ? "bg-green-100 text-green-800"
                    : inventory > 5
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {inventory > 10 ? "Well Stocked" : inventory > 5 ? "Low Stock" : "Critical Stock"}
              </div>
            </div>
            <Progress value={inventory > 50 ? 100 : (inventory / 50) * 100} className="h-1 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Reputation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{reputation}%</div>
              <Star className="h-4 w-4 text-yellow-500" />
            </div>
            <div className="mt-2">
              <Progress value={reputation} className="h-1" />
              <p className="text-xs text-muted-foreground mt-1">
                {reputation >= 80
                  ? "Excellent"
                  : reputation >= 60
                    ? "Good"
                    : reputation >= 40
                      ? "Average"
                      : reputation >= 20
                        ? "Poor"
                        : "Terrible"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {history.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Recent Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Customers</span>
                </div>
                <div className="text-2xl font-bold mt-1">{history[history.length - 1]?.customers || 0}</div>
                <p className="text-xs text-muted-foreground">Avg: {avgCustomers}/day</p>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  {profitTrend ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm font-medium">Last Profit</span>
                </div>
                <div
                  className={`text-2xl font-bold mt-1 ${
                    history[history.length - 1]?.profit >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  ${history[history.length - 1]?.profit.toFixed(2) || "0.00"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {history[history.length - 1]?.feedback || "No feedback yet"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
