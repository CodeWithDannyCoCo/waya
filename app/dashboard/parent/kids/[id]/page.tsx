import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, User, Star, Trophy, CheckSquare } from "lucide-react"

export default function KidProfilePage({ params }: { params: { id: string } }) {
  // In a real app, we would fetch the kid's data based on the ID
  // For now, we'll use mock data
  const kidId = params.id

  const kid = {
    id: kidId,
    name: kidId === "kid1" ? "Alex" : "Jamie",
    avatar: "/placeholder.svg?height=100&width=100",
    level: kidId === "kid1" ? 5 : 3,
    xp: kidId === "kid1" ? 340 : 180,
    nextLevelXP: kidId === "kid1" ? 500 : 300,
    coins: kidId === "kid1" ? 275 : 120,
    completedChores: kidId === "kid1" ? 8 : 4,
    pendingChores: kidId === "kid1" ? 2 : 1,
    joinDate: "January 15, 2023",
    streak: kidId === "kid1" ? 3 : 1,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/parent/kids">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Kids
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <Card className="md:w-1/3">
          <CardHeader>
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={kid.avatar} alt={kid.name} />
                <AvatarFallback>
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              <CardTitle className="mt-4">{kid.name}</CardTitle>
              <CardDescription>Level {kid.level} Explorer</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                  <Star className="h-5 w-5 text-yellow-500 mb-1" />
                  <div className="font-bold">{kid.coins}</div>
                  <div className="text-xs text-muted-foreground">Coins</div>
                </div>
                <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                  <Trophy className="h-5 w-5 text-amber-500 mb-1" />
                  <div className="font-bold">{kid.streak}</div>
                  <div className="text-xs text-muted-foreground">Day Streak</div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Level {kid.level}</span>
                  <span>Level {kid.level + 1}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${(kid.xp / kid.nextLevelXP) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-right text-muted-foreground">
                  {kid.xp}/{kid.nextLevelXP} XP
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Joined</span>
                  <span className="text-sm">{kid.joinDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Completed Chores</span>
                  <span className="text-sm">{kid.completedChores}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Pending Chores</span>
                  <span className="text-sm">{kid.pendingChores}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex-1">
          <Tabs defaultValue="chores">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="chores">
                <CheckSquare className="h-4 w-4 mr-2" />
                Chores
              </TabsTrigger>
              <TabsTrigger value="rewards">
                <Star className="h-4 w-4 mr-2" />
                Rewards
              </TabsTrigger>
              <TabsTrigger value="achievements">
                <Trophy className="h-4 w-4 mr-2" />
                Achievements
              </TabsTrigger>
            </TabsList>
            <TabsContent value="chores" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Chore History</CardTitle>
                  <CardDescription>View and manage {kid.name}'s chores</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Chore history will be displayed here.</p>
                    <Button className="mt-4" asChild>
                      <Link href="/dashboard/parent/chores">
                        <CheckSquare className="mr-2 h-4 w-4" />
                        Manage Chores
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="rewards" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Reward History</CardTitle>
                  <CardDescription>View {kid.name}'s redeemed rewards</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Reward history will be displayed here.</p>
                    <Button className="mt-4" asChild>
                      <Link href="/dashboard/parent/settings">
                        <Star className="mr-2 h-4 w-4" />
                        Manage Rewards
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="achievements" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                  <CardDescription>View {kid.name}'s achievements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Achievements will be displayed here.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
