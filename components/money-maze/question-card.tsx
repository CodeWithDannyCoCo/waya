"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock } from "lucide-react"

type QuestionCardProps = {
  question: {
    id: string
    text: string
    options: string[]
    correctAnswer: number
    difficulty: "easy" | "medium" | "hard"
    category: string
    points: number
    timeLimit?: number
  }
  onAnswer: (isCorrect: boolean) => void
}

export function QuestionCard({ question, onAnswer }: QuestionCardProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [timeLeft, setTimeLeft] = useState(question.timeLimit || 30)

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return
    setSelectedOption(index)
  }

  const handleSubmit = () => {
    if (selectedOption === null) return

    const isCorrect = selectedOption === question.correctAnswer
    setIsAnswered(true)

    // Delay to show the result before moving on
    setTimeout(() => {
      onAnswer(isCorrect)
    }, 1500)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="pb-2 md:pb-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
          <div>
            <Badge variant="outline" className="mb-2">
              {question.category}
            </Badge>
            <CardTitle className="text-lg md:text-xl">{question.text}</CardTitle>
          </div>
          <Badge
            variant={
              question.difficulty === "easy"
                ? "outline"
                : question.difficulty === "medium"
                  ? "secondary"
                  : "destructive"
            }
            className="self-start md:self-auto"
          >
            {question.difficulty}
          </Badge>
        </div>
        <CardDescription className="flex items-center mt-2">
          <Clock className="h-4 w-4 mr-1" />
          <span>{timeLeft} seconds</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 md:space-y-4">
        {question.options.map((option, index) => (
          <motion.div key={index} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant={selectedOption === index ? "default" : "outline"}
              className={`w-full justify-start text-left h-auto py-2 md:py-3 px-3 md:px-4 text-sm md:text-base ${
                isAnswered
                  ? index === question.correctAnswer
                    ? "bg-green-500 hover:bg-green-500 text-white dark:bg-green-600 dark:hover:bg-green-600"
                    : selectedOption === index
                      ? "bg-red-500 hover:bg-red-500 text-white dark:bg-red-600 dark:hover:bg-red-600"
                      : ""
                  : ""
              }`}
              onClick={() => handleOptionSelect(index)}
              disabled={isAnswered}
            >
              <div className="flex items-center w-full">
                <span className="flex-1">{option}</span>
                {isAnswered && index === question.correctAnswer && (
                  <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-white ml-2" />
                )}
                {isAnswered && selectedOption === index && index !== question.correctAnswer && (
                  <XCircle className="h-4 w-4 md:h-5 md:w-5 text-white ml-2" />
                )}
              </div>
            </Button>
          </motion.div>
        ))}
      </CardContent>
      <CardFooter className="flex justify-between pt-2 md:pt-4">
        <div className="text-xs md:text-sm">
          <span className="font-medium">{question.points} points</span>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={selectedOption === null || isAnswered}
          size="sm"
          className="md:text-base md:h-10"
        >
          Submit Answer
        </Button>
      </CardFooter>
    </Card>
  )
}
