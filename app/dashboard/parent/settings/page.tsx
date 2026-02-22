"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

export default function ParentSettingsPage() {
  const [formSubmitting, setFormSubmitting] = useState(false)

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setFormSubmitting(false)
      toast({
        title: "Settings saved",
        description: "Your changes have been saved successfully.",
      })
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application preferences</p>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-4 pt-6">
          <form onSubmit={handleSaveChanges}>
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Update your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" defaultValue="Parent Name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="parent@example.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="family-name">Family Name</Label>
                  <Input id="family-name" defaultValue="The Smiths" />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={formSubmitting}>
                  {formSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </form>

          <form onSubmit={handleSaveChanges}>
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Change your password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={formSubmitting}>
                  {formSubmitting ? "Updating..." : "Update Password"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4 pt-6">
          <form onSubmit={handleSaveChanges}>
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose when and how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Chore Completion</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications when a child completes a chore
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Reward Redemption</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications when a child redeems a reward</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Chore Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Send reminders to children about upcoming or overdue chores
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Summary</Label>
                    <p className="text-sm text-muted-foreground">Receive a weekly summary of chores and rewards</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={formSubmitting}>
                  {formSubmitting ? "Saving..." : "Save Preferences"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-4 pt-6">
          <form onSubmit={handleSaveChanges}>
            <Card>
              <CardHeader>
                <CardTitle>Reward Settings</CardTitle>
                <CardDescription>Configure how rewards work for your children</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="approval-mode">Reward Approval Mode</Label>
                  <Select defaultValue="manual">
                    <SelectTrigger id="approval-mode">
                      <SelectValue placeholder="Select approval mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual Approval</SelectItem>
                      <SelectItem value="automatic">Automatic Approval</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Choose whether rewards need your approval before being redeemed
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-daily-rewards">Maximum Daily Rewards</Label>
                  <Select defaultValue="3">
                    <SelectTrigger id="max-daily-rewards">
                      <SelectValue placeholder="Select maximum" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 reward per day</SelectItem>
                      <SelectItem value="2">2 rewards per day</SelectItem>
                      <SelectItem value="3">3 rewards per day</SelectItem>
                      <SelectItem value="unlimited">Unlimited</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">Limit how many rewards a child can redeem each day</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Saving</Label>
                    <p className="text-sm text-muted-foreground">Allow children to save coins for bigger rewards</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={formSubmitting}>
                  {formSubmitting ? "Saving..." : "Save Settings"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  )
}
