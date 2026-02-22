"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, AlertCircle, RefreshCw, Plus } from "lucide-react"

interface Chore {
  id: string
  title: string
  description?: string
  points: number
  status: "pending" | "completed" | "approved"
  assigned_to: string
  created_by: string
  due_date?: string
  created_at: string
  updated_at: string
}

interface ChoreListProps {
  showCreateButton?: boolean
  onCreateChore?: () => void
}

export function ChoreList({ showCreateButton = false, onCreateChore }: ChoreListProps) {
  const { user } = useAuth()
  const [chores, setChores] = useState<Chore[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchChores = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)
      console.log("ChoreList: Fetching chores for user:", user.id)

      const response = await fetch(`/api/chores?userId=${user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("ChoreList: Response status:", response.status)
      console.log("ChoreList: Response headers:", Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        console.error("ChoreList: Expected JSON but got:", text.substring(0, 200))
        throw new Error("Server returned HTML instead of JSON. Check your API endpoint.")
      }

      const data = await response.json()
      console.log("ChoreList: Received data:", data)

      if (data.success) {
        setChores(data.chores || [])
      } else {
        throw new Error(data.error || "Failed to fetch chores")
      }
    } catch (error) {
      console.error("Error fetching chores:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch chores")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchChores()
  }, [user])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "approved":
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      completed: "default",
      approved: "default",
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            Loading Chores...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            Error Loading Chores
          </CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={fetchChores} variant="outline" className="w-full bg-transparent">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{user?.role === "parent" ? "Family Chores" : "My Chores"}</CardTitle>
            <CardDescription>
              {chores.length === 0
                ? "No chores found"
                : `${chores.length} chore${chores.length !== 1 ? "s" : ""} found`}
            </CardDescription>
          </div>
          {showCreateButton && (
            <Button onClick={onCreateChore} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Chore
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {chores.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No chores yet</h3>
            <p className="text-gray-500 mb-4">
              {user?.role === "parent" ? "Create some chores to get started!" : "Check back later for new chores."}
            </p>
            {showCreateButton && (
              <Button onClick={onCreateChore}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Chore
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {chores.map((chore) => (
              <div
                key={chore.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(chore.status)}
                  <div>
                    <h4 className="font-medium">{chore.title}</h4>
                    {chore.description && <p className="text-sm text-gray-600">{chore.description}</p>}
                    {chore.due_date && (
                      <p className="text-xs text-gray-500">Due: {new Date(chore.due_date).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-blue-600">{chore.points} pts</span>
                  {getStatusBadge(chore.status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
