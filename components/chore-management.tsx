"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle, Clock, Edit, Trash2, User } from "lucide-react"
import { CreateChoreDialog } from "@/components/create-chore-dialog"
import { toast } from "@/components/ui/use-toast"

// Mock data for chores
const mockChores = [
  {
    id: "1",
    title: "Clean your room",
    description: "Make your bed and organize your toys",
    reward: 50,
    xp: 20,
    difficulty: "easy",
    dueDate: "Today",
    status: "pending",
    assignedTo: {
      id: "kid1",
      name: "Alex",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  },
  {
    id: "2",
    title: "Take out the trash",
    description: "Empty all trash bins and take to the curb",
    reward: 30,
    xp: 15,
    difficulty: "easy",
    dueDate: "Today",
    status: "pending",
    assignedTo: {
      id: "kid2",
      name: "Jamie",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  },
  {
    id: "3",
    title: "Do the dishes",
    description: "Wash all dishes and put them away",
    reward: 40,
    xp: 25,
    difficulty: "medium",
    dueDate: "Tomorrow",
    status: "pending",
    assignedTo: {
      id: "kid1",
      name: "Alex",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  },
  {
    id: "4",
    title: "Fold laundry",
    description: "Fold clean clothes and put them away",
    reward: 35,
    xp: 20,
    difficulty: "medium",
    dueDate: "Tomorrow",
    status: "completed",
    assignedTo: {
      id: "kid2",
      name: "Jamie",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  },
  {
    id: "5",
    title: "Water the plants",
    description: "Water all indoor and outdoor plants",
    reward: 25,
    xp: 10,
    difficulty: "easy",
    dueDate: "Today",
    status: "completed",
    assignedTo: {
      id: "kid1",
      name: "Alex",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  },
]

export function ChoreManagement() {
  const [chores, setChores] = useState(mockChores)

  const handleApproveChore = (id: string) => {
    // Find the chore to get its details
    const chore = chores.find((c) => c.id === id)

    setChores(chores.map((chore) => (chore.id === id ? { ...chore, status: "approved" } : chore)))

    // Show toast notification
    if (chore) {
      toast({
        title: "Chore Approved",
        description: `${chore.assignedTo.name} has been rewarded with ${chore.reward} coins and ${chore.xp} XP.`,
      })
    }
  }

  const handleDeleteChore = (id: string) => {
    setChores(chores.filter((chore) => chore.id !== id))

    toast({
      title: "Chore Deleted",
      description: "The chore has been deleted successfully.",
    })
  }

  const pendingChores = chores.filter((chore) => chore.status === "pending")
  const completedChores = chores.filter((chore) => chore.status === "completed" || chore.status === "approved")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chore Management</CardTitle>
        <CardDescription>Create, assign, and manage chores for your children</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pending">Pending ({pendingChores.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedChores.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-4 space-y-4">
            {pendingChores.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No pending chores. Create some chores for your kids!
              </div>
            ) : (
              pendingChores.map((chore) => (
                <Card key={chore.id} className="mb-4">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{chore.title}</CardTitle>
                      <div className="flex gap-2">
                        <CreateChoreDialog chore={chore}>
                          <Button size="icon" variant="ghost" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </CreateChoreDialog>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteChore(chore.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription>{chore.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="flex flex-wrap justify-between items-center">
                      <div className="flex items-center gap-4">
                        <Badge
                          variant={
                            chore.difficulty === "easy"
                              ? "outline"
                              : chore.difficulty === "medium"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {chore.difficulty}
                        </Badge>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                          <span className="text-xs text-muted-foreground">{chore.dueDate}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2 sm:mt-0">
                        <div className="flex items-center gap-1 text-sm">
                          <span className="text-yellow-500 font-medium">{chore.reward} coins</span>
                          <span className="text-muted-foreground">/</span>
                          <span className="text-blue-500 font-medium">{chore.xp} XP</span>
                        </div>
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={chore.assignedTo.avatar} />
                            <AvatarFallback>
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <span className="ml-1 text-sm">{chore.assignedTo.name}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-4 space-y-4">
            {completedChores.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No completed chores yet.</div>
            ) : (
              completedChores.map((chore) => (
                <Card key={chore.id} className="mb-4 bg-muted/50">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <CardTitle className="text-lg">{chore.title}</CardTitle>
                      </div>
                      <Badge
                        variant={chore.status === "approved" ? "default" : "outline"}
                        className={chore.status === "approved" ? "bg-green-500" : ""}
                      >
                        {chore.status === "approved" ? "Approved" : "Completed"}
                      </Badge>
                    </div>
                    <CardDescription>{chore.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="flex flex-wrap justify-between items-center">
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">{chore.difficulty}</Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-2 sm:mt-0">
                        <div className="flex items-center gap-1 text-sm">
                          <span className="text-yellow-500 font-medium">{chore.reward} coins</span>
                          <span className="text-muted-foreground">/</span>
                          <span className="text-blue-500 font-medium">{chore.xp} XP</span>
                        </div>
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={chore.assignedTo.avatar} />
                            <AvatarFallback>
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <span className="ml-1 text-sm">{chore.assignedTo.name}</span>
                        </div>
                      </div>
                    </div>
                    {chore.status === "completed" && (
                      <div className="mt-4 flex justify-end">
                        <Button size="sm" onClick={() => handleApproveChore(chore.id)}>
                          Approve & Reward
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
