"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, TrendingUp, TrendingDown, BarChart } from "lucide-react"

export function GameHistory() {
  // Mock data for game history
  const gameHistory = [
    {
      id: "1",
      date: "Today",
      score: 850,
      happiness: 85,
      financialHealth: 90,
      allocation: {
        savings: 200,
        needs: 500,
        wants: 150,
        giving: 50,
        emergency: 100,
      },
      highScoreAchieved: true,
    },
    {
      id: "2",
      date: "Yesterday",
      score: 720,
      happiness: 75,
      financialHealth: 80,
      allocation: {
        savings: 150,
        needs: 450,
        wants: 250,
        giving: 50,
        emergency: 100,
      },
      highScoreAchieved: false,
    },
    {
      id: "3",
      date: "3 days ago",
      score: 650,
      happiness: 70,
      financialHealth: 75,
      allocation: {
        savings: 100,
        needs: 400,
        wants: 350,
        giving: 50,
        emergency: 100,
      },
      highScoreAchieved: false,
    },
    {
      id: "4",
      date: "1 week ago",
      score: 580,
      happiness: 65,
      financialHealth: 60,
      allocation: {
        savings: 100,
        needs: 350,
        wants: 400,
        giving: 50,
        emergency: 100,
      },
      highScoreAchieved: false,
    },
    {
      id: "5",
      date: "2 weeks ago",
      score: 450,
      happiness: 60,
      financialHealth: 50,
      allocation: {
        savings: 50,
        needs: 300,
        wants: 500,
        giving: 50,
        emergency: 100,
      },
      highScoreAchieved: false,
    },
  ]

  const getScoreGrade = (score: number) => {
    if (score >= 800) return { grade: "A", color: "text-green-500" }
    if (score >= 600) return { grade: "B", color: "text-blue-500" }
    if (score >= 400) return { grade: "C", color: "text-yellow-500" }
    if (score >= 200) return { grade: "D", color: "text-orange-500" }
    return { grade: "F", color: "text-red-500" }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Budget Battle History</CardTitle>
          <CardDescription>Track your progress over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="h-64 flex items-end justify-between gap-2">
              {gameHistory.map((game) => {
                const height = (game.score / 1000) * 100
                const scoreGrade = getScoreGrade(game.score)

                return (
                  <div key={game.id} className="flex flex-col items-center gap-1" style={{ width: "100%", flex: 1 }}>
                    <div
                      className={`w-full rounded-t-md ${
                        game.score >= 800
                          ? "bg-green-500"
                          : game.score >= 600
                            ? "bg-blue-500"
                            : game.score >= 400
                              ? "bg-yellow-500"
                              : game.score >= 200
                                ? "bg-orange-500"
                                : "bg-red-500"
                      }`}
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-xs">{game.date}</span>
                    <span className={`text-xs font-medium ${scoreGrade.color}`}>{scoreGrade.grade}</span>
                  </div>
                )
              })}
            </div>

            <div className="space-y-4">
              {gameHistory.map((game) => {
                const scoreGrade = getScoreGrade(game.score)
                const scoreChange =
                  game.id !== "5"
                    ? game.score - gameHistory[gameHistory.findIndex((g) => g.id === game.id) + 1].score
                    : 0

                return (
                  <div key={game.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          game.score >= 800
                            ? "bg-green-500/10 text-green-500"
                            : game.score >= 600
                              ? "bg-blue-500/10 text-blue-500"
                              : game.score >= 400
                                ? "bg-yellow-500/10 text-yellow-500"
                                : game.score >= 200
                                  ? "bg-orange-500/10 text-orange-500"
                                  : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        <Trophy className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">Game on {game.date}</h3>
                          {game.highScoreAchieved && <Badge className="bg-yellow-500">High Score!</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Happiness: {game.happiness}% | Financial Health: {game.financialHealth}%
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {game.id !== "5" && (
                        <div className={`flex items-center ${scoreChange >= 0 ? "text-green-500" : "text-red-500"}`}>
                          {scoreChange >= 0 ? (
                            <TrendingUp className="h-4 w-4 mr-1" />
                          ) : (
                            <TrendingDown className="h-4 w-4 mr-1" />
                          )}
                          <span className="text-sm font-medium">
                            {scoreChange > 0 ? "+" : ""}
                            {scoreChange}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <span className="text-lg font-bold">{game.score}</span>
                        <span className={`text-sm font-medium ${scoreGrade.color}`}>({scoreGrade.grade})</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart className="h-5 w-5 mr-2 text-blue-500" />
            Budget Allocation Trends
          </CardTitle>
          <CardDescription>How your budgeting strategy has evolved</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {["savings", "needs", "wants", "giving", "emergency"].map((category) => {
              const categoryData = gameHistory
                .map((game) => ({
                  date: game.date,
                  value: game.allocation[category as keyof typeof game.allocation],
                }))
                .reverse()

              let color = ""
              switch (category) {
                case "savings":
                  color = "bg-blue-500"
                  break
                case "needs":
                  color = "bg-green-500"
                  break
                case "wants":
                  color = "bg-purple-500"
                  break
                case "giving":
                  color = "bg-amber-500"
                  break
                case "emergency":
                  color = "bg-red-500"
                  break
              }

              return (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium capitalize">{category}</h3>
                    <div className="text-sm text-muted-foreground">
                      Trend:{" "}
                      {categoryData[0].value < categoryData[categoryData.length - 1].value ? (
                        <span className="text-green-500">Increasing</span>
                      ) : (
                        <span className="text-red-500">Decreasing</span>
                      )}
                    </div>
                  </div>
                  <div className="h-8 flex items-center gap-1">
                    {categoryData.map((data, index) => (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div className="w-full h-6 relative">
                          <div
                            className={`absolute bottom-0 w-full ${color}`}
                            style={{ height: `${(data.value / 500) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs mt-1">{data.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
