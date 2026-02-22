"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Medal, Award, Star, Sparkles, PiggyBank, ShieldCheck, Target, TrendingUp } from "lucide-react"

export function BudgetAchievements() {
  // Mock data for achievements
  const achievements = [
    {
      id: "1",
      name: "Budget Beginner",
      description: "Complete your first Budget Battle game",
      icon: <Trophy className="h-6 w-6" />,
      earned: true,
      date: "2 weeks ago",
      xpReward: 50,
    },
    {
      id: "2",
      name: "Savings Star",
      description: "Allocate at least 20% to savings in a game",
      icon: <PiggyBank className="h-6 w-6" />,
      earned: true,
      date: "1 week ago",
      xpReward: 75,
    },
    {
      id: "3",
      name: "Emergency Ready",
      description: "Have enough in your emergency fund to cover all emergencies in a game",
      icon: <ShieldCheck className="h-6 w-6" />,
      earned: true,
      date: "3 days ago",
      xpReward: 100,
    },
    {
      id: "4",
      name: "Perfect Balance",
      description: "Achieve 100% happiness and financial health in a game",
      icon: <Target className="h-6 w-6" />,
      earned: false,
      progress: 75,
      total: 100,
      xpReward: 150,
    },
    {
      id: "5",
      name: "Budget Master",
      description: "Score 900+ points in a Budget Battle game",
      icon: <Award className="h-6 w-6" />,
      earned: false,
      progress: 850,
      total: 900,
      xpReward: 200,
    },
    {
      id: "6",
      name: "Consistent Saver",
      description: "Increase your savings allocation for 5 games in a row",
      icon: <TrendingUp className="h-6 w-6" />,
      earned: false,
      progress: 3,
      total: 5,
      xpReward: 125,
    },
  ]

  // Mock data for badges
  const badges = [
    {
      id: "1",
      name: "Savings Champion",
      icon: <Star className="h-8 w-8 text-yellow-500" />,
      level: 2,
      maxLevel: 3,
      description: "Consistently allocate to savings",
    },
    {
      id: "2",
      name: "Emergency Planner",
      icon: <ShieldCheck className="h-8 w-8 text-blue-500" />,
      level: 1,
      maxLevel: 3,
      description: "Prepare for unexpected expenses",
    },
    {
      id: "3",
      name: "Balanced Budgeter",
      icon: <Target className="h-8 w-8 text-green-500" />,
      level: 2,
      maxLevel: 3,
      description: "Create well-balanced budgets",
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-amber-500" />
            Budget Battle Achievements
          </CardTitle>
          <CardDescription>Complete challenges to earn XP and badges</CardDescription>
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
                      <Progress
                        value={
                          achievement.progress && achievement.total
                            ? (achievement.progress / achievement.total) * 100
                            : 0
                        }
                        className="h-2"
                      />
                      <div className="text-xs text-right text-muted-foreground">
                        {achievement.progress} / {achievement.total}
                      </div>
                    </div>
                  )}

                  <div className="mt-2 text-xs text-blue-500 font-medium">+{achievement.xpReward} XP Reward</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Medal className="h-5 w-5 mr-2 text-purple-500" />
            Your Budget Badges
          </CardTitle>
          <CardDescription>Badges level up as you master different budgeting skills</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {badges.map((badge) => (
              <div key={badge.id} className="flex flex-col items-center text-center">
                <div className="relative">
                  <div className="p-4 rounded-full bg-muted">{badge.icon}</div>
                  <Badge className="absolute -bottom-2 -right-2 bg-purple-500">Lvl {badge.level}</Badge>
                </div>
                <h3 className="font-medium mt-3">{badge.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                <div className="w-full mt-2">
                  <Progress value={(badge.level / badge.maxLevel) * 100} className="h-1" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Level {badge.level}/{badge.maxLevel}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Achievement Progress</CardTitle>
          <CardDescription>Your journey to becoming a budget master</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Total Achievements</h3>
                <p className="text-sm text-muted-foreground">Your collection of budgeting milestones</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">
                  {achievements.filter((a) => a.earned).length}/{achievements.length}
                </p>
                <p className="text-sm text-muted-foreground">
                  {Math.round((achievements.filter((a) => a.earned).length / achievements.length) * 100)}% complete
                </p>
              </div>
            </div>

            <Progress
              value={(achievements.filter((a) => a.earned).length / achievements.length) * 100}
              className="h-2"
            />

            <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-500" />
                  XP from Achievements
                </h3>
                <p className="text-3xl font-bold mt-2">
                  {achievements.filter((a) => a.earned).reduce((sum, a) => sum + a.xpReward, 0)} XP
                </p>
                <p className="text-sm text-muted-foreground">Earned from completed achievements</p>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-medium flex items-center">
                  <Award className="h-5 w-5 mr-2 text-purple-500" />
                  Next Achievement
                </h3>
                {achievements.some((a) => !a.earned) ? (
                  <>
                    <p className="font-medium mt-2">{achievements.find((a) => !a.earned)?.name}</p>
                    <p className="text-sm text-muted-foreground">{achievements.find((a) => !a.earned)?.description}</p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground mt-2">You've completed all achievements!</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
