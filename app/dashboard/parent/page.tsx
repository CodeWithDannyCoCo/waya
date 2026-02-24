"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Users, CheckCircle, Clock, AlertCircle, Loader2, Baby, Star, Trophy, Coins } from "lucide-react"
import { useRouter } from "next/navigation"

interface Child {
  id: string
  name: string
  totalCoins: number
  totalXp: number
  level: number
  streakDays: number
  completedChores: number
  pendingChores: number
}

export default function ParentDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [children, setChildren] = useState<Child[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [childName, setChildName] = useState("")
  const [childPin, setChildPin] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState("")
  const [loadingChildren, setLoadingChildren] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin")
      return
    }

    if (user && user.role !== "parent") {
      router.push("/dashboard/child")
      return
    }

    if (user) {
      fetchChildren()
    }
  }, [user, loading, router])

  const fetchChildren = async () => {
    try {
      setLoadingChildren(true)
      if (!user) {
        console.error("No user available for fetch")
        return
      }
      
      const response = await fetch("/api/family/children", {
        headers: {
          "x-user-id": user.id,
          "x-user-role": user.role,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setChildren(data.children || [])
      } else {
        console.error("Failed to fetch children")
      }
    } catch (error) {
      console.error("Error fetching children:", error)
    } finally {
      setLoadingChildren(false)
    }
  }

  const handleCreateChild = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!childName.trim() || childPin.length !== 4) {
      setError("Please provide a name and 4-digit PIN")
      return
    }

    // Check for duplicate names
    if (children.some((child) => child.name.toLowerCase() === childName.toLowerCase())) {
      setError("A child with this name already exists")
      return
    }

    setIsCreating(true)
    setError("")

    try {
      if (!user) {
        setError("User not authenticated")
        setIsCreating(false)
        return
      }
      
      const response = await fetch("/api/family/children", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
          "x-user-role": user.role,
        },
        body: JSON.stringify({
          name: childName.trim(),
          pin: childPin,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        console.log("Child created successfully:", data.child)
        setChildren((prev) => [...prev, data.child])
        setIsCreateDialogOpen(false)
        setChildName("")
        setChildPin("")
      } else {
        setError(data.error || "Failed to create child account")
      }
    } catch (error) {
      console.error("Error creating child:", error)
      setError("Network error. Please try again.")
    } finally {
      setIsCreating(false)
    }
  }

  const handlePinInput = (value: string) => {
    // Only allow digits and max 4 characters
    const numericValue = value.replace(/\D/g, "").slice(0, 4)
    setChildPin(numericValue)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2 text-blue-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  if (!user || user.role !== "parent") {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
          <p className="text-gray-600">Manage your family's chore activities and track progress</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Child Account
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Child Account</DialogTitle>
              <DialogDescription>
                Add a new child to your family. They'll use their name and PIN to sign in.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateChild} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="child-name">Child's Name</Label>
                <Input
                  id="child-name"
                  placeholder="Enter child's name"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  disabled={isCreating}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="child-pin">4-Digit PIN</Label>
                <Input
                  id="child-pin"
                  type="password"
                  placeholder="Create a 4-digit PIN"
                  value={childPin}
                  onChange={(e) => handlePinInput(e.target.value)}
                  disabled={isCreating}
                  maxLength={4}
                  className="text-center text-2xl tracking-widest"
                  required
                />
                <p className="text-xs text-gray-500 text-center">{childPin.length}/4 digits</p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating || !childName.trim() || childPin.length !== 4}>
                  {isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Children</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{children.length}</div>
            <p className="text-xs text-muted-foreground">Active family members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Chores</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {children.reduce((sum, child) => sum + (child.completedChores || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Chores</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {children.reduce((sum, child) => sum + (child.pendingChores || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting completion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Coins Earned</CardTitle>
            <Coins className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {children.reduce((sum, child) => sum + (child.totalCoins || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">Family total</p>
          </CardContent>
        </Card>
      </div>

      {/* Children Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Baby className="h-5 w-5" />
            Children Overview
          </CardTitle>
          <CardDescription>Monitor your children's progress and activities</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingChildren ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2 text-gray-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading children...</span>
              </div>
            </div>
          ) : children.length === 0 ? (
            <div className="text-center py-8">
              <Baby className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No children yet</h3>
              <p className="text-gray-600 mb-4">Create your first child account to get started with ChoreQuest!</p>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Child Account
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {children.map((child) => (
                <Card key={child.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{child.name}</CardTitle>
                      <div className="flex items-center gap-1 text-sm text-yellow-600">
                        <Star className="h-4 w-4" />
                        Level {child.level || 1}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Coins</span>
                      <div className="flex items-center gap-1">
                        <Coins className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">{child.totalCoins || 0}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">XP</span>
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">{child.totalXp || 0}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Streak</span>
                      <span className="font-medium">{child.streakDays || 0} days</span>
                    </div>
                    <div className="pt-2 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-transparent"
                        onClick={() => router.push(`/dashboard/parent/kids/${child.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => router.push("/dashboard/parent/kids")}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Manage Family
            </CardTitle>
            <CardDescription>View and manage all family members</CardDescription>
          </CardHeader>
        </Card>

        <Card
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => router.push("/dashboard/parent/chores")}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Manage Chores
            </CardTitle>
            <CardDescription>Create and assign chores to children</CardDescription>
          </CardHeader>
        </Card>

        <Card
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => router.push("/dashboard/parent/monitor")}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              Activity Monitor
            </CardTitle>
            <CardDescription>Track real-time family activities</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
