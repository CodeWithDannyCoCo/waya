"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import type { GameState } from "./types"
import { AlertCircle, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface DailyDecisionsProps {
  gameState: GameState
  onSubmit: (price: number, inventory: number, marketing: number, quality: number) => void
}

export function DailyDecisions({ gameState, onSubmit }: DailyDecisionsProps) {
  const {
    business,
    price: currentPrice,
    inventory: currentInventory,
    marketing: currentMarketing,
    quality: currentQuality,
    balance,
  } = gameState

  const [price, setPrice] = useState(currentPrice)
  const [inventory, setInventory] = useState(currentInventory)
  const [marketing, setMarketing] = useState(currentMarketing)
  const [quality, setQuality] = useState(currentQuality)
  const [error, setError] = useState<string | null>(null)

  // Reset state when gameState changes
  useEffect(() => {
    setPrice(currentPrice)
    setInventory(currentInventory)
    setMarketing(currentMarketing)
    setQuality(currentQuality)
    setError(null)
  }, [currentPrice, currentInventory, currentMarketing, currentQuality])

  // Calculate costs
  const inventoryCost = business ? (inventory - currentInventory) * (business.startupCost / 10) : 0
  const totalCost = inventoryCost + marketing

  const handleSubmit = () => {
    if (totalCost > balance) {
      setError("You don't have enough money for these decisions")
      return
    }

    if (inventory <= 0) {
      setError("You need to have some inventory to run your business")
      return
    }

    onSubmit(price, inventory, marketing, quality)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Daily Decisions</h2>
        <p className="text-muted-foreground">Make strategic decisions to run your business for the day.</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pricing & Quality</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <Label htmlFor="price">Price (${price})</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Higher prices may reduce customers but increase profit margins.</p>
                      <p className="text-xs mt-1">
                        Optimal range: ${business?.priceRange.min} - ${business?.priceRange.max}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Slider
                id="price"
                min={business?.priceRange.min || 1}
                max={business?.priceRange.max || 50}
                step={1}
                value={[price]}
                onValueChange={(value) => setPrice(value[0])}
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <Label htmlFor="quality">Quality ({quality}%)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Higher quality increases costs but improves reputation.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Slider
                id="quality"
                min={10}
                max={100}
                step={10}
                value={[quality]}
                onValueChange={(value) => setQuality(value[0])}
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted-foreground">Basic</span>
                <span className="text-xs text-muted-foreground">Premium</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Inventory & Marketing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <Label htmlFor="inventory">Inventory ({inventory} units)</Label>
                <span className="text-sm text-muted-foreground">
                  {inventoryCost > 0 ? `Cost: $${inventoryCost.toFixed(2)}` : "No change"}
                </span>
              </div>
              <Slider
                id="inventory"
                min={0}
                max={50}
                step={5}
                value={[inventory]}
                onValueChange={(value) => setInventory(value[0])}
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted-foreground">Current: {currentInventory}</span>
                <span className="text-xs text-muted-foreground">
                  {inventory > currentInventory
                    ? `Buy ${inventory - currentInventory}`
                    : inventory < currentInventory
                      ? `Reduce by ${currentInventory - inventory}`
                      : "No change"}
                </span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <Label htmlFor="marketing">Marketing Budget (${marketing})</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Higher marketing attracts more customers.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Slider
                id="marketing"
                min={0}
                max={50}
                step={5}
                value={[marketing]}
                onValueChange={(value) => setMarketing(value[0])}
              />
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Total Cost</p>
                <p className="text-xs text-muted-foreground">Inventory + Marketing</p>
              </div>
              <div className="text-right">
                <p className="font-bold">${totalCost.toFixed(2)}</p>
                <p className={`text-xs ${totalCost > balance ? "text-red-500" : "text-green-500"}`}>
                  {totalCost > balance ? "Over budget!" : "Within budget"}
                </p>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button size="lg" onClick={handleSubmit} disabled={totalCost > balance || inventory <= 0}>
          Run Your Business Today
        </Button>
      </div>
    </div>
  )
}
