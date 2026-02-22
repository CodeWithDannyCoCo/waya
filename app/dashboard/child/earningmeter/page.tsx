"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BusinessSelection } from "@/components/earning-meter/business-selection"
import { BusinessSetup } from "@/components/earning-meter/business-setup"
import { BusinessDashboard } from "@/components/earning-meter/business-dashboard"
import { DailyDecisions } from "@/components/earning-meter/daily-decisions"
import { PerformanceReview } from "@/components/earning-meter/performance-review"
import type { BusinessType, GameState } from "@/components/earning-meter/types"

export default function EarningMeterPage() {
  const [gameState, setGameState] = useState<GameState>({
    phase: "selection",
    business: null,
    businessName: "",
    day: 0,
    balance: 100, // Starting money
    inventory: 0,
    quality: 50,
    price: 0,
    marketing: 0,
    reputation: 50,
    customers: 0,
    xp: 0,
    level: 1,
    history: [],
    events: [],
  })

  const handleBusinessSelect = (business: BusinessType) => {
    setGameState({
      ...gameState,
      phase: "setup",
      business,
    })
  }

  const handleBusinessSetup = (name: string, price: number, inventory: number, marketing: number) => {
    setGameState({
      ...gameState,
      phase: "running",
      businessName: name,
      price,
      inventory,
      marketing,
      day: 1,
    })
  }

  const handleDailyDecisions = (price: number, inventory: number, marketing: number, quality: number) => {
    // Simulate a business day
    const event = generateRandomEvent(gameState)
    const result = simulateBusinessDay(gameState, price, inventory, marketing, quality, event)

    setGameState({
      ...gameState,
      phase: "review",
      price,
      inventory: result.remainingInventory,
      marketing,
      quality,
      balance: gameState.balance + result.profit,
      customers: result.customers,
      reputation: Math.max(0, Math.min(100, gameState.reputation + result.reputationChange)),
      xp: gameState.xp + result.xp,
      level: calculateLevel(gameState.xp + result.xp),
      history: [
        ...gameState.history,
        {
          day: gameState.day,
          profit: result.profit,
          customers: result.customers,
          reputation: result.reputationChange,
          feedback: result.feedback,
        },
      ],
      events: [...gameState.events, event],
    })
  }

  const handleContinue = () => {
    if (gameState.inventory <= 0) {
      // Force restock if out of inventory
      setGameState({
        ...gameState,
        phase: "decisions",
        day: gameState.day + 1,
      })
    } else {
      setGameState({
        ...gameState,
        phase: "decisions",
        day: gameState.day + 1,
      })
    }
  }

  const handleRestart = () => {
    setGameState({
      ...gameState,
      phase: "selection",
      business: null,
      businessName: "",
      day: 0,
      balance: 100,
      inventory: 0,
      quality: 50,
      price: 0,
      marketing: 0,
      reputation: 50,
      customers: 0,
      history: [],
      events: [],
    })
  }

  // Helper functions
  const generateRandomEvent = (state: GameState) => {
    const events = [
      {
        id: 1,
        name: "Hot Day!",
        description: "Perfect weather for your business! +20% customers today.",
        effect: "positive",
        impact: 20,
      },
      {
        id: 2,
        name: "Competitor Appears!",
        description: "A new competitor opened nearby. -10% customers.",
        effect: "negative",
        impact: -10,
      },
      {
        id: 3,
        name: "Social Media Trend!",
        description: "Your business is trending online! +15% customers.",
        effect: "positive",
        impact: 15,
      },
      {
        id: 4,
        name: "Supply Shortage!",
        description: "Supplies cost more today. -5% profit margin.",
        effect: "negative",
        impact: -5,
      },
      {
        id: 5,
        name: "Local Event!",
        description: "A local event brings more foot traffic. +10% customers.",
        effect: "positive",
        impact: 10,
      },
      {
        id: 6,
        name: "Bad Weather!",
        description: "Rain keeps customers away. -15% customers today.",
        effect: "negative",
        impact: -15,
      },
      {
        id: 7,
        name: "Celebrity Visit!",
        description: "A local celebrity visited! +25% reputation.",
        effect: "positive",
        impact: 25,
      },
      {
        id: 8,
        name: "Quality Issue!",
        description: "Customers complained about quality. -10% reputation.",
        effect: "negative",
        impact: -10,
      },
    ]

    // 30% chance of an event occurring
    if (Math.random() < 0.3) {
      return events[Math.floor(Math.random() * events.length)]
    }

    return null
  }

  const simulateBusinessDay = (
    state: GameState,
    price: number,
    inventory: number,
    marketing: number,
    quality: number,
    event: any,
  ) => {
    // Base calculations
    const baseCustomers = calculateBaseCustomers(state.business, state.reputation, marketing)
    const eventMultiplier =
      event && event.effect === "positive"
        ? 1 + event.impact / 100
        : event && event.effect === "negative"
          ? 1 - Math.abs(event.impact) / 100
          : 1

    // Apply event effects to customer count
    let customers = Math.floor(baseCustomers * eventMultiplier)

    // Price sensitivity - if price is too high, fewer customers
    const priceMultiplier = calculatePriceMultiplier(state.business, price)
    customers = Math.floor(customers * priceMultiplier)

    // Limit by inventory
    const actualCustomers = Math.min(customers, inventory)

    // Calculate profit
    const costPerItem = getCostPerItem(state.business, quality)
    const revenue = actualCustomers * price
    const costs = actualCustomers * costPerItem + marketing
    const profit = revenue - costs

    // Calculate reputation change based on price, quality, and if we ran out of inventory
    let reputationChange = 0
    reputationChange += quality > 70 ? 2 : quality > 50 ? 1 : quality > 30 ? 0 : -2
    reputationChange += priceMultiplier > 1 ? 1 : priceMultiplier < 0.8 ? -1 : 0
    reputationChange += actualCustomers < customers ? -3 : 0 // Ran out of inventory

    // Apply event effects to reputation
    if (event && event.effect === "positive" && event.name.includes("Celebrity")) {
      reputationChange += (event.impact / 100) * 10
    } else if (event && event.effect === "negative" && event.name.includes("Quality")) {
      reputationChange -= (Math.abs(event.impact) / 100) * 10
    }

    // Generate customer feedback
    const feedback = generateFeedback(quality, price, actualCustomers < customers)

    // Calculate XP gained
    const xp = Math.max(1, Math.floor(profit / 10) + (reputationChange > 0 ? 2 : 0))

    return {
      customers: actualCustomers,
      profit,
      remainingInventory: inventory - actualCustomers,
      reputationChange,
      feedback,
      xp,
    }
  }

  const calculateBaseCustomers = (businessType: BusinessType | null, reputation: number, marketing: number) => {
    if (!businessType) return 0

    // Base customers depend on business type
    let baseCustomers = 0
    switch (businessType.id) {
      case "lemonade":
        baseCustomers = 10
        break
      case "petSitting":
        baseCustomers = 5
        break
      case "artShop":
        baseCustomers = 7
        break
      case "ecommerce":
        baseCustomers = 15
        break
      default:
        baseCustomers = 10
    }

    // Reputation and marketing boost
    const reputationMultiplier = 0.5 + reputation / 100
    const marketingBoost = Math.sqrt(marketing) / 2

    return Math.floor(baseCustomers * reputationMultiplier + marketingBoost)
  }

  const calculatePriceMultiplier = (businessType: BusinessType | null, price: number) => {
    if (!businessType) return 1

    // Each business has an optimal price range
    let optimalPrice = 0
    let priceElasticity = 0

    switch (businessType.id) {
      case "lemonade":
        optimalPrice = 3
        priceElasticity = 0.5
        break
      case "petSitting":
        optimalPrice = 15
        priceElasticity = 0.3
        break
      case "artShop":
        optimalPrice = 20
        priceElasticity = 0.4
        break
      case "ecommerce":
        optimalPrice = 25
        priceElasticity = 0.6
        break
      default:
        optimalPrice = 10
        priceElasticity = 0.5
    }

    // Calculate how far from optimal price
    const priceDifference = Math.abs(price - optimalPrice) / optimalPrice

    // Apply elasticity - higher elasticity means more sensitive to price changes
    return Math.max(0.1, 1 - priceDifference * priceElasticity)
  }

  const getCostPerItem = (businessType: BusinessType | null, quality: number) => {
    if (!businessType) return 0

    // Base cost depends on business type
    let baseCost = 0
    switch (businessType.id) {
      case "lemonade":
        baseCost = 1
        break
      case "petSitting":
        baseCost = 5
        break
      case "artShop":
        baseCost = 8
        break
      case "ecommerce":
        baseCost = 10
        break
      default:
        baseCost = 5
    }

    // Quality increases cost
    const qualityMultiplier = 0.5 + quality / 100

    return baseCost * qualityMultiplier
  }

  const generateFeedback = (quality: number, price: number, soldOut: boolean) => {
    const feedbacks = []

    if (quality > 80) {
      feedbacks.push("Amazing quality! Will come back!")
    } else if (quality > 60) {
      feedbacks.push("Good quality product!")
    } else if (quality > 40) {
      feedbacks.push("Quality was okay.")
    } else {
      feedbacks.push("Quality needs improvement.")
    }

    if (price < 5) {
      feedbacks.push("Great price!")
    } else if (price < 15) {
      feedbacks.push("Price seems fair.")
    } else if (price < 25) {
      feedbacks.push("A bit expensive.")
    } else {
      feedbacks.push("Too expensive!")
    }

    if (soldOut) {
      feedbacks.push("You ran out of stock!")
    }

    // Return random feedback from the generated ones
    return feedbacks[Math.floor(Math.random() * feedbacks.length)]
  }

  const calculateLevel = (xp: number) => {
    // Simple level calculation - each level requires 100 XP
    return Math.floor(xp / 100) + 1
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">EarningMeter</CardTitle>
          <CardDescription>Learn entrepreneurship by running your own virtual business!</CardDescription>
        </CardHeader>
        <CardContent>
          {gameState.phase === "selection" && <BusinessSelection onSelect={handleBusinessSelect} />}

          {gameState.phase === "setup" && gameState.business && (
            <BusinessSetup business={gameState.business} balance={gameState.balance} onComplete={handleBusinessSetup} />
          )}

          {(gameState.phase === "running" || gameState.phase === "decisions") && (
            <div className="space-y-6">
              <BusinessDashboard gameState={gameState} />

              <DailyDecisions gameState={gameState} onSubmit={handleDailyDecisions} />
            </div>
          )}

          {gameState.phase === "review" && (
            <PerformanceReview gameState={gameState} onContinue={handleContinue} onRestart={handleRestart} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
