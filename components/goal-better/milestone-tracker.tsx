"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Star, Medal, Award, Gift, Sparkles } from "lucide-react"

export function MilestoneTracker() {
  // Mock data for achievements
  const achievements = [
    {
      id: "1",
      name: "Goal Setter",
      description: "Create your first savings goal",
      icon: <Target className="h-6 w-6" />,
      earned: true,
      date: "2 weeks ago",
    },
    {
      id: "2",
      name: "Milestone Master",
      description: "Reach 50% of a savings goal",
      icon: <Trophy className="h-6 w-6" />,
      earned: true,
      date: "1 week ago",
    },
    {
      id: "3",
      name: "Savings Streak",
      description: "Add to your savings 5 days in a row",
      icon: <Star className="h-6 w-6" />,
      earned: true,
      date: "3 days ago",
    },
    {
      id: "4",
      name: "Goal Achieved",
      description: "Complete your first savings goal",
      icon: <Medal className="h-6 w-6" />,
      earned: false,
      progress: 75,
    },
    {
      id: "5",
      name: "Super Saver",
      description: "Save 1000 coins total across all goals",
      icon: <Award className="h-6 w-6" />,
      earned: false,
      progress: 60,
    },
    {
      id: "6",
      name: "Diversified Saver",
      description: "Have 3 active savings goals at once",
      icon: <Gift className="h-6 w-6" />,
      earned: false,
      progress: 33,
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-amber-500" />
            Savings Achievements
          </CardTitle>
          <CardDescription>Track your progress and earn special rewards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <Card
                key={achievement.id}
                className={`overflow-hidden ${achievement.earned ? "border-green-500/50" : ""}`}
              >
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div
                    className={`p-3 rounded-full ${
                      achievement.earned ? "bg-green-500/20 text-green-500" : "bg-muted text-muted-foreground"
                    } mb-3`}
                  >
                    {achievement.icon}
                  </div>

                  <h3 className="font-semibold">{achievement.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>

                  {achievement.earned ? (
                    <Badge className="bg-green-500">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Earned {achievement.date}
                    </Badge>
                  ) : (
                    <div className="w-full space-y-1">
                      <Progress value={achievement.progress} className="h-2" />
                      <div className="text-xs text-right text-muted-foreground">{achievement.progress}% complete</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Import the Target icon at the top
import { Target } from "lucide-react"
