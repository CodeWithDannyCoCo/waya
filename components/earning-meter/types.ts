export type BusinessType = {
  id: string
  name: string
  description: string
  icon: string
  startupCost: number
  difficulty: "easy" | "medium" | "hard"
  priceRange: {
    min: number
    max: number
    optimal: number
  }
}

export type DailyResult = {
  day: number
  profit: number
  customers: number
  reputation: number
  feedback: string
}

export type GameEvent = {
  id: number
  name: string
  description: string
  effect: "positive" | "negative" | "neutral"
  impact: number
} | null

export type GameState = {
  phase: "selection" | "setup" | "running" | "decisions" | "review"
  business: BusinessType | null
  businessName: string
  day: number
  balance: number
  inventory: number
  quality: number
  price: number
  marketing: number
  reputation: number
  customers: number
  xp: number
  level: number
  history: DailyResult[]
  events: GameEvent[]
}
