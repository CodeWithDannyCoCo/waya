"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, CheckCircle, AlertCircle, Gift, Coins, Trophy, Clock, User, Trash2 } from "lucide-react"

interface Notification {
  id: string
  type: "chore_completion" | "coin_request" | "achievement" | "system" | "new_chore" | "reward_approved"
  title: string
  message: string
  timestamp: string
  isRead: boolean
  isUrgent?: boolean
  childName?: string
}

interface NotificationsPanelProps {
  isOpen: boolean
  onClose: () => void
  userRole: "parent" | "child"
}

const mockParentNotifications: Notification[] = [
  {
    id: "1",
    type: "chore_completion",
    title: "Chore Completed",
    message: "Alex has completed 'Clean bedroom' and is waiting for approval",
    timestamp: "2 minutes ago",
    isRead: false,
    isUrgent: true,
    childName: "Alex",
  },
  {
    id: "2",
    type: "coin_request",
    title: "Coin Conversion Request",
    message: "Jamie wants to convert 50 coins to ₦250",
    timestamp: "5 minutes ago",
    isRead: false,
    isUrgent: true,
    childName: "Jamie",
  },
  {
    id: "3",
    type: "achievement",
    title: "Achievement Unlocked",
    message: "Alex earned the 'Week Warrior' badge for completing all chores this week",
    timestamp: "1 hour ago",
    isRead: true,
    childName: "Alex",
  },
  {
    id: "4",
    type: "system",
    title: "Weekly Report Ready",
    message: "Your family's weekly progress report is now available",
    timestamp: "2 hours ago",
    isRead: true,
  },
]

const mockChildNotifications: Notification[] = [
  {
    id: "1",
    type: "new_chore",
    title: "New Chore Assigned",
    message: "You have a new chore: 'Take out trash' - Due tomorrow",
    timestamp: "10 minutes ago",
    isRead: false,
    isUrgent: true,
  },
  {
    id: "2",
    type: "reward_approved",
    title: "Reward Approved!",
    message: "Your request for 'Extra screen time' has been approved",
    timestamp: "30 minutes ago",
    isRead: false,
  },
  {
    id: "3",
    type: "coin_request",
    title: "Coins Converted",
    message: "Your 25 coins have been converted to ₦125 in your wallet",
    timestamp: "1 hour ago",
    isRead: true,
  },
  {
    id: "4",
    type: "achievement",
    title: "Level Up!",
    message: "Congratulations! You've reached Level 5",
    timestamp: "2 hours ago",
    isRead: true,
  },
]

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "chore_completion":
    case "new_chore":
      return <CheckCircle className="h-4 w-4" />
    case "coin_request":
      return <Coins className="h-4 w-4" />
    case "achievement":
      return <Trophy className="h-4 w-4" />
    case "reward_approved":
      return <Gift className="h-4 w-4" />
    case "system":
      return <AlertCircle className="h-4 w-4" />
    default:
      return <AlertCircle className="h-4 w-4" />
  }
}

const getNotificationColor = (type: string, isUrgent?: boolean) => {
  if (isUrgent) return "text-red-500"

  switch (type) {
    case "chore_completion":
    case "new_chore":
      return "text-blue-500"
    case "coin_request":
      return "text-yellow-500"
    case "achievement":
      return "text-purple-500"
    case "reward_approved":
      return "text-green-500"
    case "system":
      return "text-gray-500"
    default:
      return "text-gray-500"
  }
}

export function NotificationsPanel({ isOpen, onClose, userRole }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>(
    userRole === "parent" ? mockParentNotifications : mockChildNotifications,
  )

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
    )
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4">
      <div className="fixed inset-0 bg-black/20" onClick={onClose} />
      <Card className="relative w-96 max-h-[80vh] bg-white dark:bg-gray-800 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="h-5 w-5 p-0 text-xs">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
                Mark all read
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[60vh]">
            <div className="space-y-1 p-4">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                      notification.isRead
                        ? "bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"
                        : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700"
                    } ${notification.isUrgent ? "ring-2 ring-red-200 dark:ring-red-800" : ""}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 ${getNotificationColor(notification.type, notification.isUrgent)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                              {notification.title}
                              {notification.isUrgent && (
                                <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                  Urgent
                                </span>
                              )}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>{notification.timestamp}</span>
                              {notification.childName && (
                                <>
                                  <span>•</span>
                                  <User className="h-3 w-3" />
                                  <span>{notification.childName}</span>
                                </>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-gray-400 hover:text-red-500"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeNotification(notification.id)
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
