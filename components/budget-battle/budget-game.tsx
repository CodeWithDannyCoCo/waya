"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BudgetAllocation } from "@/components/budget-battle/budget-allocation"
import { ScenarioCard } from "@/components/budget-battle/scenario-card"
import { GameSummary } from "@/components/budget-battle/game-summary"
import { DollarSign, CheckCircle, ArrowRight, PiggyBank, ShoppingCart, Gift, Coffee, AlertTriangle } from "lucide-react"

type GamePhase = "allocation" | "scenarios" | "summary"
type BudgetCategory = "savings" | "needs" | "wants" | "giving" | "emergency"

type BudgetAllocationType = {
  [key in BudgetCategory]: number
}

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

type GameState = {
  allowance: number
  allocation: BudgetAllocationType
  remainingToAllocate: number
  scenarios: Scenario[]
  currentScenario: number
  score: number
  happiness: number
  financialHealth: number
  decisions: {
    scenarioId: string
    optionChosen: number
    outcome: string
    scoreImpact: number
  }[]
}

export function BudgetGame({ onGameEnd }: { onGameEnd: (score: number) => void }) {
  const [phase, setPhase] = useState<GamePhase>("allocation")
  const [gameState, setGameState] = useState<GameState>({
    allowance: 1000,
    allocation: {
      savings: 0,
      needs: 0,
      wants: 0,
      giving: 0,
      emergency: 0,
    },
    remainingToAllocate: 1000,
    scenarios: [
      {
        id: "s1",
        title: "Surprise Birthday Party",
        description: "Your friend is having a birthday party this weekend. You'd like to buy them a gift.",
        category: "wants",
        cost: 200,
        options: [
          {
            text: "Buy an expensive gift using your 'wants' budget",
            outcome: "Your friend loved the gift! But it used a big chunk of your wants budget.",
            impact: { score: 50, happiness: 20, financial: -10 },
          },
          {
            text: "Make a homemade gift instead",
            outcome: "Your friend appreciated the thoughtful homemade gift, and you saved money!",
            impact: { score: 100, happiness: 10, financial: 20 },
          },
          {
            text: "Skip the gift entirely",
            outcome: "Your friend was disappointed. Saving money is important, but so are relationships.",
            impact: { score: -20, happiness: -20, financial: 10 },
          },
        ],
      },
      {
        id: "s2",
        title: "Lunch Decision",
        description: "You're out with friends and everyone is buying lunch from a restaurant.",
        category: "needs",
        cost: 150,
        options: [
          {
            text: "Buy an expensive meal to impress your friends",
            outcome: "The meal was tasty but overpriced. Your food budget is now strained.",
            impact: { score: -10, happiness: 5, financial: -15 },
          },
          {
            text: "Choose a reasonably priced meal",
            outcome: "You enjoyed your meal and stayed within your budget. Good choice!",
            impact: { score: 80, happiness: 10, financial: 10 },
          },
          {
            text: "Say you're not hungry and skip the meal",
            outcome: "You saved money but felt left out and hungry.",
            impact: { score: 20, happiness: -15, financial: 15 },
          },
        ],
      },
      {
        id: "s3",
        title: "Broken Bike",
        description: "Your bike chain broke and you need it for transportation. Repairs will cost money.",
        category: "emergency",
        cost: 100,
        options: [
          {
            text: "Use your emergency fund to fix it",
            outcome: "You fixed your bike and can get around again. This is what emergency funds are for!",
            impact: { score: 100, happiness: 15, financial: 15 },
          },
          {
            text: "Use money from your wants budget",
            outcome: "You fixed your bike but now have less for fun activities.",
            impact: { score: 60, happiness: 5, financial: 5 },
          },
          {
            text: "Don't fix it and walk everywhere",
            outcome: "You're saving money but transportation is now difficult and time-consuming.",
            impact: { score: 20, happiness: -20, financial: 20 },
          },
        ],
        isEmergency: true,
      },
      {
        id: "s4",
        title: "Charity Fundraiser",
        description: "Your school is raising money for a local charity. They're asking for donations.",
        category: "giving",
        cost: 50,
        options: [
          {
            text: "Donate generously from your giving budget",
            outcome: "Your donation made a difference! You feel good about helping others.",
            impact: { score: 100, happiness: 20, financial: 0 },
          },
          {
            text: "Give a small amount",
            outcome: "You contributed what you could. Every little bit helps!",
            impact: { score: 70, happiness: 10, financial: 5 },
          },
          {
            text: "Don't donate anything",
            outcome: "You saved your money but missed an opportunity to help others.",
            impact: { score: 0, happiness: -5, financial: 10 },
          },
        ],
      },
      {
        id: "s5",
        title: "Sale on Your Favorite Game",
        description: "That video game you've been wanting is on sale for 30% off, but it's still expensive.",
        category: "wants",
        cost: 300,
        options: [
          {
            text: "Buy it now with your wants budget",
            outcome: "You got the game at a discount! But it used most of your wants budget.",
            impact: { score: 40, happiness: 15, financial: -10 },
          },
          {
            text: "Save up for another month before buying",
            outcome: "Delayed gratification! You'll have enough saved without straining your budget.",
            impact: { score: 90, happiness: 5, financial: 20 },
          },
          {
            text: "Skip it entirely and save the money",
            outcome: "You're building good saving habits, but missed out on something you wanted.",
            impact: { score: 60, happiness: -5, financial: 25 },
          },
        ],
      },
    ],
    currentScenario: 0,
    score: 0,
    happiness: 50,
    financialHealth: 50,
    decisions: [],
  })

  const handleAllocationChange = (category: BudgetCategory, amount: number) => {
    const currentAmount = gameState.allocation[category]
    const difference = amount - currentAmount

    if (gameState.remainingToAllocate - difference < 0) {
      // Not enough to allocate
      return false
    }

    setGameState((prev) => ({
      ...prev,
      allocation: {
        ...prev.allocation,
        [category]: amount,
      },
      remainingToAllocate: prev.remainingToAllocate - difference,
    }))

    return true
  }

  const handleAllocationComplete = () => {
    // Check if all money has been allocated
    if (gameState.remainingToAllocate > 0) {
      alert("Please allocate all of your allowance before continuing!")
      return
    }

    setPhase("scenarios")
  }

  const handleScenarioDecision = (optionIndex: number) => {
    const currentScenario = gameState.scenarios[gameState.currentScenario]
    const option = currentScenario.options[optionIndex]

    // Check if they have enough in the relevant budget category
    const relevantCategory = currentScenario.category
    const categoryBudget = gameState.allocation[relevantCategory]
    const cost = currentScenario.cost

    let newScore = gameState.score + option.impact.score
    const newHappiness = Math.min(100, Math.max(0, gameState.happiness + option.impact.happiness))
    let newFinancialHealth = Math.min(100, Math.max(0, gameState.financialHealth + option.impact.financial))

    // If they don't have enough in the category budget, penalize score
    if (
      categoryBudget < cost &&
      !option.text.toLowerCase().includes("don't") &&
      !option.text.toLowerCase().includes("skip")
    ) {
      newScore -= 50
      newFinancialHealth -= 20
    }

    // Record the decision
    const newDecisions = [
      ...gameState.decisions,
      {
        scenarioId: currentScenario.id,
        optionChosen: optionIndex,
        outcome: option.outcome,
        scoreImpact: option.impact.score,
      },
    ]

    // Move to next scenario or end game
    if (gameState.currentScenario < gameState.scenarios.length - 1) {
      setGameState((prev) => ({
        ...prev,
        currentScenario: prev.currentScenario + 1,
        score: newScore,
        happiness: newHappiness,
        financialHealth: newFinancialHealth,
        decisions: newDecisions,
      }))
    } else {
      // Game over, move to summary
      setGameState((prev) => ({
        ...prev,
        score: newScore,
        happiness: newHappiness,
        financialHealth: newFinancialHealth,
        decisions: newDecisions,
      }))
      setPhase("summary")
    }
  }

  const handleGameEnd = () => {
    // Calculate final score based on allocation quality and decisions
    const finalScore = calculateFinalScore()
    onGameEnd(finalScore)
  }

  const calculateFinalScore = () => {
    // Base score from decisions
    let score = gameState.score

    // Bonus for good allocation (this is simplified - you could make this more complex)
    const { savings, emergency, needs, wants, giving } = gameState.allocation
    const totalBudget = gameState.allowance

    // Ideal allocation might be something like: 20% savings, 10% emergency, 50% needs, 15% wants, 5% giving
    // Give bonus points for being close to this allocation
    if (savings >= totalBudget * 0.15) score += 50
    if (emergency >= totalBudget * 0.08) score += 50
    if (needs >= totalBudget * 0.45) score += 50
    if (wants <= totalBudget * 0.2) score += 50
    if (giving >= totalBudget * 0.03) score += 50

    // Bonus for happiness and financial health
    score += gameState.happiness / 2
    score += gameState.financialHealth / 2

    return Math.max(0, Math.round(score))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>
              {phase === "allocation" && "Budget Allocation"}
              {phase === "scenarios" && "Financial Scenarios"}
              {phase === "summary" && "Game Summary"}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
                <DollarSign className="h-3 w-3 mr-1" />
                Score: {gameState.score}
              </Badge>
              <Badge variant="outline" className="bg-pink-500/10 text-pink-500">
                <Coffee className="h-3 w-3 mr-1" />
                Happiness: {gameState.happiness}%
              </Badge>
              <Badge variant="outline" className="bg-green-500/10 text-green-500">
                <PiggyBank className="h-3 w-3 mr-1" />
                Financial: {gameState.financialHealth}%
              </Badge>
            </div>
          </div>
          <CardDescription>
            {phase === "allocation" && "Divide your allowance of 1,000 coins across different budget categories"}
            {phase === "scenarios" && `Scenario ${gameState.currentScenario + 1} of ${gameState.scenarios.length}`}
            {phase === "summary" && "See how well you managed your budget"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            {phase === "allocation" && (
              <motion.div key="allocation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <BudgetAllocation
                  allowance={gameState.allowance}
                  allocation={gameState.allocation}
                  remainingToAllocate={gameState.remainingToAllocate}
                  onAllocationChange={handleAllocationChange}
                />
              </motion.div>
            )}

            {phase === "scenarios" && (
              <motion.div
                key="scenarios"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <ScenarioCard
                  scenario={gameState.scenarios[gameState.currentScenario]}
                  onDecision={handleScenarioDecision}
                  budgetCategory={gameState.scenarios[gameState.currentScenario].category}
                  budgetAmount={gameState.allocation[gameState.scenarios[gameState.currentScenario].category]}
                />
              </motion.div>
            )}

            {phase === "summary" && (
              <motion.div key="summary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <GameSummary
                  allocation={gameState.allocation}
                  decisions={gameState.decisions}
                  scenarios={gameState.scenarios}
                  score={gameState.score}
                  happiness={gameState.happiness}
                  financialHealth={gameState.financialHealth}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
        <CardFooter className="flex justify-between">
          {phase === "allocation" && (
            <div className="w-full flex justify-end">
              <Button onClick={handleAllocationComplete} disabled={gameState.remainingToAllocate > 0}>
                Continue to Scenarios
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {phase === "summary" && (
            <div className="w-full flex justify-end">
              <Button onClick={handleGameEnd}>
                Finish Game
                <CheckCircle className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>

      {phase === "allocation" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Budget Categories</CardTitle>
            <CardDescription>Understanding where your money should go</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <PiggyBank className="h-5 w-5 text-blue-500 mr-2" />
                  <h3 className="font-medium">Savings</h3>
                </div>
                <p className="text-sm text-muted-foreground">Money set aside for future goals and large purchases.</p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <ShoppingCart className="h-5 w-5 text-green-500 mr-2" />
                  <h3 className="font-medium">Needs</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Essential expenses like food, transportation, and supplies.
                </p>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Coffee className="h-5 w-5 text-purple-500 mr-2" />
                  <h3 className="font-medium">Wants</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Non-essential items like entertainment, games, and treats.
                </p>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Gift className="h-5 w-5 text-amber-500 mr-2" />
                  <h3 className="font-medium">Giving</h3>
                </div>
                <p className="text-sm text-muted-foreground">Money for gifts, donations, and helping others.</p>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                  <h3 className="font-medium">Emergency</h3>
                </div>
                <p className="text-sm text-muted-foreground">Funds for unexpected expenses and emergencies.</p>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              <p className="font-medium">Tip:</p>
              <p>
                A common budgeting guideline is the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings and
                emergencies.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
