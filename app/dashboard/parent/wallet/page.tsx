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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Wallet,
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Send,
  Coins,
  Calendar,
  Filter,
  Eye,
  RefreshCw,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

interface Transaction {
  id: string
  type: "funding" | "child_transfer" | "coin_conversion_approval"
  amount: number
  description: string
  status: "completed" | "pending" | "failed"
  timestamp: string
  childName?: string
  coinAmount?: number
}

interface ChildWallet {
  id: string
  name: string
  balance: number
  pendingConversions: number
  totalEarned: number
  image: string
}

interface ConversionRequest {
  id: string
  childId: string
  childName: string
  coinAmount: number
  nairaAmount: number
  timestamp: string
  status: "pending" | "approved" | "rejected"
}

interface WalletData {
  balance: number
  totalFunded: number
  totalSpent: number
  pendingApprovals: number
}

export default function ParentWallet() {
  const { user } = useAuth()
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [childrenWallets, setChildrenWallets] = useState<ChildWallet[]>([])
  const [conversionRequests, setConversionRequests] = useState<ConversionRequest[]>([])
  const [walletData, setWalletData] = useState<WalletData | null>(null)
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [fundingAmount, setFundingAmount] = useState("")
  const [transferAmount, setTransferAmount] = useState("")
  const [selectedChild, setSelectedChild] = useState("")
  const [isProcessing, setIsProcessing] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const [parentPin, setParentPin] = useState<string | null>(null)
  const [isSettingPin, setIsSettingPin] = useState(false)
  const [newPin, setNewPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const [pinForTransfer, setPinForTransfer] = useState("")
  const [showPinInput, setShowPinInput] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/auth/signin")
      return
    }

    if (user.role !== "parent") {
      router.push("/dashboard/child")
      return
    }

    fetchWalletData()
    fetchTransactions()
    fetchChildrenWallets()
    fetchConversionRequests()
    checkPinStatus()
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
      if (!user) return
      
      const response = await fetch("/api/wallet/transactions", {
        headers: {
          "x-user-id": user.id,
          "x-user-role": user.role,
        },
      })
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

  const fetchChildrenWallets = async () => {
    try {
      if (!user) return
      
      const response = await fetch("/api/family/children", {
        headers: {
          "x-user-id": user.id,
          "x-user-role": user.role,
        },
      })
      const data = await response.json()

      if (response.ok) {
        setChildrenWallets(data.children || [])
      } else {
        console.error("Error fetching children wallets:", data.error)
      }
    } catch (error) {
      console.error("Error fetching children wallets:", error)
    }
  }

  const fetchConversionRequests = async () => {
    try {
      if (!user) return
      
      const response = await fetch("/api/wallet/convert/requests", {
        headers: {
          "x-user-id": user.id,
          "x-user-role": user.role,
        },
      })
      const data = await response.json()

      if (response.ok) {
        setConversionRequests(data.requests || [])
      } else {
        console.error("Error fetching conversion requests:", data.error)
      }
    } catch (error) {
      console.error("Error fetching conversion requests:", error)
    }
  }

  const checkPinStatus = async () => {
    try {
      if (!user) return
      
      const response = await fetch("/api/wallet/pin/status", {
        headers: {
          "x-user-id": user.id,
          "x-user-role": user.role,
        },
      })
      const data = await response.json()

      if (response.ok && data.hasPin) {
        setParentPin("set") // We don't store the actual PIN
      }
    } catch (error) {
      console.error("Error checking PIN status:", error)
    }
  }

  const handleSetPin = async () => {
    if (newPin.length !== 4 || confirmPin.length !== 4) {
      toast({
        title: "Invalid PIN",
        description: "PIN must be exactly 4 digits",
        variant: "destructive",
      })
      return
    }

    if (newPin !== confirmPin) {
      toast({
        title: "PIN Mismatch",
        description: "PINs do not match",
        variant: "destructive",
      })
      return
    }

    if (!/^\d{4}$/.test(newPin)) {
      toast({
        title: "Invalid PIN",
        description: "PIN must contain only numbers",
        variant: "destructive",
      })
      return
    }

    try {
      if (!user) return
      
      const response = await fetch("/api/wallet/pin/set", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
          "x-user-role": user.role,
        },
        body: JSON.stringify({ pin: newPin, confirmPin: confirmPin }),
      })

      const data = await response.json()

      if (response.ok) {
        setParentPin("set")
        setIsSettingPin(false)
        setNewPin("")
        setConfirmPin("")
        toast({
          title: "PIN Set Successfully",
          description: "Your transfer PIN has been set successfully!",
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to set PIN",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error setting PIN:", error)
      toast({
        title: "Error",
        description: "Failed to set PIN. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handlePinVerification = async () => {
    try {
      if (!user) return
      
      const response = await fetch("/api/wallet/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
          "x-user-role": user.role,
        },
        body: JSON.stringify({ childId: selectedChild, amount, pin: pinForTransfer }),
      })

      const data = await response.json()

      if (response.ok) {
        setShowPinInput(false)
        setPinForTransfer("")
        handleChildTransfer()
      } else {
        toast({
          title: "Incorrect PIN",
          description: "Please enter the correct PIN",
          variant: "destructive",
        })
        setPinForTransfer("")
      }
    } catch (error) {
      console.error("Error verifying PIN:", error)
      toast({
        title: "Error",
        description: "Failed to verify PIN. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleFunding = async () => {
    if (!fundingAmount || Number.parseFloat(fundingAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      })
      return
    }

    setIsProcessing("funding")

    try {
      if (!user) return
      
      const response = await fetch("/api/wallet/fund", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
          "x-user-role": user.role,
        },
        body: JSON.stringify({ amount: Number.parseFloat(fundingAmount) }),
      })

      const data = await response.json()

      if (response.ok) {
        setFundingAmount("")
        await fetchWalletData()
        await fetchTransactions()

        toast({
          title: "Wallet Funded",
          description: `Successfully added ₦${(Number.parseFloat(fundingAmount) || 0).toLocaleString()} to your wallet!`,
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to fund wallet",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error funding wallet:", error)
      toast({
        title: "Error",
        description: "Failed to fund wallet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(null)
    }
  }

  const handleChildTransfer = async () => {
    const amount = Number.parseFloat(transferAmount)
    const child = childrenWallets.find((c) => c.id === selectedChild)

    if (!amount || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      })
      return
    }

    if (!child) {
      toast({
        title: "No Child Selected",
        description: "Please select a child",
        variant: "destructive",
      })
      return
    }

    if (!walletData || amount > walletData.balance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance for this transfer",
        variant: "destructive",
      })
      return
    }

    setIsProcessing("transfer")

    try {
      const response = await fetch("/api/wallet/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          childId: selectedChild,
          amount: amount,
          description: `Direct transfer to ${child.name}`,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setTransferAmount("")
        setSelectedChild("")
        await fetchWalletData()
        await fetchTransactions()
        await fetchChildrenWallets()

        toast({
          title: "Transfer Successful",
          description: `Successfully sent ₦${(amount || 0).toLocaleString()} to ${child?.name || "child"}!`,
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to transfer money",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error transferring money:", error)
      toast({
        title: "Error",
        description: "Failed to transfer money. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(null)
    }
  }

  const initiateTransfer = () => {
    if (!parentPin) {
      setIsSettingPin(true)
      return
    }

    setShowPinInput(true)
  }

  const handleConversionApproval = async (requestId: string, approved: boolean) => {
    const request = conversionRequests.find((r) => r.id === requestId)
    if (!request) return

    const actionType = approved ? `approve-${requestId}` : `reject-${requestId}`
    setIsProcessing(actionType)

    try {
      const response = await fetch(`/api/wallet/convert/approve/${requestId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ approved }),
      })

      const data = await response.json()

      if (response.ok) {
        await fetchWalletData()
        await fetchTransactions()
        await fetchChildrenWallets()
        await fetchConversionRequests()

        toast({
          title: approved ? "Conversion Approved" : "Conversion Rejected",
          description: approved
            ? `Successfully approved ₦${request.nairaAmount} conversion for ${request.childName}!`
            : `Rejected coin conversion request from ${request.childName}`,
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to process conversion request",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error processing conversion:", error)
      toast({
        title: "Error",
        description: "Failed to process conversion request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(null)
    }
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const typeMatch = filterType === "all" || transaction.type === filterType
    const statusMatch = filterStatus === "all" || transaction.status === filterStatus
    return typeMatch && statusMatch
  })

  const getTransactionIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "funding":
        return <ArrowDownLeft className="h-4 w-4 text-green-600" />
      case "child_transfer":
        return <Send className="h-4 w-4 text-blue-600" />
      case "coin_conversion_approval":
        return <Coins className="h-4 w-4 text-purple-600" />
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

  if (loading || !walletData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Family Wallet</h1>
        <p className="text-muted-foreground">Manage family finances and approve coin conversions</p>
      </div>

      {/* Wallet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Available Balance</p>
                <p className="text-3xl font-bold">₦{(walletData?.balance || 0).toLocaleString()}</p>
              </div>
              <Wallet className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Funded</p>
                <p className="text-3xl font-bold">₦{(walletData?.totalFunded || 0).toLocaleString()}</p>
              </div>
              <CreditCard className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Total Spent</p>
                <p className="text-3xl font-bold">₦{(walletData?.totalSpent || 0).toLocaleString()}</p>
              </div>
              <ArrowUpRight className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Pending Approvals</p>
                <p className="text-3xl font-bold">{walletData?.pendingApprovals || 0}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="children">Children's Wallets</TabsTrigger>
          <TabsTrigger value="approvals">Pending Approvals</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fund Wallet */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-green-600" />
                  Fund Wallet
                </CardTitle>
                <CardDescription>Add money to your family wallet</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="fundingAmount">Amount (₦)</Label>
                  <Input
                    id="fundingAmount"
                    type="number"
                    placeholder="Enter amount"
                    value={fundingAmount}
                    onChange={(e) => setFundingAmount(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full"
                      size="lg"
                      disabled={!fundingAmount || Number.parseFloat(fundingAmount) <= 0 || isProcessing === "funding"}
                    >
                      {isProcessing === "funding" ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Fund Wallet
                        </>
                      )}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Funding</DialogTitle>
                      <DialogDescription>
                        You are about to add ₦{(Number.parseFloat(fundingAmount || "0") || 0).toLocaleString()} to your family
                        wallet.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-800">
                          <strong>Note:</strong> This is a demo. In a real application, you would be redirected to a
                          secure payment gateway.
                        </p>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setFundingAmount("")}>
                        Cancel
                      </Button>
                      <Button onClick={handleFunding}>Confirm Funding</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {/* Transfer to Child */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-blue-600" />
                  Transfer to Child
                </CardTitle>
                <CardDescription>Send money directly to a child's wallet</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!parentPin || isSettingPin ? (
                  // Set PIN Interface
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-800 font-medium mb-2">🔒 Secure Transfer Setup</p>
                      <p className="text-sm text-blue-700">
                        Set a 4-digit PIN to secure money transfers to your children.
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="newPin">Create 4-Digit PIN</Label>
                      <Input
                        id="newPin"
                        type="password"
                        placeholder="Enter 4-digit PIN"
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value.slice(0, 4))}
                        className="mt-1 text-center text-lg tracking-widest"
                        maxLength={4}
                      />
                    </div>

                    <div>
                      <Label htmlFor="confirmPin">Confirm PIN</Label>
                      <Input
                        id="confirmPin"
                        type="password"
                        placeholder="Confirm 4-digit PIN"
                        value={confirmPin}
                        onChange={(e) => setConfirmPin(e.target.value.slice(0, 4))}
                        className="mt-1 text-center text-lg tracking-widest"
                        maxLength={4}
                      />
                    </div>

                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleSetPin}
                      disabled={!newPin || !confirmPin || newPin.length !== 4 || confirmPin.length !== 4}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Set Transfer PIN
                    </Button>

                    {parentPin && (
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={() => setIsSettingPin(false)}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                ) : showPinInput ? (
                  // PIN Verification Interface
                  <div className="space-y-4">
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <p className="text-sm text-yellow-800 font-medium mb-2">🔐 Verify Your PIN</p>
                      <p className="text-sm text-yellow-700">
                        Enter your 4-digit PIN to authorize the transfer of ₦
                        {(Number.parseFloat(transferAmount || "0") || 0).toLocaleString()} to{" "}
                        {childrenWallets.find((c) => c.id === selectedChild)?.name}.
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="pinForTransfer">Enter Your PIN</Label>
                      <Input
                        id="pinForTransfer"
                        type="password"
                        placeholder="Enter 4-digit PIN"
                        value={pinForTransfer}
                        onChange={(e) => setPinForTransfer(e.target.value.slice(0, 4))}
                        className="mt-1 text-center text-lg tracking-widest"
                        maxLength={4}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        onClick={handlePinVerification}
                        disabled={pinForTransfer.length !== 4 || isProcessing === "transfer"}
                      >
                        {isProcessing === "transfer" ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Confirm Transfer
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowPinInput(false)
                          setPinForTransfer("")
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Normal Transfer Interface
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Transfer PIN: Set ✅</span>
                      <Button variant="ghost" size="sm" onClick={() => setIsSettingPin(true)} className="text-xs">
                        Change PIN
                      </Button>
                    </div>

                    <div>
                      <Label htmlFor="childSelect">Select Child</Label>
                      <Select value={selectedChild} onValueChange={setSelectedChild}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Choose a child" />
                        </SelectTrigger>
                        <SelectContent>
                          {childrenWallets.map((child) => (
                            <SelectItem key={child.id} value={child.id}>
                              {child.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="transferAmount">Amount (₦)</Label>
                      <Input
                        id="transferAmount"
                        type="number"
                        placeholder="Enter amount"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <Button
                      className="w-full"
                      size="lg"
                      onClick={initiateTransfer}
                      disabled={!transferAmount || !selectedChild || Number.parseFloat(transferAmount) <= 0}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Money (PIN Required)
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="children" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {childrenWallets.map((child) => (
              <Card key={child.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="font-bold text-blue-600">{child.name[0]}</span>
                    </div>
                    {child.name}'s Wallet
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-green-600 font-medium">Balance</p>
                      <p className="text-xl font-bold text-green-800">₦{(child?.balance || 0).toLocaleString()}</p>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-sm text-yellow-600 font-medium">Pending</p>
                      <p className="text-xl font-bold text-yellow-800">₦{(child?.pendingConversions || 0).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-600 font-medium">Total Earned</p>
                    <p className="text-2xl font-bold text-blue-800">₦{(child?.totalEarned || 0).toLocaleString()}</p>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="approvals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Coin Conversion Requests</CardTitle>
              <CardDescription>Review and approve your children's coin conversion requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversionRequests.filter((r) => r.status === "pending").length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Coins className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No pending conversion requests</p>
                  </div>
                ) : (
                  conversionRequests
                    .filter((r) => r.status === "pending")
                    .map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50 border-yellow-200"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-yellow-100 rounded-full">
                            <Coins className="h-5 w-5 text-yellow-600" />
                          </div>
                          <div>
                            <p className="font-medium">{request.childName} wants to convert coins</p>
                            <p className="text-sm text-muted-foreground">
                              {request.coinAmount} coins → ₦{request.nairaAmount} • {formatDate(request.timestamp)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleConversionApproval(request.id, false)}
                            disabled={isProcessing === `reject-${request.id}`}
                          >
                            {isProcessing === `reject-${request.id}` ? "Rejecting..." : "Reject"}
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleConversionApproval(request.id, true)}
                            disabled={isProcessing === `approve-${request.id}`}
                          >
                            {isProcessing === `approve-${request.id}` ? "Approving..." : "Approve"}
                          </Button>
                        </div>
                      </div>
                    ))
                )}
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
                    <SelectItem value="funding">Wallet Funding</SelectItem>
                    <SelectItem value="child_transfer">Child Transfer</SelectItem>
                    <SelectItem value="coin_conversion_approval">Coin Conversion</SelectItem>
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
                            {transaction.childName && (
                              <>
                                <span>•</span>
                                <span>{transaction.childName}</span>
                              </>
                            )}
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
                        <p
                          className={`font-bold ${transaction.type === "funding" ? "text-green-600" : "text-red-600"}`}
                        >
                          {transaction.type === "funding" ? "+" : "-"}₦{transaction.amount}
                        </p>
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
