"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Gift, Star, ChevronRight, Trophy, Sparkles } from "lucide-react"
import Image from "next/image"

export default function ChildRewardsPage() {
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
    {
      id: "4",
      name: "Extra Allowance",
      description: "$5 added to your allowance",
      cost: 300,
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "5",
      name: "Later Bedtime",
      description: "Stay up 30 minutes later",
      cost: 125,
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "6",
      name: "Choose Dinner",
      description: "Pick what's for dinner",
      cost: 175,
      image: "/placeholder.svg?height=80&width=80",
    },
  ]

  const achievements = [
    {
      id: "1",
      name: "First Steps",
      description: "Complete your first chore",
      icon: "🏆",
      earned: true,
    },
    {
      id: "2",
      name: "Helping Hand",
      description: "Complete 5 chores",
      icon: "🖐️",
      earned: true,
    },
    {
      id: "3",
      name: "Super Helper",
      description: "Complete 10 chores",
      icon: "⭐",
      earned: true,
    },
    {
      id: "4",
      name: "Chore Master",
      description: "Complete 25 chores",
      icon: "👑",
      earned: false,
      progress: 12,
      total: 25,
    },
    {
      id: "5",
      name: "Savings Expert",
      description: "Save 500 coins",
      icon: "💰",
      earned: false,
      progress: 275,
      total: 500,
    },
    {
      id: "6",
      name: "Perfect Week",
      description: "Complete all chores for 7 days straight",
      icon: "📅",
      earned: false,
      progress: 3,
      total: 7,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rewards & Achievements</h1>
          <p className="text-muted-foreground">Spend your coins and track your achievements</p>
        </div>
        <div className="flex items-center gap-2 bg-yellow-500/10 text-yellow-500 px-4 py-2 rounded-md">
          <Star className="h-5 w-5" />
          <span className="font-bold">{availableCoins} coins available</span>
        </div>
      </div>

      <Tabs defaultValue="rewards" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="rewards">
            <Gift className="h-4 w-4 mr-2" />
            Rewards Shop
          </TabsTrigger>
          <TabsTrigger value="achievements">
            <Trophy className="h-4 w-4 mr-2" />
            Achievements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rewards" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.map((reward) => (
              <Card key={reward.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-40 bg-muted relative">
                  <Image src={reward.image || "/placeholder.svg"} alt={reward.name} fill className="object-cover" />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle>{reward.name}</CardTitle>
                  <CardDescription>{reward.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
                      <Star className="h-3 w-3 mr-1" />
                      {reward.cost} coins
                    </Badge>
                    <Button
                      size="sm"
                      disabled={availableCoins < reward.cost}
                      onClick={() => alert(`You've redeemed: ${reward.name}`)}
                    >
                      Redeem
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <Card
                key={achievement.id}
                className={`overflow-hidden ${achievement.earned ? "border-green-500/50" : ""}`}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="text-3xl">{achievement.icon}</div>
                      <CardTitle>{achievement.name}</CardTitle>
                    </div>
                    {achievement.earned && (
                      <Badge className="bg-green-500">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Earned
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{achievement.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {!achievement.earned && achievement.progress !== undefined && (
                    <div className="space-y-2">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground text-right">
                        {achievement.progress} / {achievement.total}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
