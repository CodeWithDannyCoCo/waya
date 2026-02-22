"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Play, History, Trophy, Info, DollarSign, Sparkles, AlertTriangle } from "lucide-react"
import { BudgetGame } from "@/components/budget-battle/budget-game"
import { GameHistory } from "@/components/budget-battle/game-history"
import { BudgetAchievements } from "@/components/budget-battle/budget-achievements"
import { BudgetTutorial } from "@/components/budget-battle/budget-tutorial"

export default function BudgetBattlePage() {
  const [gameActive, setGameActive] = useState(false)
  const [xp, setXp] = useState(120)
  const [level, setLevel] = useState(2)
  const [gamesPlayed, setGamesPlayed] = useState(5)
  const [highScore, setHighScore] = useState(850)

  const startNewGame = () => {
    setGameActive(true)
  }

  const endGame = (score: number) => {
    setGameActive(false)
    // Update stats based on game results
    if (score > highScore) {
      setHighScore(score)
    }
    setGamesPlayed((prev) => prev + 1)
    setXp((prev) => prev + Math.floor(score / 10))

    // Check for level up
    if (xp + Math.floor(score / 10) >= level * 100) {
      setLevel((prev) => prev + 1)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budget Battle</h1>
          <p className="text-muted-foreground">Master your money through strategic budgeting!</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 px-4 py-2 rounded-md">
            <Trophy className="h-5 w-5" />
            <span className="font-bold">Level {level}</span>
          </div>
          <div className="flex items-center gap-2 bg-purple-500/10 text-purple-500 dark:bg-purple-500/20 px-4 py-2 rounded-md">
            <Sparkles className="h-5 w-5" />
            <span className="font-bold">{xp} XP</span>
          </div>
        </div>
      </div>

      {gameActive ? (
        <BudgetGame onGameEnd={endGame} />
      ) : (
        <>
          <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500/50">
            <CardHeader>
              <CardTitle className="text-xl">Welcome to Budget Battle!</CardTitle>
              <CardDescription>
                Test your budgeting skills by managing a virtual allowance. Make smart choices about spending, saving,
                and giving!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-lg flex flex-col items-center text-center">
                  <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full mb-3">
                    <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-medium mb-1">Allocate Your Budget</h3>
                  <p className="text-sm text-muted-foreground">Drag and drop coins into different budget categories</p>
                </div>

                <div className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-lg flex flex-col items-center text-center">
                  <div className="bg-amber-100 dark:bg-amber-900/50 p-3 rounded-full mb-3">
                    <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="font-medium mb-1">Face Challenges</h3>
                  <p className="text-sm text-muted-foreground">Respond to unexpected events and financial decisions</p>
                </div>

                <div className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-lg flex flex-col items-center text-center">
                  <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-full mb-3">
                    <Trophy className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-medium mb-1">Earn Rewards</h3>
                  <p className="text-sm text-muted-foreground">
                    Get XP, badges, and level up with smart financial choices
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={startNewGame} className="flex-1 sm:flex-initial">
                  <Play className="mr-2 h-4 w-4" />
                  Start New Game
                </Button>
                <Button size="lg" variant="outline" className="flex-1 sm:flex-initial">
                  <Info className="mr-2 h-4 w-4" />
                  How to Play
                </Button>
              </div>

              <div className="flex justify-center gap-8 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">Games Played</p>
                  <p className="text-xl font-bold">{gamesPlayed}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">High Score</p>
                  <p className="text-xl font-bold">{highScore}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="history" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="history">
                <History className="h-4 w-4 mr-2" />
                Game History
              </TabsTrigger>
              <TabsTrigger value="achievements">
                <Trophy className="h-4 w-4 mr-2" />
                Achievements
              </TabsTrigger>
              <TabsTrigger value="tutorial">
                <Info className="h-4 w-4 mr-2" />
                Tutorial
              </TabsTrigger>
            </TabsList>

            <TabsContent value="history" className="mt-6">
              <GameHistory />
            </TabsContent>

            <TabsContent value="achievements" className="mt-6">
              <BudgetAchievements />
            </TabsContent>

            <TabsContent value="tutorial" className="mt-6">
              <BudgetTutorial />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
