"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { PiggyBank, ShoppingCart, Coffee, Gift, AlertTriangle, Trophy, Star, CheckCircle, XCircle } from "lucide-react"

type BudgetCategory = "savings" | "needs" | "wants" | "giving" | "emergency"

type GameSummaryProps = {
  allocation: {
    [key in BudgetCategory]: number
  }
  decisions: {
    scenarioId: string
    optionChosen: number
    outcome: string
    scoreImpact: number
  }[]
  scenarios: {
    id: string
    title: string
    category: BudgetCategory
    options: {
      text: string
      outcome: string
      impact: {
        score: number
        happiness: number
        financial: number
      }
    }[]
  }[]
  score: number
  happiness: number
  financialHealth: number
}

export function GameSummary({ allocation, decisions, scenarios, score, happiness, financialHealth }: GameSummaryProps) {
  const totalAllocated = Object.values(allocation).reduce((sum, val) => sum + val, 0)

  const getCategoryIcon = (category: BudgetCategory) => {
    switch (category) {
      case "savings":
        return <PiggyBank className="h-5 w-5 text-blue-500" />
      case "needs":
        return <ShoppingCart className="h-5 w-5 text-green-500" />
      case "wants":
        return <Coffee className="h-5 w-5 text-purple-500" />
      case "giving":
        return <Gift className="h-5 w-5 text-amber-500" />
      case "emergency":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
    }
  }

  const getScoreGrade = (score: number) => {
    if (score >= 800) return { grade: "A", color: "text-green-500" }
    if (score >= 600) return { grade: "B", color: "text-blue-500" }
    if (score >= 400) return { grade: "C", color: "text-yellow-500" }
    if (score >= 200) return { grade: "D", color: "text-orange-500" }
    return { grade: "F", color: "text-red-500" }
  }

  const scoreGrade = getScoreGrade(score)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border-yellow-500/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
              Final Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-4xl font-bold">{score}</div>
              <div className={`text-4xl font-bold ${scoreGrade.color}`}>{scoreGrade.grade}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Coffee className="h-5 w-5 mr-2 text-pink-500" />
              Happiness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{happiness}%</div>
              <Progress value={happiness} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <PiggyBank className="h-5 w-5 mr-2 text-green-500" />
              Financial Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{financialHealth}%</div>
              <Progress value={financialHealth} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Budget Allocation</CardTitle>
          <CardDescription>How you divided your allowance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-8 w-full bg-muted rounded-lg overflow-hidden flex">
              {Object.entries(allocation).map(([category, amount]) => {
                const percentage = (amount / totalAllocated) * 100
                let bgColor = ""

                switch (category) {
                  case "savings":
                    bgColor = "bg-blue-500"
                    break
                  case "needs":
                    bgColor = "bg-green-500"
                    break
                  case "wants":
                    bgColor = "bg-purple-500"
                    break
                  case "giving":
                    bgColor = "bg-amber-500"
                    break
                  case "emergency":
                    bgColor = "bg-red-500"
                    break
                }

                return (
                  <motion.div
                    key={category}
                    className={`h-full ${bgColor}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  />
                )
              })}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(allocation).map(([category, amount]) => {
                const percentage = Math.round((amount / totalAllocated) * 100)

                return (
                  <div key={category} className="flex flex-col items-center text-center">
                    <div className="flex items-center gap-2 mb-1">
                      {getCategoryIcon(category as BudgetCategory)}
                      <span className="font-medium capitalize">{category}</span>
                    </div>
                    <div className="text-lg font-bold">{amount}</div>
                    <div className="text-xs text-muted-foreground">{percentage}% of budget</div>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Decision Summary</CardTitle>
          <CardDescription>Your choices and their outcomes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {decisions.map((decision, index) => {
              const scenario = scenarios.find((s) => s.id === decision.scenarioId)
              if (!scenario) return null

              const option = scenario.options[decision.optionChosen]
              const isPositiveImpact = decision.scoreImpact >= 0

              return (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(scenario.category)}
                      <h3 className="font-medium">{scenario.title}</h3>
                    </div>
                    <Badge variant={isPositiveImpact ? "default" : "destructive"}>
                      {isPositiveImpact ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 mr-1" />
                      )}
                      {decision.scoreImpact > 0 ? "+" : ""}
                      {decision.scoreImpact} points
                    </Badge>
                  </div>

                  <p className="text-sm mb-2">
                    <span className="font-medium">Your choice:</span> {option.text}
                  </p>
                  <p className="text-sm text-muted-foreground">{decision.outcome}</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="h-5 w-5 mr-2 text-yellow-500" />
            Budget Battle Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 list-disc pl-5">
            <li>Aim to save at least 20% of your income for future goals.</li>
            <li>Always keep some money in your emergency fund for unexpected expenses.</li>
            <li>Prioritize needs over wants, but allow yourself some fun money too.</li>
            <li>Consider giving a small portion of your money to help others.</li>
            <li>
              When making financial decisions, think about both short-term happiness and long-term financial health.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
