"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSession } from "@/components/session-provider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Plus, Trash2, User, Eye, EyeOff } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

type ChildAccount = {
  id: string
  name: string
  username: string
  pin: string
  image?: string
  totalCoins: number
  totalXp: number
  level: number
  streakDays: number
  createdAt: string
}

export default function FamilyManagement() {
  const { session, loading } = useSession()
  const router = useRouter()
  const [children, setChildren] = useState<ChildAccount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [showPin, setShowPin] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    // Redirect if not logged in or not a parent
    if (!loading && !session) {
      router.push("/auth/signin")
      return
    }

    if (session?.role !== "parent") {
      router.push("/dashboard/child")
      return
    }

    // Load mock children data
    const mockChildren: ChildAccount[] = [
      {
        id: "child-1",
        name: "Alex",
        username: "Alex",
        pin: "1234",
        image: "/placeholder.svg?height=40&width=40",
        totalCoins: 275,
        totalXp: 1850,
        level: 4,
        streakDays: 7,
        createdAt: "2024-01-01T00:00:00Z",
      },
      {
        id: "child-2",
        name: "Jamie",
        username: "Jamie",
        pin: "5678",
        image: "/placeholder.svg?height=40&width=40",
        totalCoins: 150,
        totalXp: 1200,
        level: 3,
        streakDays: 5,
        createdAt: "2024-01-02T00:00:00Z",
      },
    ]

    setChildren(mockChildren)
    setIsLoading(false)
  }, [session, loading, router])

  const handleCreateChild = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const pin = formData.get("pin") as string

    // Validate PIN
    if (!/^\d{4}$/.test(pin)) {
      setError("PIN must be exactly 4 digits")
      return
    }

    // Check if username already exists
    if (children.some((child) => child.username.toLowerCase() === name.toLowerCase())) {
      setError("A child with this name already exists")
      return
    }

    try {
      const newChild: ChildAccount = {
        id: `child-${Date.now()}`,
        name,
        username: name,
        pin,
        image: "/placeholder.svg?height=40&width=40",
        totalCoins: 0,
        totalXp: 0,
        level: 1,
        streakDays: 0,
        createdAt: new Date().toISOString(),
      }

      setChildren([...children, newChild])
      setDialogOpen(false)
      e.currentTarget.reset()
    } catch (error) {
      setError("Failed to create child account")
    }
  }

  const handleDeleteChild = async (childId: string) => {
    if (!confirm("Are you sure you want to delete this child account? This action cannot be undone.")) {
      return
    }

    try {
      setChildren(children.filter((child) => child.id !== childId))
    } catch (error) {
      setError("Failed to delete child account")
    }
  }

  const toggleShowPin = (childId: string) => {
    setShowPin((prev) => ({
      ...prev,
      [childId]: !prev[childId],
    }))
  }

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Family Management</h1>
          <p className="text-muted-foreground">Manage your children's accounts and monitor their progress</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Child Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Child Account</DialogTitle>
              <DialogDescription>
                Create a new account for your child. They will use their name as username and the PIN you set to sign
                in.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateChild} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Child's Name</Label>
                <Input id="name" name="name" required placeholder="Enter child's name" />
                <p className="text-xs text-muted-foreground">This will also be their username for signing in.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pin">4-Digit PIN</Label>
                <Input
                  id="pin"
                  name="pin"
                  type="password"
                  required
                  maxLength={4}
                  pattern="[0-9]{4}"
                  placeholder="Enter 4-digit PIN"
                />
                <p className="text-xs text-muted-foreground">
                  Choose a 4-digit PIN that your child can remember easily.
                </p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <DialogFooter>
                <Button type="submit">Create Account</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-40">
              <p className="text-muted-foreground">No child accounts yet</p>
              <Button variant="outline" className="mt-4 bg-transparent" onClick={() => setDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Child Account
              </Button>
            </CardContent>
          </Card>
        ) : (
          children.map((child) => (
            <Card key={child.id}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={child.image || "/placeholder.svg?height=40&width=40"} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{child.name}</CardTitle>
                    <CardDescription>
                      Level {child.level} • {child.streakDays} day streak
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Username</span>
                    <span className="font-medium">{child.username}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">PIN</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium font-mono">{showPin[child.id] ? child.pin : "••••"}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleShowPin(child.id)}>
                        {showPin[child.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Coins</span>
                    <span className="font-medium text-yellow-600">{child.totalCoins}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">XP</span>
                    <span className="font-medium text-blue-600">{child.totalXp}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => router.push(`/dashboard/parent/kids/${child.id}`)}>
                  View Profile
                </Button>
                <Button variant="destructive" size="icon" onClick={() => handleDeleteChild(child.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
