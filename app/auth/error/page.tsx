"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft } from 'lucide-react'
import { setSession, DEMO_PARENT, DEMO_CHILD } from "@/lib/session"

export default function AuthError() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [errorMessage, setErrorMessage] = useState<string>("An authentication error occurred")

  useEffect(() => {
    const error = searchParams?.get("error")

    if (error) {
      switch (error) {
        case "Configuration":
          setErrorMessage("There is a problem with the server configuration.")
          break
        case "AccessDenied":
          setErrorMessage("You do not have access to this resource.")
          break
        case "Verification":
          setErrorMessage("The verification link may have been used or is invalid.")
          break
        case "OAuthSignin":
        case "OAuthCallback":
        case "OAuthCreateAccount":
        case "EmailCreateAccount":
        case "Callback":
        case "OAuthAccountNotLinked":
        case "EmailSignin":
        case "CredentialsSignin":
          setErrorMessage("There was a problem with your sign in attempt.")
          break
        case "SessionRequired":
          setErrorMessage("You must be signed in to access this page.")
          break
        default:
          setErrorMessage("An unexpected error occurred during authentication.")
          break
      }
    }
  }, [searchParams])

  const handleContinueAsParent = () => {
    setSession(DEMO_PARENT)
    router.push("/dashboard/parent")
  }

  const handleContinueAsChild = () => {
    setSession(DEMO_CHILD)
    router.push("/dashboard/child")
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-4">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Authentication Error</CardTitle>
            <CardDescription className="text-center">There was a problem with your authentication</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>

            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                You can try signing in again or use demo mode to continue.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button variant="default" className="w-full" onClick={() => router.push("/auth/signin")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sign In
            </Button>

            <Button variant="outline" className="w-full" onClick={handleContinueAsParent}>
              Continue as Parent (Demo)
            </Button>

            <Button variant="outline" className="w-full" onClick={handleContinueAsChild}>
              Continue as Child (Demo)
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
