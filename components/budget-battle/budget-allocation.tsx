"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { PiggyBank, ShoppingCart, Coffee, Gift, AlertTriangle } from "lucide-react"

type BudgetCategory = "savings" | "needs" | "wants" | "giving" | "emergency"

type BudgetAllocationProps = {
  allowance: number
  allocation: {
    [key in BudgetCategory]: number
  }
  remainingToAllocate: number
  onAllocationChange: (category: BudgetCategory, amount: number) => boolean
}

export function BudgetAllocation({
  allowance,
  allocation,
  remainingToAllocate,
  onAllocationChange,
}: BudgetAllocationProps) {
  const categories: { id: BudgetCategory; name: string; icon: React.ReactNode; color: string }[] = [
    {
      id: "savings",
      name: "Savings",
      icon: <PiggyBank className="h-5 w-5" />,
      color: "bg-blue-500",
    },
    {
      id: "needs",
      name: "Needs",
      icon: <ShoppingCart className="h-5 w-5" />,
      color: "bg-green-500",
    },
    {
      id: "wants",
      name: "Wants",
      icon: <Coffee className="h-5 w-5" />,
      color: "bg-purple-500",
    },
    {
      id: "giving",
      name: "Giving",
      icon: <Gift className="h-5 w-5" />,
      color: "bg-amber-500",
    },
    {
      id: "emergency",
      name: "Emergency",
      icon: <AlertTriangle className="h-5 w-5" />,
      color: "bg-red-500",
    },
  ]

  const handleSliderChange = (category: BudgetCategory, values: number[]) => {
    const newValue = values[0]
    onAllocationChange(category, newValue)
  }

  const getAllocationPercentage = (amount: number) => {
    return Math.round((amount / allowance) * 100)
  }

  return (
    <div className="space-y-6">
      <div className="bg-muted p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Remaining to Allocate:</span>
          <span className="text-lg font-bold">{remainingToAllocate} coins</span>
        </div>
        <Progress value={(1 - remainingToAllocate / allowance) * 100} className="h-2" />
        <p className="text-xs text-muted-foreground mt-2">
          Allocate all of your allowance across the categories below before continuing.
        </p>
      </div>

      <div className="space-y-8">
        {categories.map((category) => (
          <div key={category.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-full text-white ${category.color}`}>{category.icon}</div>
                <span className="font-medium">{category.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{allocation[category.id]} coins</span>
                <span className="text-xs text-muted-foreground">
                  ({getAllocationPercentage(allocation[category.id])}%)
                </span>
              </div>
            </div>

            <Slider
              value={[allocation[category.id]]}
              max={allowance}
              step={10}
              onValueChange={(values) => handleSliderChange(category.id, values)}
              className="py-2"
            />

            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${category.color}`}
                initial={{ width: 0 }}
                animate={{ width: `${getAllocationPercentage(allocation[category.id])}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
