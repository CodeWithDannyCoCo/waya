"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PiggyBank, ShoppingCart, Coffee, Gift, AlertTriangle, DollarSign } from "lucide-react"

type BudgetCategory = "savings" | "needs" | "wants" | "giving" | "emergency"

type Scenario = {
  id: string
  title: string
  description: string
  category: BudgetCategory
  cost: number
  options: {
    text: string
    outcome: string
    impact: {
      score: number
      happiness: number
      financial: number
    }
  }[]
  isEmergency?: boolean
}

type ScenarioCardProps = {
  scenario: Scenario
  onDecision: (optionIndex: number) => void
  budgetCategory: BudgetCategory
  budgetAmount: number
}

export function ScenarioCard({ scenario, onDecision, budgetCategory, budgetAmount }: ScenarioCardProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showOutcome, setShowOutcome] = useState(false)

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index)
    setShowOutcome(true)

    // After showing outcome for a moment, proceed
    setTimeout(() => {
      onDecision(index)
      setSelectedOption(null)
      setShowOutcome(false)
    }, 3000)
  }

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

  const getCategoryColor = (category: BudgetCategory) => {
    switch (category) {
      case "savings":
        return "bg-blue-500/10 text-blue-500 border-blue-200"
      case "needs":
        return "bg-green-500/10 text-green-500 border-green-200"
      case "wants":
        return "bg-purple-500/10 text-purple-500 border-purple-200"
      case "giving":
        return "bg-amber-500/10 text-amber-500 border-amber-200"
      case "emergency":
        return "bg-red-500/10 text-red-500 border-red-200"
    }
  }

  const hasEnoughBudget = budgetAmount >= scenario.cost

  return (
    <div className="space-y-6">
      <Card className={`border-2 ${scenario.isEmergency ? "border-red-500" : ""}`}>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{scenario.title}</CardTitle>
              <CardDescription className="mt-1">{scenario.description}</CardDescription>
            </div>
            {scenario.isEmergency && <Badge className="bg-red-500">Emergency!</Badge>}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4 p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              {getCategoryIcon(scenario.category)}
              <div>
                <p className="text-sm font-medium">Category</p>
                <p className="text-base capitalize">{scenario.category}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Cost</p>
                <p className="text-base">{scenario.cost} coins</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className={`p-1 rounded-full ${hasEnoughBudget ? "bg-green-500" : "bg-red-500"}`}>
                {hasEnoughBudget ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <div>
                <p className="text-sm font-medium">Your Budget</p>
                <p className={`text-base ${hasEnoughBudget ? "text-green-500" : "text-red-500"}`}>
                  {budgetAmount} coins {hasEnoughBudget ? "(Sufficient)" : "(Insufficient)"}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">What will you do?</h3>

            {scenario.options.map((option, index) => (
              <div key={index} className="relative">
                <motion.div
                  initial={{ opacity: 1 }}
                  animate={{
                    opacity: showOutcome && selectedOption === index ? 0.5 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3 px-4"
                    onClick={() => handleOptionSelect(index)}
                    disabled={showOutcome}
                  >
                    {option.text}
                  </Button>
                </motion.div>

                {showOutcome && selectedOption === index && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-md p-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center">
                      <p className="font-medium mb-2">{option.outcome}</p>
                      <div className="flex justify-center gap-4 text-sm">
                        <span className={option.impact.score >= 0 ? "text-green-500" : "text-red-500"}>
                          Score: {option.impact.score > 0 ? "+" : ""}
                          {option.impact.score}
                        </span>
                        <span className={option.impact.happiness >= 0 ? "text-green-500" : "text-red-500"}>
                          Happiness: {option.impact.happiness > 0 ? "+" : ""}
                          {option.impact.happiness}
                        </span>
                        <span className={option.impact.financial >= 0 ? "text-green-500" : "text-red-500"}>
                          Financial: {option.impact.financial > 0 ? "+" : ""}
                          {option.impact.financial}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground">
        <p className="font-medium">Decision Tip:</p>
        <p>Consider both your current budget and long-term financial health when making decisions.</p>
      </div>
    </div>
  )
}
