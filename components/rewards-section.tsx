"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Gift, ChevronRight } from "lucide-react"
import Image from "next/image"

export function RewardsSection() {
  // Mock data
  const availableCoins = 275

  const rewards = [
    {
      id: "1",
      name: "Game Time",
      description: "30 minutes of video game time",
      cost: 100,
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "2",
      name: "Movie Night",
      description: "Pick a movie for family night",
      cost: 200,
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "3",
      name: "Special Treat",
      description: "A special dessert of your choice",
      cost: 150,
      image: "/placeholder.svg?height=80&width=80",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Gift className="h-5 w-5 mr-2 text-purple-500" />
          Rewards Shop
        </CardTitle>
        <CardDescription>Spend your {availableCoins} coins on rewards!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {rewards.map((reward) => (
          <div
            key={reward.id}
            className="flex items-center gap-3 p-2 rounded-lg border hover:bg-accent transition-colors"
          >
            <div className="w-12 h-12 relative rounded-md overflow-hidden bg-muted">
              <Image src={reward.image || "/placeholder.svg"} alt={reward.name} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium">{reward.name}</h4>
              <p className="text-xs text-muted-foreground truncate">{reward.description}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
                {reward.cost} coins
              </Badge>
              <Button size="sm" variant="ghost" className="h-7 px-2">
                Redeem <ChevronRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}

        <Button variant="outline" className="w-full mt-2" asChild>
          <Link href="/dashboard/child/rewards">View All Rewards</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
