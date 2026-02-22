"use client"

import { Heart, Coins, Star, Trophy } from "lucide-react"
import { motion } from "framer-motion"

type GameStatusProps = {
  lives: number
  coins: number
  xp: number
  level: number
}

export function GameStatus({ lives, coins, xp, level }: GameStatusProps) {
  return (
    <div className="flex flex-wrap justify-between items-center bg-white dark:bg-gray-800 rounded-lg p-3 md:p-4 shadow-md gap-2">
      <div className="flex items-center">
        <div className="flex">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 1 }}
              animate={{ scale: i < lives ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            >
              <Heart
                className={`h-5 w-5 md:h-6 md:w-6 ${i < lives ? "text-red-500 fill-red-500" : "text-gray-300 dark:text-gray-600"} mr-1`}
              />
            </motion.div>
          ))}
        </div>
        <span className="ml-1 text-sm md:text-base font-medium">{lives} Lives</span>
      </div>

      <div className="flex items-center">
        <Trophy className="h-4 w-4 md:h-5 md:w-5 text-purple-500 mr-1" />
        <span className="text-sm md:text-base font-medium">Level {level}</span>
      </div>

      <div className="flex items-center">
        <Star className="h-4 w-4 md:h-5 md:w-5 text-blue-500 mr-1" />
        <span className="text-sm md:text-base font-medium">{xp} XP</span>
      </div>

      <div className="flex items-center">
        <Coins className="h-4 w-4 md:h-5 md:w-5 text-yellow-500 mr-1" />
        <span className="text-sm md:text-base font-medium">{coins} Coins</span>
      </div>
    </div>
  )
}
