"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import type { BusinessType } from "./types"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface BusinessSetupProps {
  business: BusinessType
  balance: number
  onComplete: (name: string, price: number, inventory: number, marketing: number) => void
}

export function BusinessSetup({ business, balance, onComplete }: BusinessSetupProps) {
  const [businessName, setBusinessName] = useState("")
  const [price, setPrice] = useState(business.priceRange.optimal)
  const [inventory, setInventory] = useState(10)
  const [marketing, setMarketing] = useState(10)
  const [error, setError] = useState<string | null>(null)

  const inventoryCost = inventory * (business.startupCost / 10)
  const marketingCost = marketing
  const totalCost = inventoryCost + marketingCost

  const handleSubmit = () => {
    if (!businessName.trim()) {
      setError("Please enter a business name")
      return
    }

    if (totalCost > balance) {
      setError("You don't have enough money for this setup")
      return
    }

    onComplete(businessName, price, inventory, marketing)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Setup Your {business.name}</h2>
        <p className="text-muted-foreground">
          Customize your business and allocate your starting budget of ${balance}.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="business-name">Business Name</Label>
          <Input
            id="business-name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Enter a catchy name for your business"
          />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <Label htmlFor="price">Price (${price})</Label>
            <span className="text-sm text-muted-foreground">
              Range: ${business.priceRange.min} - ${business.priceRange.max}
            </span>
          </div>
          <Slider
            id="price"
            min={business.priceRange.min}
            max={business.priceRange.max}
            step={1}
            value={[price]}
            onValueChange={(value) => setPrice(value[0])}
          />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <Label htmlFor="inventory">Starting Inventory ({inventory} units)</Label>
            <span className="text-sm text-muted-foreground">Cost: ${inventoryCost.toFixed(2)}</span>
          </div>
          <Slider
            id="inventory"
            min={5}
            max={50}
            step={5}
            value={[inventory]}
            onValueChange={(value) => setInventory(value[0])}
          />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <Label htmlFor="marketing">Marketing Budget (${marketing})</Label>
            <span className="text-sm text-muted-foreground">Cost: ${marketingCost.toFixed(2)}</span>
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
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Total Cost</h3>
              <p className="text-sm text-muted-foreground">Inventory + Marketing</p>
            </div>
            <div className="text-right">
              <p className="font-bold">${totalCost.toFixed(2)}</p>
              <p className={`text-sm ${totalCost > balance ? "text-red-500" : "text-green-500"}`}>
                {totalCost > balance ? "Over budget!" : "Within budget"}
              </p>
            </div>
          </div>
          <div className="mt-2 flex justify-between items-center">
            <div>
              <h3 className="font-medium">Remaining Balance</h3>
            </div>
            <div>
              <p className={`font-bold ${(balance - totalCost) < 0 ? "text-red-500" : ""}`}>
                ${(balance - totalCost).toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button size="lg" onClick={handleSubmit} disabled={totalCost > balance || !businessName.trim()}>
          Start Your Business
        </Button>
      </div>
    </div>
  )
}
