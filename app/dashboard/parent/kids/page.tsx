import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CreateChoreDialog } from "@/components/create-chore-dialog"
import { PlusCircle, User, CheckSquare, Settings } from "lucide-react"

export default function KidsPage() {
  // Mock data for kids
  const kids = [
    {
      id: "kid1",
      name: "Alex",
      avatar: "/placeholder.svg?height=80&width=80",
      level: 5,
      xp: 340,
      nextLevelXP: 500,
      coins: 275,
      completedChores: 8,
      pendingChores: 2,
    },
    {
      id: "kid2",
      name: "Jamie",
      avatar: "/placeholder.svg?height=80&width=80",
      level: 3,
      xp: 180,
      nextLevelXP: 300,
      coins: 120,
      completedChores: 4,
      pendingChores: 1,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Kids Management</h1>
        <p className="text-muted-foreground">Manage your children's accounts and progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {kids.map((kid) => (
          <Card key={kid.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={kid.avatar} alt={kid.name} />
                  <AvatarFallback>
                    <User className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{kid.name}</CardTitle>
                  <CardDescription>Level {kid.level} Explorer</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div className="rounded-md bg-muted p-2">
                    <div className="font-medium">{kid.coins}</div>
                    <div className="text-xs text-muted-foreground">Coins</div>
                  </div>
                  <div className="rounded-md bg-muted p-2">
                    <div className="font-medium">{kid.completedChores}</div>
                    <div className="text-xs text-muted-foreground">Completed</div>
                  </div>
                  <div className="rounded-md bg-muted p-2">
                    <div className="font-medium">{kid.pendingChores}</div>
                    <div className="text-xs text-muted-foreground">Pending</div>
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
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/parent/kids/${kid.id}`}>
                  <User className="mr-2 h-4 w-4" />
                  View Profile
                </Link>
              </Button>
              <CreateChoreDialog>
                <Button size="sm">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Assign Chore
                </Button>
              </CreateChoreDialog>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button variant="outline" className="flex-1" asChild>
          <Link href="/dashboard/parent/chores">
            <CheckSquare className="mr-2 h-4 w-4" />
            View All Chores
          </Link>
        </Button>
        <Button variant="outline" className="flex-1" asChild>
          <Link href="/dashboard/parent/settings">
            <Settings className="mr-2 h-4 w-4" />
            Manage Rewards
          </Link>
        </Button>
      </div>
    </div>
  )
}
