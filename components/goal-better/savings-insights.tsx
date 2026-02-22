"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart, BarChart, LineChart } from "lucide-react"

export function SavingsInsights() {
  // Mock data for charts
  const savingsData = {
    totalSaved: 1850,
    totalGoals: 3,
    completedGoals: 1,
    averageSavingRate: 42,
    savingsByCategory: [
      { category: "Sports", amount: 1200, color: "bg-blue-500" },
      { category: "Entertainment", amount: 450, color: "bg-purple-500" },
      { category: "Hobbies", amount: 200, color: "bg-green-500" },
    ],
    savingsByMonth: [
      { month: "Jan", amount: 150 },
      { month: "Feb", amount: 220 },
      { month: "Mar", amount: 180 },
      { month: "Apr", amount: 350 },
      { month: "May", amount: 450 },
      { month: "Jun", amount: 500 },
    ],
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Saved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{savingsData.totalSaved}</div>
            <p className="text-xs text-muted-foreground">coins</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-500">{savingsData.totalGoals}</div>
            <p className="text-xs text-muted-foreground">savings goals</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">{savingsData.completedGoals}</div>
            <p className="text-xs text-muted-foreground">goals achieved</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Saving Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">{savingsData.averageSavingRate}%</div>
            <p className="text-xs text-muted-foreground">of earnings saved</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="distribution" className="w-full">
        <TabsList>
          <TabsTrigger value="distribution">
            <PieChart className="h-4 w-4 mr-2" />
            Distribution
          </TabsTrigger>
          <TabsTrigger value="history">
            <BarChart className="h-4 w-4 mr-2" />
            History
          </TabsTrigger>
          <TabsTrigger value="progress">
            <LineChart className="h-4 w-4 mr-2" />
            Progress
          </TabsTrigger>
        </TabsList>

        <TabsContent value="distribution" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Savings by Category</CardTitle>
              <CardDescription>How your savings are distributed across different goals</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              {/* Simple visual pie chart representation */}
              <div className="relative w-48 h-48 mb-6">
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  {savingsData.savingsByCategory.map((item, index) => {
                    const percentage = (item.amount / savingsData.totalSaved) * 100
                    const previousPercentages = savingsData.savingsByCategory
                      .slice(0, index)
                      .reduce((sum, curr) => sum + (curr.amount / savingsData.totalSaved) * 100, 0)

                    return (
                      <div
                        key={item.category}
                        className={`absolute h-full ${item.color}`}
                        style={{
                          width: "100%",
                          clipPath: `polygon(0 0, 100% 0, 100% 100%, 0% 100%)`,
                          transform: `rotate(${previousPercentages * 3.6}deg)`,
                          transformOrigin: "center",
                          opacity: 0.8,
                          zIndex: index,
                        }}
                      />
                    )
                  })}
                  <div className="absolute inset-4 bg-card rounded-full flex items-center justify-center">
                    <span className="font-bold text-lg">{savingsData.totalSaved}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                {savingsData.savingsByCategory.map((item) => (
                  <div key={item.category} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-sm">
                      {item.category}: {item.amount} coins
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Savings</CardTitle>
              <CardDescription>Your savings history over the past 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-2">
                {savingsData.savingsByMonth.map((item) => {
                  const height = (item.amount / Math.max(...savingsData.savingsByMonth.map((m) => m.amount))) * 100

                  return (
                    <div
                      key={item.month}
                      className="flex flex-col items-center gap-1"
                      style={{ width: "100%", flex: 1 }}
                    >
                      <div className="w-full bg-primary rounded-t-md" style={{ height: `${height}%` }} />
                      <span className="text-xs">{item.month}</span>
                      <span className="text-xs font-medium">{item.amount}</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Goal Progress</CardTitle>
              <CardDescription>Track your progress towards each savings goal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "New Bicycle", target: 2000, current: 1200 },
                  { name: "Video Game", target: 600, current: 450 },
                  { name: "Art Supplies", target: 800, current: 200 },
                ].map((goal) => {
                  const progress = Math.round((goal.current / goal.target) * 100)

                  return (
                    <div key={goal.name} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{goal.name}</span>
                        <span>{progress}% complete</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }} />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{goal.current} coins</span>
                        <span>{goal.target} coins</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
