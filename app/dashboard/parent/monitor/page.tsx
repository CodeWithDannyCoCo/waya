"use client"

import { useState, useEffect } from "react"
import { useSession } from "@/components/session-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckSquare, Trophy, Gamepad2, Target, Clock, TrendingUp, Activity, Calendar, Coins } from "lucide-react"
import { useRouter } from "next/navigation"

interface ChildActivity {
  id: string
  childId: string
  childName: string
  type: "chore_completed" | "reward_redeemed" | "game_played" | "goal_progress" | "achievement_earned"
  title: string
  description: string
  points?: number
  timestamp: string
  status?: "pending" | "approved" | "completed"
}

interface ChildStats {
  id: string
  name: string
  image: string
  totalCoins: number
  totalXp: number
  level: number
  streakDays: number
  choresPending: number
  choresCompleted: number
  rewardsRedeemed: number
  gamesPlayed: number
  lastActive: string
}

export default function MonitorDashboard() {
  const { session, loading } = useSession()
  const router = useRouter()
  const [activities, setActivities] = useState<ChildActivity[]>([])
  const [childrenStats, setChildrenStats] = useState<ChildStats[]>([])
  const [selectedChild, setSelectedChild] = useState<string>("all")
  const [isApproving, setIsApproving] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !session) {
      router.push("/auth/signin")
      return
    }

    if (session?.role !== "parent") {
      router.push("/dashboard/child")
      return
    }

    // Load mock data
    const mockStats: ChildStats[] = [
      {
        id: "child-1",
        name: "Alex",
        image: "/placeholder.svg?height=40&width=40",
        totalCoins: 275,
        totalXp: 1850,
        level: 4,
        streakDays: 7,
        choresPending: 2,
        choresCompleted: 23,
        rewardsRedeemed: 8,
        gamesPlayed: 15,
        lastActive: "2024-01-15T20:30:00Z",
      },
      {
        id: "child-2",
        name: "Jamie",
        image: "/placeholder.svg?height=40&width=40",
        totalCoins: 150,
        totalXp: 1200,
        level: 3,
        streakDays: 5,
        choresPending: 1,
        choresCompleted: 18,
        rewardsRedeemed: 5,
        gamesPlayed: 12,
        lastActive: "2024-01-15T19:45:00Z",
      },
    ]

    const mockActivities: ChildActivity[] = [
      {
        id: "activity-1",
        childId: "child-1",
        childName: "Alex",
        type: "chore_completed",
        title: "Chore Completed",
        description: "Cleaned bedroom and organized toys",
        points: 50,
        timestamp: "2024-01-15T20:30:00Z",
        status: "pending",
      },
      {
        id: "activity-2",
        childId: "child-2",
        childName: "Jamie",
        type: "game_played",
        title: "Money Maze Completed",
        description: "Scored 180 points in Money Maze game",
        points: 45,
        timestamp: "2024-01-15T19:45:00Z",
        status: "completed",
      },
      {
        id: "activity-3",
        childId: "child-1",
        childName: "Alex",
        type: "reward_redeemed",
        title: "Reward Redeemed",
        description: "Extra screen time (30 minutes)",
        points: -100,
        timestamp: "2024-01-15T18:20:00Z",
        status: "completed",
      },
      {
        id: "activity-4",
        childId: "child-1",
        childName: "Alex",
        type: "achievement_earned",
        title: "Achievement Unlocked",
        description: "Quiz Master - Answer 9 out of 10 questions correctly",
        points: 25,
        timestamp: "2024-01-15T17:15:00Z",
        status: "completed",
      },
      {
        id: "activity-5",
        childId: "child-2",
        childName: "Jamie",
        type: "goal_progress",
        title: "Goal Progress",
        description: "Added 25 coins to 'New bicycle' goal",
        timestamp: "2024-01-15T16:30:00Z",
        status: "completed",
      },
    ]

    setChildrenStats(mockStats)
    setActivities(mockActivities)
  }, [session, loading, router])

  const filteredActivities =
    selectedChild === "all" ? activities : activities.filter((activity) => activity.childId === selectedChild)

  const getActivityIcon = (type: ChildActivity["type"]) => {
    switch (type) {
      case "chore_completed":
        return <CheckSquare className="h-4 w-4" />
      case "reward_redeemed":
        return <Trophy className="h-4 w-4" />
      case "game_played":
        return <Gamepad2 className="h-4 w-4" />
      case "goal_progress":
        return <Target className="h-4 w-4" />
      case "achievement_earned":
        return <Trophy className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getActivityColor = (type: ChildActivity["type"]) => {
    switch (type) {
      case "chore_completed":
        return "text-green-600"
      case "reward_redeemed":
        return "text-purple-600"
      case "game_played":
        return "text-blue-600"
      case "goal_progress":
        return "text-orange-600"
      case "achievement_earned":
        return "text-yellow-600"
      default:
        return "text-gray-600"
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const handleApproveActivity = async (activityId: string) => {
    setIsApproving(activityId)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Update the activity status
    setActivities((prev) =>
      prev.map((activity) => (activity.id === activityId ? { ...activity, status: "approved" as const } : activity)),
    )

    // Update child stats (reduce pending chores)
    const activity = activities.find((a) => a.id === activityId)
    if (activity && activity.type === "chore_completed") {
      setChildrenStats((prev) =>
        prev.map((child) =>
          child.id === activity.childId
            ? {
                ...child,
                choresPending: Math.max(0, child.choresPending - 1),
                choresCompleted: child.choresCompleted + 1,
              }
            : child,
        ),
      )
    }

    setIsApproving(null)
  }

  const handleViewDetails = (activityId: string) => {
    const activity = activities.find((a) => a.id === activityId)
    if (activity) {
      alert(
        `Activity Details:\n\nChild: ${activity.childName}\nType: ${activity.title}\nDescription: ${activity.description}\nPoints: ${activity.points || 0}\nTime: ${formatTimeAgo(activity.timestamp)}`,
      )
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Activity Monitor</h1>
        <p className="text-muted-foreground">Monitor your children's progress and activities</p>
      </div>

      {/* Children Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {childrenStats.map((child) => (
          <Card key={child.id}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={child.image || "/placeholder.svg"} />
                  <AvatarFallback>{child.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{child.name}</CardTitle>
                  <CardDescription>
                    Level {child.level} • Last active {formatTimeAgo(child.lastActive)}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Coins className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium">{child.totalCoins} Coins</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">{child.totalXp} XP</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">{child.streakDays} day streak</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Pending Chores</span>
                    <Badge variant={child.choresPending > 0 ? "destructive" : "secondary"}>{child.choresPending}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Completed</span>
                    <Badge variant="secondary">{child.choresCompleted}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Games Played</span>
                    <Badge variant="secondary">{child.gamesPlayed}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Real-time updates from your children</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={selectedChild === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedChild("all")}
              >
                All Children
              </Button>
              {childrenStats.map((child) => (
                <Button
                  key={child.id}
                  variant={selectedChild === child.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedChild(child.id)}
                >
                  {child.name}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredActivities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No recent activities to show</div>
            ) : (
              filteredActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className={`p-2 rounded-full bg-gray-100 ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{activity.childName}</span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm font-medium">{activity.title}</span>
                      {activity.status === "pending" && (
                        <Badge variant="outline" className="text-xs">
                          Needs Approval
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTimeAgo(activity.timestamp)}
                      </div>
                      {activity.points && (
                        <div className="flex items-center gap-1">
                          <Coins className="h-3 w-3" />
                          {activity.points > 0 ? "+" : ""}
                          {activity.points} coins
                        </div>
                      )}
                    </div>
                  </div>
                  {activity.status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApproveActivity(activity.id)}
                        disabled={isApproving === activity.id}
                      >
                        {isApproving === activity.id ? "Approving..." : "Approve"}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleViewDetails(activity.id)}>
                        View Details
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
