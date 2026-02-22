"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { BugIcon as QuestionMark, Star, Trophy } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

type MazeGridProps = {
  level: number
  onCellClick: (row: number, col: number) => void
  playerPosition: { row: number; col: number }
  gridSize: { rows: number; cols: number }
  maze: number[][]
  questionCells: { row: number; col: number }[]
  rewardCells: { row: number; col: number; type: "coin" | "xp" | "life" }[]
  exitCell: { row: number; col: number }
}

// Maze cell types:
// 0 = wall
// 1 = path
// 2 = current position
// 3 = question
// 4 = reward
// 5 = exit

export function MazeGrid({
  level,
  onCellClick,
  playerPosition,
  gridSize,
  maze,
  questionCells,
  rewardCells,
  exitCell,
}: MazeGridProps) {
  const [grid, setGrid] = useState<number[][]>([])
  const isMobile = useIsMobile()

  useEffect(() => {
    // Create a copy of the maze
    const newGrid = maze.map((row) => [...row])

    // Mark special cells
    questionCells.forEach((cell) => {
      if (newGrid[cell.row] && newGrid[cell.row][cell.col] === 1) {
        newGrid[cell.row][cell.col] = 3
      }
    })

    rewardCells.forEach((cell) => {
      if (newGrid[cell.row] && newGrid[cell.row][cell.col] === 1) {
        newGrid[cell.row][cell.col] = 4
      }
    })

    if (newGrid[exitCell.row] && newGrid[exitCell.row][exitCell.col]) {
      newGrid[exitCell.row][exitCell.col] = 5
    }

    // Mark player position
    if (newGrid[playerPosition.row] && newGrid[playerPosition.row][playerPosition.col]) {
      newGrid[playerPosition.row][playerPosition.col] = 2
    }

    setGrid(newGrid)
  }, [maze, playerPosition, questionCells, rewardCells, exitCell])

  const getCellColor = (cellType: number) => {
    switch (cellType) {
      case 0:
        return "bg-gray-800" // Wall
      case 1:
        return "bg-gray-100 dark:bg-gray-700" // Path
      case 2:
        return "bg-blue-500" // Player
      case 3:
        return "bg-yellow-400" // Question
      case 4:
        return "bg-green-400" // Reward
      case 5:
        return "bg-purple-500" // Exit
      default:
        return "bg-gray-100 dark:bg-gray-700"
    }
  }

  const getCellIcon = (cellType: number) => {
    switch (cellType) {
      case 2:
        return <div className="h-3 w-3 md:h-4 md:w-4 rounded-full bg-white" />
      case 3:
        return <QuestionMark className="h-3 w-3 md:h-4 md:w-4 text-yellow-800 dark:text-yellow-200" />
      case 4:
        return <Star className="h-3 w-3 md:h-4 md:w-4 text-green-800 dark:text-green-200" />
      case 5:
        return <Trophy className="h-3 w-3 md:h-4 md:w-4 text-white" />
      default:
        return null
    }
  }

  const isValidMove = (row: number, col: number) => {
    // Check if the cell is adjacent to the player
    const isAdjacent =
      (Math.abs(row - playerPosition.row) === 1 && col === playerPosition.col) ||
      (Math.abs(col - playerPosition.col) === 1 && row === playerPosition.row)

    // Check if the cell is a valid path, question, reward, or exit
    const isValidCell = grid[row] && [1, 3, 4, 5].includes(grid[row][col])

    return isAdjacent && isValidCell
  }

  // Calculate cell size based on screen size
  const cellSize = isMobile ? "h-7 w-7" : "h-10 w-10"

  return (
    <Card className="p-2 md:p-4 bg-gray-200 dark:bg-gray-800 overflow-hidden w-full">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2 md:mb-4 gap-2">
        <h3 className="text-base md:text-lg font-bold">Level {level} Maze</h3>
        <div className="flex flex-wrap items-center text-xs md:text-sm gap-2 md:gap-3">
          <div className="flex items-center">
            <div className="h-3 w-3 bg-yellow-400 rounded-sm mr-1" />
            <span>Question</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 bg-green-400 rounded-sm mr-1" />
            <span>Reward</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 bg-purple-500 rounded-sm mr-1" />
            <span>Exit</span>
          </div>
        </div>
      </div>

      <div
        className="grid gap-1 mx-auto"
        style={{
          gridTemplateRows: `repeat(${gridSize.rows}, minmax(0, 1fr))`,
          gridTemplateColumns: `repeat(${gridSize.cols}, minmax(0, 1fr))`,
          maxWidth: isMobile ? "100%" : "500px",
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <motion.div
              key={`${rowIndex}-${colIndex}`}
              className={`
                ${cellSize} rounded-md flex items-center justify-center
                ${getCellColor(cell)}
                ${isValidMove(rowIndex, colIndex) ? "cursor-pointer ring-2 ring-white dark:ring-gray-300 ring-opacity-50" : ""}
              `}
              whileHover={isValidMove(rowIndex, colIndex) ? { scale: 1.1 } : {}}
              onClick={() => isValidMove(rowIndex, colIndex) && onCellClick(rowIndex, colIndex)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: (rowIndex + colIndex) * 0.02 }}
            >
              {getCellIcon(cell)}
            </motion.div>
          )),
        )}
      </div>

      <div className="mt-2 md:mt-4 text-xs md:text-sm text-center text-muted-foreground">
        Click on adjacent cells to move through the maze
      </div>
    </Card>
  )
}
