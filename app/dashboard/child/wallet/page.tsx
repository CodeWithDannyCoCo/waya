"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Wallet,
  Coins,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Calendar,
  Filter,
  RefreshCw,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

interface Transaction {
  id: string
  type: "coin_conversion" | "parent_transfer" | "reward_redemption"
  amount: number
  description: string
  status: "completed" | "pending" | "failed"
  timestamp: string
  coinAmount?: number
}

interface WalletData {
  balance: number
  pendingConversions: number
  totalEarned: number
  conversionRate: number
  availableCoins: number
}

export default function ChildWallet() {
  const { user } = useAuth()
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [walletData, setWalletData] = useState<WalletData | null>(null)
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [coinConversionAmount, setCoinConversionAmount] = useState("")
  const [isConverting, setIsConverting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/auth/signin")
      return
    }

    if (user.role !== "child") {
      router.push("/dashboard/parent")
      return
    }

    fetchWalletData()
    fetchTransactions()
  }, [user, router])

  const fetchWalletData = async () => {
    try {
      if (!user) return
      
      const response = await fetch("/api/wallet/balance", {
        headers: {
          "x-user-id": user.id,
          "x-user-role": user.role,
        },
      })
      const data = await response.json()

      if (response.ok) {
        setWalletData(data.balance)
      } else {
        console.error("Error fetching wallet data:", data.error)
      }
    } catch (error) {
      console.error("Error fetching wallet data:", error)
    }
  }

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/wallet/transactions")
      const data = await response.json()

      if (response.ok) {
        setTransactions(data.transactions || [])
      } else {
        console.error("Error fetching transactions:", data.error)
      }
    } catch (error) {
      console.error("Error fetching transactions:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCoinConversion = async () => {
    const amount = Number.parseFloat(coinConversionAmount)

    if (!amount || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      })
      return
    }

    if (!walletData || amount > walletData.availableCoins) {
      toast({
        title: "Insufficient Coins",
        description: "You don't have enough coins",
        variant: "destructive",
      })
      return
    }

    setIsConverting(true)

    try {
      const response = await fetch("/api/wallet/convert/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ coinAmount: amount }),
      })

      const data = await response.json()

      if (response.ok) {
        setCoinConversionAmount("")
        await fetchWalletData()
        await fetchTransactions()

        toast({
          title: "Conversion Requested",
          description: `${amount} coins (₦${amount * walletData.conversionRate}) is pending parent approval.`,
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to request conversion",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error requesting conversion:", error)
      toast({
        title: "Error",
        description: "Failed to request conversion. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsConverting(false)
    }
  }

  if (loading || !walletData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const typeMatch = filterType === "all" || transaction.type === filterType
    const statusMatch = filterStatus === "all" || transaction.status === filterStatus
    return typeMatch && statusMatch
  })

  const getTransactionIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "parent_transfer":
        return <ArrowDownLeft className="h-4 w-4 text-green-600" />
      case "coin_conversion":
        return <Coins className="h-4 w-4 text-blue-600" />
      case "reward_redemption":
        return <ArrowUpRight className="h-4 w-4 text-red-600" />
      default:
        return <Wallet className="h-4 w-4" />
    }
  }

  const getStatusIcon = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Wallet</h1>
        <p className="text-muted-foreground">Manage your real money and coin conversions</p>
      </div>

      {/* Wallet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Available Balance</p>
                <p className="text-3xl font-bold">₦{walletData.balance.toLocaleString()}</p>
              </div>
              <Wallet className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">Pending Conversions</p>
                <p className="text-3xl font-bold">₦{walletData.pendingConversions.toLocaleString()}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Earned</p>
                <p className="text-3xl font-bold">₦{walletData.totalEarned.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Coin Conversion */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-yellow-600" />
                Convert Coins to Cash
              </CardTitle>
              <CardDescription>
                Convert your earned coins to real money (₦{walletData.conversionRate} per coin)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div>
                  <p className="font-medium">Available Coins</p>
                  <p className="text-2xl font-bold text-yellow-600">{walletData.availableCoins}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Conversion Value</p>
                  <p className="text-xl font-bold">
                    ₦{(walletData.availableCoins * walletData.conversionRate).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="coinAmount">Coins to Convert</Label>
                  <Input
                    id="coinAmount"
                    type="number"
                    placeholder="Enter amount"
                    max={walletData.availableCoins}
                    value={coinConversionAmount}
                    onChange={(e) => setCoinConversionAmount(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleCoinConversion}
                  disabled={isConverting || !coinConversionAmount || Number.parseFloat(coinConversionAmount) <= 0}
                >
                  {isConverting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Requesting Conversion...
                    </>
                  ) : (
                    "Request Conversion (Requires Parent Approval)"
                  )}
                </Button>
              </div>

              <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="font-medium text-blue-800 mb-1">How it works:</p>
                <ul className="space-y-1 text-blue-700">
                  <li>• Submit a conversion request</li>
                  <li>• Your parent will review and approve</li>
                  <li>• Money will be added to your wallet</li>
                  <li>• You can track the status in transactions</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest wallet transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.slice(0, 3).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(transaction.timestamp)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">+₦{transaction.amount}</p>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(transaction.status)}
                        <span className="text-xs capitalize">{transaction.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span className="text-sm font-medium">Filters:</span>
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Transaction Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="parent_transfer">Parent Transfer</SelectItem>
                    <SelectItem value="coin_conversion">Coin Conversion</SelectItem>
                    <SelectItem value="reward_redemption">Reward Redemption</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Complete history of your wallet transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredTransactions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Wallet className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No transactions found</p>
                  </div>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        {getTransactionIcon(transaction.type)}
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {formatDate(transaction.timestamp)}
                            {transaction.coinAmount && (
                              <>
                                <span>•</span>
                                <span>{transaction.coinAmount} coins</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">+₦{transaction.amount}</p>
                        <div className="flex items-center gap-1 justify-end">
                          {getStatusIcon(transaction.status)}
                          <Badge
                            variant={
                              transaction.status === "completed"
                                ? "default"
                                : transaction.status === "pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                            className="text-xs"
                          >
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
