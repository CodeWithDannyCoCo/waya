"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/contexts/auth-context"
import {
  Home,
  Users,
  CheckSquare,
  Gift,
  Settings,
  LogOut,
  Menu,
  Baby,
  Monitor,
  Wallet,
  GamepadIcon,
  Target,
  TrendingUp,
  DollarSign,
} from "lucide-react"

const parentNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard/parent",
    icon: Home,
  },
  {
    title: "Family",
    href: "/dashboard/parent/kids",
    icon: Users,
  },
  {
    title: "Chores",
    href: "/dashboard/parent/chores",
    icon: CheckSquare,
  },
  {
    title: "Monitor",
    href: "/dashboard/parent/monitor",
    icon: Monitor,
  },
  {
    title: "Wallet",
    href: "/dashboard/parent/wallet",
    icon: Wallet,
  },
  {
    title: "Settings",
    href: "/dashboard/parent/settings",
    icon: Settings,
  },
]

const childNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard/child",
    icon: Home,
  },
  {
    title: "My Chores",
    href: "/dashboard/child/chores",
    icon: CheckSquare,
  },
  {
    title: "Rewards",
    href: "/dashboard/child/rewards",
    icon: Gift,
  },
  {
    title: "Wallet",
    href: "/dashboard/child/wallet",
    icon: Wallet,
  },
  {
    title: "Money Maze",
    href: "/dashboard/child/moneymaze",
    icon: GamepadIcon,
  },
  {
    title: "Goal Better",
    href: "/dashboard/child/goalbetter",
    icon: Target,
  },
  {
    title: "Budget Battle",
    href: "/dashboard/child/budgetbattle",
    icon: TrendingUp,
  },
  {
    title: "Earning Meter",
    href: "/dashboard/child/earningmeter",
    icon: DollarSign,
  },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)

  const navItems = user?.role === "parent" ? parentNavItems : childNavItems

  const handleLogout = async () => {
    try {
      console.log("Sidebar: Initiating logout...")
      await logout()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href={`/dashboard/${user?.role || "parent"}`} className="flex items-center gap-2 font-semibold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            CQ
          </div>
          ChoreQuest
        </Link>
      </div>

      {/* User Info */}
      <div className="border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            {user?.role === "parent" ? <Users className="h-5 w-5" /> : <Baby className="h-5 w-5" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name || "User"}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role || "parent"}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            )
          })}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-40">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className={cn("hidden md:flex h-screen w-64 flex-col border-r bg-background", className)}>
        <SidebarContent />
      </div>
    </>
  )
}
