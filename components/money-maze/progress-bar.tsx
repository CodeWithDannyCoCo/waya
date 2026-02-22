"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Star, Trophy, Zap } from "lucide-react"

type ProgressBarProps = {
  level: number
  currentXP: number
  levelXP: number
  onLevelUp?: () => void
}

export function ProgressBar({ level, currentXP, levelXP, onLevelUp }: ProgressBarProps) {
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [prevXP, setPrevXP] = useState(currentXP)
  const progress = Math.min((currentXP / levelXP) * 100, 100)

  useEffect(() => {
    // Check if we've leveled up
    if (currentXP >= levelXP && prevXP < levelXP) {
      setShowLevelUp(true)
      onLevelUp?.()

      // Hide the level up animation after a delay
      const timer = setTimeout(() => {
        setShowLevelUp(false)
      }, 3000)

      return () => clearTimeout(timer)
    }

    setPrevXP(currentXP)
  }, [currentXP, levelXP, prevXP, onLevelUp])

  return (
    <div className="relative w-full">
      {/* Level indicators */}
      <div className="flex justify-between mb-2">
        <div className="flex items-center">
          <Zap className="h-4 w-4 md:h-5 md:w-5 text-yellow-500 mr-1" />
          <span className="text-sm md:text-base font-bold">Level {level}</span>
        </div>
        <div className="text-xs md:text-sm text-muted-foreground">
          {currentXP}/{levelXP} XP
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-3 md:h-4 bg-muted rounded-full overflow-hidden relative">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          initial={{ width: `${(prevXP / levelXP) * 100}%` }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        {/* Checkpoint markers */}
        {[25, 50, 75].map((checkpoint) => (
          <div
            key={checkpoint}
            className={`absolute top-0 bottom-0 w-1 ${progress >= checkpoint ? "bg-white dark:bg-gray-300" : "bg-gray-400 dark:bg-gray-600"}`}
            style={{ left: `${checkpoint}%` }}
          />
        ))}
      </div>

      {/* Level up animation */}
      {showLevelUp && (
        <motion.div
          className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.5 }}
        >
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 md:p-6 rounded-lg shadow-lg text-white flex flex-col items-center">
            <Trophy className="h-8 w-8 md:h-12 md:w-12 mb-2" />
            <h3 className="text-lg md:text-xl font-bold">Level Up!</h3>
            <p className="text-sm md:text-base">You've reached Level {level + 1}</p>
            <div className="flex mt-2">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ rotate: 0, scale: 0 }}
                  animate={{ rotate: 360, scale: 1 }}
                  transition={{ delay: i * 0.2, duration: 0.5 }}
                >
                  <Star className="h-5 w-5 md:h-6 md:w-6 text-yellow-200 mx-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
