"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QuestionCard } from "@/components/money-maze/question-card"
import { ProgressBar } from "@/components/money-maze/progress-bar"
import { MazeGrid } from "@/components/money-maze/maze-grid"
import { GameStatus } from "@/components/money-maze/game-status"
import { Play, Book, Trophy, ArrowRight } from "lucide-react"

// Mock data for the game
const mockQuestions = [
  {
    id: "q1",
    text: "What is the purpose of saving money?",
    options: [
      "To spend it all at once",
      "To have funds for future needs",
      "To hide it under your bed",
      "To make your wallet heavier",
    ],
    correctAnswer: 1,
    difficulty: "easy" as const,
    category: "Saving",
    points: 10,
  },
  {
    id: "q2",
    text: "What is a budget?",
    options: ["A type of wallet", "A plan for how to spend money", "A kind of bank account", "A type of currency"],
    correctAnswer: 1,
    difficulty: "easy" as const,
    category: "Budgeting",
    points: 10,
  },
  {
    id: "q3",
    text: "What is interest?",
    options: ["Money you pay to borrow money", "Money you earn for lending money", "Both A and B", "Neither A nor B"],
    correctAnswer: 2,
    difficulty: "medium" as const,
    category: "Banking",
    points: 15,
  },
  {
    id: "q4",
    text: "What is the difference between needs and wants?",
    options: [
      "Needs are things you must have, wants are things you would like to have",
      "Needs are expensive, wants are cheap",
      "Needs are things your parents buy, wants are things you buy",
      "There is no difference",
    ],
    correctAnswer: 0,
    difficulty: "easy" as const,
    category: "Spending",
    points: 10,
  },
  {
    id: "q5",
    text: "What is a credit card?",
    options: [
      "A card that gives you free money",
      "A card that lets you borrow money to pay back later",
      "A card that holds your savings",
      "A card that prevents you from spending money",
    ],
    correctAnswer: 1,
    difficulty: "medium" as const,
    category: "Credit",
    points: 15,
  },
]

// Mock maze data
const mockMazeLevel1 = {
  grid: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0, 1, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 0],
    [0, 1, 0, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 0, 1, 0],
    [0, 0, 0, 0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
  start: { row: 1, col: 1 },
  exit: { row: 6, col: 6 },
  questions: [
    { row: 1, col: 3 },
    { row: 3, col: 5 },
    { row: 5, col: 2 },
  ],
  rewards: [
    { row: 3, col: 1, type: "coin" as const },
    { row: 5, col: 3, type: "xp" as const },
  ],
}

export default function MoneyMazePage() {
  const [gameState, setGameState] = useState<"intro" | "playing" | "question" | "complete">("intro")
  const [level, setLevel] = useState(1)
  const [lives, setLives] = useState(3)
  const [coins, setCoins] = useState(0)
  const [xp, setXp] = useState(0)
  const [levelXP, setLevelXP] = useState(100)
  const [currentQuestion, setCurrentQuestion] = useState(mockQuestions[0])
  const [playerPosition, setPlayerPosition] = useState(mockMazeLevel1.start)
  const [visitedCells, setVisitedCells] = useState<Set<string>>(new Set())

  const handleStartGame = () => {
    setGameState("playing")
    setPlayerPosition(mockMazeLevel1.start)
    setVisitedCells(new Set([`${mockMazeLevel1.start.row}-${mockMazeLevel1.start.col}`]))
  }

  const handleCellClick = (row: number, col: number) => {
    // Check if this is a question cell
    const isQuestionCell = mockMazeLevel1.questions.some((q) => q.row === row && q.col === col)

    // Check if this is a reward cell
    const rewardCell = mockMazeLevel1.rewards.find((r) => r.row === row && r.col === col)

    // Check if this is the exit cell
    const isExitCell = mockMazeLevel1.exit.row === row && mockMazeLevel1.exit.col === col

    // Update player position
    setPlayerPosition({ row, col })

    // Mark cell as visited
    setVisitedCells((prev) => new Set([...prev, `${row}-${col}`]))

    // Handle special cells
    if (isQuestionCell) {
      // Show a random question
      const randomIndex = Math.floor(Math.random() * mockQuestions.length)
      setCurrentQuestion(mockQuestions[randomIndex])
      setGameState("question")
    } else if (rewardCell) {
      // Give reward
      if (rewardCell.type === "coin") {
        setCoins((prev) => prev + 10)
      } else if (rewardCell.type === "xp") {
        setXp((prev) => prev + 15)
      }
    } else if (isExitCell) {
      // Level complete
      setGameState("complete")
      setXp((prev) => prev + 50)
      setCoins((prev) => prev + 25)
    }
  }

  const handleAnswerQuestion = (isCorrect: boolean) => {
    if (isCorrect) {
      // Reward for correct answer
      setXp((prev) => prev + currentQuestion.points)
      setCoins((prev) => prev + 5)
    } else {
      // Penalty for wrong answer
      setLives((prev) => Math.max(0, prev - 1))
    }

    // Return to the maze
    setGameState("playing")
  }

  const handleLevelUp = () => {
    setLevel((prev) => prev + 1)
    setLevelXP((prev) => prev + 50)
  }

  const handleNextLevel = () => {
    setLevel((prev) => prev + 1)
    setGameState("intro")
    // In a real game, we would load the next level's maze here
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">MoneyMaze</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Navigate the maze, answer financial questions, earn rewards!
          </p>
        </div>
      </div>

      <ProgressBar level={level} currentXP={xp} levelXP={levelXP} onLevelUp={handleLevelUp} />

      <AnimatePresence mode="wait">
        {gameState === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500/50">
              <CardHeader className="pb-2 md:pb-4">
                <CardTitle className="text-xl md:text-2xl">Welcome to MoneyMaze Level {level}</CardTitle>
                <CardDescription className="text-sm md:text-base">
                  Navigate through the maze, answer financial questions, and collect rewards!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                  <div className="bg-white/80 p-3 md:p-4 rounded-lg flex flex-col items-center text-center">
                    <div className="bg-blue-100 p-2 md:p-3 rounded-full mb-2 md:mb-3">
                      <Play className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                    </div>
                    <h3 className="font-medium mb-1 text-sm md:text-base">Navigate the Maze</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Click on adjacent cells to move through the financial maze
                    </p>
                  </div>

                  <div className="bg-white/80 p-3 md:p-4 rounded-lg flex flex-col items-center text-center">
                    <div className="bg-yellow-100 p-2 md:p-3 rounded-full mb-2 md:mb-3">
                      <Book className="h-5 w-5 md:h-6 md:w-6 text-yellow-600" />
                    </div>
                    <h3 className="font-medium mb-1 text-sm md:text-base">Answer Questions</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Test your financial knowledge with fun quiz questions
                    </p>
                  </div>

                  <div className="bg-white/80 p-3 md:p-4 rounded-lg flex flex-col items-center text-center">
                    <div className="bg-green-100 p-2 md:p-3 rounded-full mb-2 md:mb-3">
                      <Trophy className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                    </div>
                    <h3 className="font-medium mb-1 text-sm md:text-base">Earn Rewards</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Collect coins and XP to level up and unlock new mazes
                    </p>
                  </div>
                </div>

                <div className="flex justify-center mt-4">
                  <Button size="lg" onClick={handleStartGame} className="text-sm md:text-base">
                    Start Level {level}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {gameState === "playing" && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <GameStatus lives={lives} coins={coins} xp={xp} level={level} />

            <div className="mt-4 md:mt-6 flex justify-center">
              <MazeGrid
                level={level}
                onCellClick={handleCellClick}
                playerPosition={playerPosition}
                gridSize={{ rows: mockMazeLevel1.grid.length, cols: mockMazeLevel1.grid[0].length }}
                maze={mockMazeLevel1.grid}
                questionCells={mockMazeLevel1.questions}
                rewardCells={mockMazeLevel1.rewards}
                exitCell={mockMazeLevel1.exit}
              />
            </div>
          </motion.div>
        )}

        {gameState === "question" && (
          <motion.div
            key="question"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full"
          >
            <QuestionCard question={currentQuestion} onAnswer={handleAnswerQuestion} />
          </motion.div>
        )}

        {gameState === "complete" && (
          <motion.div
            key="complete"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <Card className="bg-gradient-to-br from-green-500/20 to-yellow-500/20 border-green-500/50">
              <CardHeader className="pb-2 md:pb-4">
                <CardTitle className="text-xl md:text-2xl">Level {level} Complete!</CardTitle>
                <CardDescription className="text-sm md:text-base">
                  Congratulations! You've successfully navigated the financial maze.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 text-center">
                  <div className="bg-white/80 p-3 md:p-4 rounded-lg">
                    <h3 className="font-medium mb-1 text-sm md:text-base">XP Earned</h3>
                    <p className="text-xl md:text-2xl font-bold text-blue-600">+50 XP</p>
                  </div>

                  <div className="bg-white/80 p-3 md:p-4 rounded-lg">
                    <h3 className="font-medium mb-1 text-sm md:text-base">Coins Earned</h3>
                    <p className="text-xl md:text-2xl font-bold text-yellow-600">+25 Coins</p>
                  </div>

                  <div className="bg-white/80 p-3 md:p-4 rounded-lg">
                    <h3 className="font-medium mb-1 text-sm md:text-base">Level Progress</h3>
                    <p className="text-xl md:text-2xl font-bold text-green-600">{Math.round((xp / levelXP) * 100)}%</p>
                  </div>
                </div>

                <div className="flex justify-center mt-4">
                  <Button size="lg" onClick={handleNextLevel} className="text-sm md:text-base">
                    Next Level
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Tabs defaultValue="learn" className="w-full mt-6 md:mt-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="learn" className="text-xs md:text-sm">
            <Book className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
            Learn
          </TabsTrigger>
          <TabsTrigger value="achievements" className="text-xs md:text-sm">
            <Trophy className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="text-xs md:text-sm">
            <ArrowRight className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
            Progress
          </TabsTrigger>
        </TabsList>

        <TabsContent value="learn" className="mt-4">
          <Card>
            <CardHeader className="pb-2 md:pb-4">
              <CardTitle className="text-lg md:text-xl">Financial Concepts</CardTitle>
              <CardDescription className="text-sm md:text-base">
                Learn important money concepts as you play
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {[
                  {
                    title: "Saving",
                    description: "Setting aside money for future needs and goals",
                    progress: 60,
                  },
                  {
                    title: "Budgeting",
                    description: "Planning how to spend and save your money",
                    progress: 40,
                  },
                  {
                    title: "Banking",
                    description: "Understanding how banks help you manage money",
                    progress: 30,
                  },
                  {
                    title: "Investing",
                    description: "Making your money grow over time",
                    progress: 10,
                  },
                ].map((concept, index) => (
                  <div key={index} className="border rounded-lg p-3 md:p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-sm md:text-base">{concept.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {concept.progress}%
                      </Badge>
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground mb-2">{concept.description}</p>
                    <div className="h-1.5 md:h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${concept.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="mt-4">
          <Card>
            <CardHeader className="pb-2 md:pb-4">
              <CardTitle className="text-lg md:text-xl">Your Achievements</CardTitle>
              <CardDescription className="text-sm md:text-base">Track your progress and unlock badges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {[
                  {
                    name: "First Steps",
                    description: "Complete your first maze",
                    icon: "🏆",
                    unlocked: true,
                  },
                  {
                    name: "Money Wise",
                    description: "Answer 10 financial questions correctly",
                    icon: "🧠",
                    unlocked: true,
                  },
                  {
                    name: "Maze Master",
                    description: "Complete 5 mazes",
                    icon: "🗺️",
                    unlocked: false,
                  },
                  {
                    name: "Financial Guru",
                    description: "Reach level 10",
                    icon: "💰",
                    unlocked: false,
                  },
                ].map((achievement, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-3 md:p-4 flex flex-col items-center text-center ${
                      achievement.unlocked ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="text-2xl md:text-3xl mb-1 md:mb-2">{achievement.icon}</div>
                    <h3 className="font-medium text-xs md:text-sm">{achievement.name}</h3>
                    <p className="text-xs mt-1 text-muted-foreground">{achievement.description}</p>
                    {achievement.unlocked ? (
                      <Badge className="mt-2 bg-green-500 text-xs">Unlocked</Badge>
                    ) : (
                      <Badge variant="outline" className="mt-2 text-xs">
                        Locked
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="mt-4">
          <Card>
            <CardHeader className="pb-2 md:pb-4">
              <CardTitle className="text-lg md:text-xl">Your Progress</CardTitle>
              <CardDescription className="text-sm md:text-base">Track your journey through MoneyMaze</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 md:space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs md:text-sm">
                    <span>Level Progress</span>
                    <span>
                      {xp}/{levelXP} XP
                    </span>
                  </div>
                  <div className="h-1.5 md:h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      style={{ width: `${Math.min((xp / levelXP) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 text-center">
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 md:p-4">
                    <h3 className="text-xs md:text-sm font-medium text-muted-foreground">Current Level</h3>
                    <p className="text-xl md:text-2xl font-bold text-blue-600">{level}</p>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 md:p-4">
                    <h3 className="text-xs md:text-sm font-medium text-muted-foreground">Coins Earned</h3>
                    <p className="text-xl md:text-2xl font-bold text-yellow-600">{coins}</p>
                  </div>

                  <div className="bg-green-50 border border-green-100 rounded-lg p-3 md:p-4">
                    <h3 className="text-xs md:text-sm font-medium text-muted-foreground">Questions Answered</h3>
                    <p className="text-xl md:text-2xl font-bold text-green-600">12</p>
                  </div>

                  <div className="bg-purple-50 border border-purple-100 rounded-lg p-3 md:p-4">
                    <h3 className="text-xs md:text-sm font-medium text-muted-foreground">Mazes Completed</h3>
                    <p className="text-xl md:text-2xl font-bold text-purple-600">{level - 1}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
