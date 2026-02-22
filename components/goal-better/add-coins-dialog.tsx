"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Coins } from "lucide-react"

type AddCoinsDialogProps = {
  children: React.ReactNode
  goalId: string
  goalTitle: string
  availableCoins: number
  onAddCoins?: (goalId: string, amount: number) => void
}

export function AddCoinsDialog({ children, goalId, goalTitle, availableCoins, onAddCoins }: AddCoinsDialogProps) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState(10)

  const handleAddCoins = () => {
    if (onAddCoins) {
      onAddCoins(goalId, amount)
    }
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Coins to Goal</DialogTitle>
          <DialogDescription>Add coins from your available balance to your "{goalTitle}" goal.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="coins">Amount to add</Label>
            <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 dark:bg-yellow-500/20 px-2 py-1 rounded-md text-sm">
              <Coins className="h-3 w-3" />
              <span className="font-bold">{availableCoins} available</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Slider
              id="coins"
              max={availableCoins}
              min={1}
              step={1}
              value={[amount]}
              onValueChange={(values) => setAmount(values[0])}
              className="flex-1"
            />
            <div className="w-16">
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min={1}
                max={availableCoins}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddCoins} disabled={amount <= 0 || amount > availableCoins}>
            Add {amount} Coins
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
