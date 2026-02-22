"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { BusinessType } from "./types"
import { Coffee, Palette, ShoppingBag, Cat } from "lucide-react"

interface BusinessSelectionProps {
  onSelect: (business: BusinessType) => void
}

export function BusinessSelection({ onSelect }: BusinessSelectionProps) {
  const businesses: BusinessType[] = [
    {
      id: "lemonade",
      name: "Lemonade Stand",
      description: "A classic first business! Sell refreshing lemonade to thirsty customers.",
      icon: "Coffee",
      startupCost: 20,
      difficulty: "easy",
      priceRange: {
        min: 1,
        max: 5,
        optimal: 3,
      },
    },
    {
      id: "petSitting",
      name: "Pet Sitting Service",
      description: "Take care of pets while their owners are away.",
      icon: "Cat",
      startupCost: 30,
      difficulty: "medium",
      priceRange: {
        min: 10,
        max: 30,
        optimal: 15,
      },
    },
    {
      id: "artShop",
      name: "Art Shop",
      description: "Create and sell your own artwork and crafts.",
      icon: "Palette",
      startupCost: 50,
      difficulty: "medium",
      priceRange: {
        min: 15,
        max: 40,
        optimal: 25,
      },
    },
    {
      id: "ecommerce",
      name: "Mini eCommerce",
      description: "Buy and resell popular items online.",
      icon: "ShoppingBag",
      startupCost: 80,
      difficulty: "hard",
      priceRange: {
        min: 15,
        max: 50,
        optimal: 30,
      },
    },
  ]

  const [selectedBusiness, setSelectedBusiness] = useState<BusinessType | null>(null)

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Coffee":
        return <Coffee className="h-8 w-8" />
      case "Cat":
        return <Cat className="h-8 w-8" />
      case "Palette":
        return <Palette className="h-8 w-8" />
      case "ShoppingBag":
        return <ShoppingBag className="h-8 w-8" />
      default:
        return <Coffee className="h-8 w-8" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Choose Your Business</h2>
        <p className="text-muted-foreground">
          Select the type of business you want to start. Each has different costs, challenges, and profit potential.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {businesses.map((business) => (
          <Card
            key={business.id}
            className={`cursor-pointer transition-all ${selectedBusiness?.id === business.id ? "border-primary ring-2 ring-primary/20" : "hover:border-primary/50"}`}
            onClick={() => setSelectedBusiness(business)}
          >
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="bg-primary/10 p-2 rounded-md">{getIcon(business.icon)}</div>
              <div>
                <CardTitle>{business.name}</CardTitle>
                <CardDescription>Startup Cost: ${business.startupCost}</CardDescription>
              </div>
              <Badge className={`ml-auto ${getDifficultyColor(business.difficulty)}`}>
                {business.difficulty.charAt(0).toUpperCase() + business.difficulty.slice(1)}
              </Badge>
            </CardHeader>
            <CardContent>
              <p>{business.description}</p>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Price Range: ${business.priceRange.min} - ${business.priceRange.max}
              </p>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button size="lg" disabled={!selectedBusiness} onClick={() => selectedBusiness && onSelect(selectedBusiness)}>
          Start Business
        </Button>
      </div>
    </div>
  )
}
