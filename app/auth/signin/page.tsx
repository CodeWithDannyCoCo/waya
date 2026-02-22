"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, AlertCircle, Loader2, Users, Baby } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function SignIn() {
  const router = useRouter()
  const { signInParent, signInChild } = useAuth()

  // Parent form state
  const [parentEmail, setParentEmail] = useState("")
  const [parentPassword, setParentPassword] = useState("")
  const [showParentPassword, setShowParentPassword] = useState(false)
  const [parentLoading, setParentLoading] = useState(false)
  const [parentError, setParentError] = useState("")

  // Child form state
  const [childName, setChildName] = useState("")
  const [childPin, setChildPin] = useState("")
  const [showChildPin, setShowChildPin] = useState(false)
  const [childLoading, setChildLoading] = useState(false)
  const [childError, setChildError] = useState("")

  const handleParentSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setParentLoading(true)
    setParentError("")

    try {
      const result = await signInParent(parentEmail, parentPassword)
      if (result.success) {
        router.push("/dashboard/parent")
      } else {
        setParentError(result.error || "Sign in failed")
      }
    } catch (error) {
      setParentError("An unexpected error occurred")
    } finally {
      setParentLoading(false)
    }
  }

  const handleChildSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setChildLoading(true)
    setChildError("")

    if (childPin.length !== 4) {
      setChildError("PIN must be exactly 4 digits")
      setChildLoading(false)
      return
    }

    try {
      const result = await signInChild(childName, childPin)
      if (result.success) {
        router.push("/dashboard/child")
      } else {
        setChildError(result.error || "Sign in failed")
      }
    } catch (error) {
      setChildError("An unexpected error occurred")
    } finally {
      setChildLoading(false)
    }
  }

  const handlePinInput = (value: string) => {
    // Only allow digits and max 4 characters
    const numericValue = value.replace(/\D/g, "").slice(0, 4)
    setChildPin(numericValue)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to ChoreQuest</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <Card className="shadow-lg">
          <Tabs defaultValue="parent" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="parent" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Parent
              </TabsTrigger>
              <TabsTrigger value="child" className="flex items-center gap-2">
                <Baby className="h-4 w-4" />
                Child
              </TabsTrigger>
            </TabsList>

            {/* Parent Sign In */}
            <TabsContent value="parent">
              <Card className="border-0 shadow-none">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl text-center">Parent Sign In</CardTitle>
                  <CardDescription className="text-center">
                    Enter your email and password to access your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleParentSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="parent-email">Email</Label>
                      <Input
                        id="parent-email"
                        type="email"
                        placeholder="parent@example.com"
                        value={parentEmail}
                        onChange={(e) => setParentEmail(e.target.value)}
                        disabled={parentLoading}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="parent-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="parent-password"
                          type={showParentPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={parentPassword}
                          onChange={(e) => setParentPassword(e.target.value)}
                          disabled={parentLoading}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowParentPassword(!showParentPassword)}
                          disabled={parentLoading}
                        >
                          {showParentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    {parentError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{parentError}</AlertDescription>
                      </Alert>
                    )}

                    <Button type="submit" className="w-full" disabled={parentLoading}>
                      {parentLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </form>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-blue-800 mb-2">Demo Parent Account:</p>
                    <p className="text-sm text-blue-700">Email: parent@demo.com</p>
                    <p className="text-sm text-blue-700">Password: demo123</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Child Sign In */}
            <TabsContent value="child">
              <Card className="border-0 shadow-none">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl text-center">Child Sign In</CardTitle>
                  <CardDescription className="text-center">
                    Enter your name and PIN to access your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleChildSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="child-name">Your Name</Label>
                      <Input
                        id="child-name"
                        type="text"
                        placeholder="Enter your name"
                        value={childName}
                        onChange={(e) => setChildName(e.target.value)}
                        disabled={childLoading}
                        required
                      />
                      <p className="text-xs text-gray-500">
                        Use the same name your parent used when creating your account
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="child-pin">4-Digit PIN</Label>
                      <div className="relative">
                        <Input
                          id="child-pin"
                          type={showChildPin ? "text" : "password"}
                          placeholder="Enter your PIN"
                          value={childPin}
                          onChange={(e) => handlePinInput(e.target.value)}
                          disabled={childLoading}
                          maxLength={4}
                          className="text-center text-2xl tracking-widest"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowChildPin(!showChildPin)}
                          disabled={childLoading}
                        >
                          {showChildPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 text-center">{childPin.length}/4 digits entered</p>
                    </div>

                    {childError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{childError}</AlertDescription>
                      </Alert>
                    )}

                    <Button type="submit" className="w-full" disabled={childLoading || childPin.length !== 4}>
                      {childLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </form>

                  <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm font-medium text-green-800 mb-2">Demo Child Account:</p>
                    <p className="text-sm text-green-700">Name: Demo Child</p>
                    <p className="text-sm text-green-700">PIN: 1234</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Button
              variant="link"
              className="p-0 h-auto font-normal text-blue-600 hover:text-blue-800"
              onClick={() => router.push("/auth/signup")}
            >
              Sign up here
            </Button>
          </p>
        </div>
      </div>
    </div>
  )
}
