"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  PiggyBank,
  ShoppingCart,
  Coffee,
  Gift,
  AlertTriangle,
  DollarSign,
  Target,
  Lightbulb,
  Coins,
} from "lucide-react"

export function BudgetTutorial() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
            How to Play Budget Battle
          </CardTitle>
          <CardDescription>Learn the rules and strategies for successful budgeting</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basics">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basics">Game Basics</TabsTrigger>
              <TabsTrigger value="categories">Budget Categories</TabsTrigger>
              <TabsTrigger value="strategies">Winning Strategies</TabsTrigger>
            </TabsList>

            <TabsContent value="basics" className="mt-4 space-y-4">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full text-blue-500">
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">Step 1: Allocate Your Budget</h3>
                    <p className="text-muted-foreground">
                      You'll start with 1,000 coins as your allowance. Use the sliders to allocate this money across
                      five budget categories: Savings, Needs, Wants, Giving, and Emergency. Think carefully about how
                      much to put in each category!
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full text-amber-500">
                    <Target className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">Step 2: Face Financial Scenarios</h3>
                    <p className="text-muted-foreground">
                      After allocating your budget, you'll face a series of financial scenarios. Each scenario will test
                      a specific budget category. You'll need to make decisions based on your budget allocation.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full text-green-500">
                    <Coins className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">Step 3: Track Your Score</h3>
                    <p className="text-muted-foreground">
                      Your decisions will affect three key metrics: Score, Happiness, and Financial Health. The goal is
                      to maximize all three by making smart budgeting decisions. At the end, you'll receive a final
                      grade and rewards based on your performance.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-medium mb-2">Game Objectives:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Create a balanced budget that prepares you for various scenarios</li>
                  <li>Make wise financial decisions when faced with choices</li>
                  <li>Maintain both happiness and financial health</li>
                  <li>Earn the highest score possible to level up and unlock achievements</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="categories" className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <PiggyBank className="h-5 w-5 mr-2 text-blue-500" />
                      Savings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Money set aside for future goals and large purchases. Financial experts recommend saving 15-20% of
                      your income.
                    </p>
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Example scenarios:</span>
                      <ul className="list-disc pl-5 mt-1">
                        <li>Saving for a new bike</li>
                        <li>Putting money aside for college</li>
                        <li>Saving for a special trip</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <ShoppingCart className="h-5 w-5 mr-2 text-green-500" />
                      Needs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Essential expenses that you must pay for. These typically should take up about 50% of your budget.
                    </p>
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Example scenarios:</span>
                      <ul className="list-disc pl-5 mt-1">
                        <li>Buying lunch at school</li>
                        <li>Transportation costs</li>
                        <li>School supplies</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Coffee className="h-5 w-5 mr-2 text-purple-500" />
                      Wants
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Non-essential items that make life more enjoyable. These should take up no more than 30% of your
                      budget.
                    </p>
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Example scenarios:</span>
                      <ul className="list-disc pl-5 mt-1">
                        <li>Video games or toys</li>
                        <li>Movie tickets</li>
                        <li>Treats and snacks</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Gift className="h-5 w-5 mr-2 text-amber-500" />
                      Giving
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Money for gifts, donations, and helping others. Many people aim to give around 5-10% of their
                      income.
                    </p>
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Example scenarios:</span>
                      <ul className="list-disc pl-5 mt-1">
                        <li>Donating to charity</li>
                        <li>Buying gifts for friends or family</li>
                        <li>Contributing to school fundraisers</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                      Emergency
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Funds set aside for unexpected expenses and emergencies. Financial experts recommend having 3-6
                      months of expenses saved, but for this game, aim for 5-10% of your budget.
                    </p>
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Example scenarios:</span>
                      <ul className="list-disc pl-5 mt-1">
                        <li>Broken bike that needs repair</li>
                        <li>Lost or damaged school items that need replacement</li>
                        <li>Unexpected medical expenses</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="strategies" className="mt-4 space-y-4">
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Balanced Budget Strategy</h3>
                  <p className="text-sm">A good starting point is to follow the 50/30/20 rule:</p>
                  <ul className="list-disc pl-5 mt-2 text-sm">
                    <li>
                      <span className="font-medium">50%</span> for needs
                    </li>
                    <li>
                      <span className="font-medium">30%</span> for wants
                    </li>
                    <li>
                      <span className="font-medium">20%</span> for savings and emergency fund
                    </li>
                  </ul>
                  <p className="text-sm mt-2">For Budget Battle, you might adjust this to include giving:</p>
                  <ul className="list-disc pl-5 mt-2 text-sm">
                    <li>
                      <span className="font-medium">45%</span> for needs
                    </li>
                    <li>
                      <span className="font-medium">25%</span> for wants
                    </li>
                    <li>
                      <span className="font-medium">15%</span> for savings
                    </li>
                    <li>
                      <span className="font-medium">10%</span> for emergency fund
                    </li>
                    <li>
                      <span className="font-medium">5%</span> for giving
                    </li>
                  </ul>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Decision-Making Tips</h3>
                  <ul className="list-disc pl-5 text-sm">
                    <li>Always check if you have enough in the relevant budget category before making a decision</li>
                    <li>Consider both short-term happiness and long-term financial health</li>
                    <li>Emergency funds should be used only for true emergencies</li>
                    <li>Sometimes delaying gratification (waiting to buy something) is the best choice</li>
                    <li>Look for creative solutions that save money while still meeting your needs</li>
                  </ul>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Score Maximizing Strategy</h3>
                  <p className="text-sm">To achieve the highest score in Budget Battle:</p>
                  <ul className="list-disc pl-5 mt-2 text-sm">
                    <li>Allocate enough to each category to handle likely scenarios</li>
                    <li>Prioritize savings and emergency funds for long-term financial health</li>
                    <li>Don't neglect happiness - allocate some money to wants and giving</li>
                    <li>When faced with decisions, look for options that balance immediate needs with future goals</li>
                    <li>Remember that the highest-scoring option is usually the most financially responsible one</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Budget Battle Scoring System</CardTitle>
          <CardDescription>Understanding how your performance is evaluated</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>Your final score in Budget Battle is calculated based on three main factors:</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Budget Allocation</h3>
                <p className="text-sm text-muted-foreground">
                  How well you divided your money across different categories. A balanced budget that follows
                  recommended percentages will score higher.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Decision Quality</h3>
                <p className="text-sm text-muted-foreground">
                  The choices you made when faced with financial scenarios. Better financial decisions earn more points.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Balance Metrics</h3>
                <p className="text-sm text-muted-foreground">
                  Your final Happiness and Financial Health scores. The game rewards players who maintain both.
                </p>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Score Grades:</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-500">A</div>
                  <div className="text-xs text-muted-foreground">800+ points</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-500">B</div>
                  <div className="text-xs text-muted-foreground">600-799 points</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-500">C</div>
                  <div className="text-xs text-muted-foreground">400-599 points</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-500">D</div>
                  <div className="text-xs text-muted-foreground">200-399 points</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-red-500">F</div>
                  <div className="text-xs text-muted-foreground">0-199 points</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
