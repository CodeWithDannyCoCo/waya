"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  CheckSquare,
  Gift,
  Gamepad2,
  PiggyBank,
  TrendingUp,
  Star,
  Coins,
  Trophy,
  Target,
  Wallet,
  Flame,
  Award,
} from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ConfettiExplosion } from "@/components/confetti-explosion"
import { DailyStreak } from "@/components/daily-streak"

interface ChildStats {
  coins: number
  level: number
  xp: number
  nextLevelXp: number
  walletBalance: number
  streakDays: number
  pendingChores: number
  completedChores: number
  availableRewards: number
  achievements: number
  questsCompleted: number
  totalQuests: number
}

export default function ChildDashboard() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [showConfetti, setShowConfetti] = useState(false)
  const [stats, setStats] = useState<ChildStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log("ChildDashboard: useEffect triggered", { user, isLoading })

    if (!isLoading && !user) {
      console.log("ChildDashboard: No user, redirecting to signin")
      router.push("/auth/signin")
      return
    }

    if (user?.role !== "child") {
      console.log("ChildDashboard: User is not child, redirecting to parent dashboard")
      router.push("/dashboard/parent")
      return
    }

    if (user) {
      console.log("ChildDashboard: User found, fetching stats")
      fetchChildStats()
    }
  }, [user, isLoading, router])

  const fetchChildStats = async () => {
    try {
      setLoading(true)
      console.log("ChildDashboard: Fetching child stats for user:", user?.id)

      // For now, use user data as fallback since APIs might not be fully connected
      const fallbackStats: ChildStats = {
        coins: user?.totalCoins || 275,
        level: user?.level || 4,
        xp: user?.totalXp || 1850,
        nextLevelXp: ((user?.level || 4) + 1) * 1000,
        walletBalance: user?.walletBalance || 1375,
        streakDays: user?.streakDays || 7,
        pendingChores: 2,
        completedChores: 23,
        availableRewards: 5,
        achievements: 12,
        questsCompleted: 8,
        totalQuests: 10,
      }

      // Try to fetch real data, but fall back to user data if APIs fail
      try {
        const [choresRes, walletRes] = await Promise.all([
          fetch(`/api/chores?childId=${user?.id}`).catch(() => null),
          fetch(`/api/wallet/balance`).catch(() => null),
        ])

        if (choresRes?.ok) {
          const choresData = await choresRes.json()
          const pendingChores = choresData.chores?.filter((c: any) => c.status === "pending").length || 0
          const completedChores = choresData.chores?.filter((c: any) => c.status === "completed").length || 0
          fallbackStats.pendingChores = pendingChores
          fallbackStats.completedChores = completedChores
        }

        if (walletRes?.ok) {
          const walletData = await walletRes.json()
          fallbackStats.walletBalance = walletData.balance || fallbackStats.walletBalance
        }
      } catch (apiError) {
        console.log("ChildDashboard: API calls failed, using fallback data:", apiError)
      }

      setStats(fallbackStats)
      console.log("ChildDashboard: Stats set:", fallbackStats)
    } catch (error) {
      console.error("Error fetching child stats:", error)
      // Use basic fallback if everything fails
      setStats({
        coins: 275,
        level: 4,
        xp: 1850,
        nextLevelXp: 5000,
        walletBalance: 1375,
        streakDays: 7,
        pendingChores: 2,
        completedChores: 23,
        availableRewards: 5,
        achievements: 12,
        questsCompleted: 8,
        totalQuests: 10,
      })
    } finally {
      setLoading(false)
    }
  }

  console.log("ChildDashboard: Rendering", { isLoading, loading, user: !!user, stats: !!stats })

  if (isLoading || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user || !stats) {
    console.log("ChildDashboard: No user or stats, returning null")
    return null
  }

  const activities = [
    {
      title: "My Chores",
      description: "View and complete your assigned chores",
      href: "/dashboard/child/chores",
      icon: CheckSquare,
      color: "from-blue-500 to-blue-600",
      stats: `${stats.pendingChores} pending`,
      badge: stats.pendingChores > 0 ? stats.pendingChores : null,
    },
    {
      title: "Rewards",
      description: "Redeem your earned coins for rewards",
      href: "/dashboard/child/rewards",
      icon: Gift,
      color: "from-purple-500 to-purple-600",
      stats: `${stats.availableRewards} available`,
      badge: null,
    },
    {
      title: "MoneyMaze",
      description: "Play the Money Maze game",
      href: "/dashboard/child/moneymaze",
      icon: Gamepad2,
      color: "from-green-500 to-green-600",
      stats: "Educational game",
      badge: null,
    },
    {
      title: "BudgetBattle",
      description: "Learn budgeting through fun challenges",
      href: "/dashboard/child/budgetbattle",
      icon: TrendingUp,
      color: "from-orange-500 to-orange-600",
      stats: "Strategy game",
      badge: null,
    },
    {
      title: "GoalBetter",
      description: "Set and track your savings goals",
      href: "/dashboard/child/goalbetter",
      icon: PiggyBank,
      color: "from-pink-500 to-pink-600",
      stats: "Goal tracking",
      badge: null,
    },
    {
      title: "EarningMeter",
      description: "Track your earning progress",
      href: "/dashboard/child/earningmeter",
      icon: Star,
      color: "from-yellow-500 to-yellow-600",
      stats: "Progress tracker",
      badge: null,
    },
    {
      title: "My Wallet",
      description: "View your real money balance",
      href: "/dashboard/child/wallet",
      icon: Wallet,
      color: "from-emerald-500 to-emerald-600",
      stats: `₦${stats.walletBalance.toLocaleString()}`,
      badge: null,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {showConfetti && <ConfettiExplosion />}

      <div className="p-6 space-y-8">
        {/* Welcome Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome back, {user.name}! 🎉
          </h1>
          <p className="text-lg text-muted-foreground">Ready to complete some chores and earn rewards?</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Coins Card */}
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-yellow-400 to-yellow-600">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Total Coins</p>
                  <p className="text-3xl font-bold text-white">{stats.coins}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <Coins className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-20">
                <Coins className="h-20 w-20 text-white" />
              </div>
            </CardContent>
          </Card>

          {/* Level Card */}
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Current Level</p>
                  <p className="text-3xl font-bold text-white">{stats.level}</p>
                  <div className="mt-2">
                    <Progress value={(stats.xp / stats.nextLevelXp) * 100} className="h-2 bg-blue-400/30" />
                    <p className="text-xs text-blue-100 mt-1">
                      {stats.xp}/{stats.nextLevelXp} XP
                    </p>
                  </div>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wallet Balance Card */}
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">Wallet Balance</p>
                  <p className="text-2xl font-bold text-white">₦{stats.walletBalance.toLocaleString()}</p>
                  <p className="text-xs text-emerald-200 mt-1">Real money earned</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <Wallet className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Streak Card */}
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-orange-500 to-red-600">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Daily Streak</p>
                  <p className="text-3xl font-bold text-white">{stats.streakDays}</p>
                  <p className="text-xs text-orange-200 mt-1">Days in a row!</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <Flame className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daily Streak */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Flame className="h-5 w-5 text-orange-500" />
                Daily Streak
              </CardTitle>
              <CardDescription>Keep your momentum going!</CardDescription>
            </CardHeader>
            <CardContent>
              <DailyStreak currentStreak={stats.streakDays} />
              <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-sm text-orange-800 font-medium">🔥 {stats.streakDays} days in a row! Keep it up!</p>
                <p className="text-xs text-orange-600 mt-1">
                  Complete at least one chore daily to maintain your streak
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Chore Progress */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckSquare className="h-5 w-5 text-blue-500" />
                Chore Progress
              </CardTitle>
              <CardDescription>Your weekly achievements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Completed</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {stats.completedChores}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Pending</span>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  {stats.pendingChores}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Achievements</span>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  {stats.achievements}
                </Badge>
              </div>
              <Progress
                value={(stats.completedChores / (stats.completedChores + stats.pendingChores || 1)) * 100}
                className="h-2"
              />
            </CardContent>
          </Card>

          {/* Quest Progress */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="h-5 w-5 text-purple-500" />
                Quest Progress
              </CardTitle>
              <CardDescription>Educational challenges</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {stats.questsCompleted}/{stats.totalQuests}
                </div>
                <p className="text-sm text-muted-foreground">Quests completed</p>
              </div>
              <Progress value={(stats.questsCompleted / stats.totalQuests) * 100} className="h-3" />
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Award className="h-4 w-4" />
                <span>Earn more XP by completing quests!</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Grid */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-center">Your Activities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {activities.map((activity) => (
              <Link key={activity.title} href={activity.href}>
                <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer bg-white/80 backdrop-blur-sm">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${activity.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  />
                  <CardContent className="p-6 relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-full bg-gradient-to-br ${activity.color} shadow-lg`}>
                        <activity.icon className="h-6 w-6 text-white" />
                      </div>
                      {activity.badge && (
                        <Badge variant="destructive" className="animate-pulse">
                          {activity.badge}
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                      {activity.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{activity.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-blue-600">{activity.stats}</span>
                      <Button size="sm" variant="ghost" className="group-hover:bg-blue-50">
                        Open →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
