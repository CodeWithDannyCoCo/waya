"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "lucide-react"

type ChoreType = {
  id?: string
  title: string
  description: string
  reward: number
  xp: number
  difficulty: string
  dueDate: string
  status?: string
  assignedTo?: {
    id: string
    name: string
    avatar: string
  }
}

type CreateChoreDialogProps = {
  children: React.ReactNode
  chore?: ChoreType
}

export function CreateChoreDialog({ children, chore }: CreateChoreDialogProps) {
  const [open, setOpen] = useState(false)
  const isEditing = !!chore

  // Mock data for kids
  const kids = [
    {
      id: "kid1",
      name: "Alex",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "kid2",
      name: "Jamie",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, we would save the chore to the database
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Chore" : "Create New Chore"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Make changes to this chore." : "Create a new chore for your child to complete."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" defaultValue={chore?.title || ""} placeholder="Clean your room" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                defaultValue={chore?.description || ""}
                placeholder="Make your bed and organize your toys"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="reward">Coin Reward</Label>
                <Input id="reward" type="number" defaultValue={chore?.reward || 30} min={1} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="xp">XP Reward</Label>
                <Input id="xp" type="number" defaultValue={chore?.xp || 15} min={1} required />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select defaultValue={chore?.difficulty || "easy"}>
                <SelectTrigger id="difficulty">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Select defaultValue={chore?.dueDate || "today"}>
                <SelectTrigger id="dueDate">
                  <SelectValue placeholder="Select due date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="tomorrow">Tomorrow</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="next-week">Next Week</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Assign To</Label>
              <RadioGroup defaultValue={chore?.assignedTo?.id || "kid1"} className="flex flex-col space-y-1">
                {kids.map((kid) => (
                  <div key={kid.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={kid.id} id={kid.id} />
                    <Label htmlFor={kid.id} className="flex items-center gap-2 cursor-pointer">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={kid.avatar} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      {kid.name}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{isEditing ? "Save Changes" : "Create Chore"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
