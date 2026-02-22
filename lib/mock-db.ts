// Mock database for demo purposes
export interface User {
  id: string
  name: string
  email?: string
  role: "parent" | "child"
  parentId?: string
  image?: string
  totalCoins?: number
  totalXp?: number
  level?: number
  streakDays?: number
  password?: string
}

export interface Chore {
  id: string
  title: string
  description: string
  difficulty: "easy" | "medium" | "hard"
  reward: number
  xp: number
  status: "pending" | "completed" | "overdue" | "approved"
  dueDate?: string
  assignedTo: {
    id: string
    name: string
    avatar: string
  }
  createdAt: string
  completedAt?: string
  approvedAt?: string
}

export interface Reward {
  id: string
  title: string
  description: string
  cost: number
  image: string
  status: "available" | "redeemed"
  redeemedAt?: string
}

// Mock users
export const mockUsers: User[] = [
  {
    id: "1",
    name: "Demo Parent",
    email: "parent@example.com",
    role: "parent",
    image: "/placeholder.svg?height=40&width=40",
    password: "password123",
  },
  {
    id: "2",
    name: "Alex",
    role: "child",
    parentId: "1",
    image: "/placeholder.svg?height=40&width=40",
    totalCoins: 150,
    totalXp: 320,
    level: 3,
    streakDays: 5,
    password: "alex123",
  },
  {
    id: "3",
    name: "Jamie",
    role: "child",
    parentId: "1",
    image: "/placeholder.svg?height=40&width=40",
    totalCoins: 89,
    totalXp: 180,
    level: 2,
    streakDays: 2,
    password: "jamie123",
  },
]

// Mock chores
export const mockChores: Chore[] = [
  {
    id: "1",
    title: "Clean your room",
    description: "Make bed, organize toys, vacuum floor",
    difficulty: "medium",
    reward: 25,
    xp: 50,
    status: "pending",
    dueDate: "Today",
    assignedTo: {
      id: "2",
      name: "Alex",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    title: "Take out trash",
    description: "Empty all wastebaskets and take to curb",
    difficulty: "easy",
    reward: 15,
    xp: 25,
    status: "completed",
    dueDate: "Yesterday",
    assignedTo: {
      id: "3",
      name: "Jamie",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2024-01-14T09:00:00Z",
    completedAt: "2024-01-14T18:30:00Z",
  },
  {
    id: "3",
    title: "Load dishwasher",
    description: "Load dirty dishes and start cycle",
    difficulty: "easy",
    reward: 10,
    xp: 20,
    status: "approved",
    dueDate: "Tomorrow",
    assignedTo: {
      id: "2",
      name: "Alex",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2024-01-13T08:00:00Z",
    completedAt: "2024-01-13T19:00:00Z",
    approvedAt: "2024-01-13T20:00:00Z",
  },
]

// Mock rewards
export const mockRewards: Reward[] = [
  {
    id: "1",
    title: "Extra Screen Time",
    description: "30 minutes of extra screen time",
    cost: 50,
    image: "/placeholder.svg?height=100&width=100&text=Screen",
    status: "available",
  },
  {
    id: "2",
    title: "Choose Dinner",
    description: "Pick what the family has for dinner",
    cost: 75,
    image: "/placeholder.svg?height=100&width=100&text=Dinner",
    status: "available",
  },
  {
    id: "3",
    title: "Movie Night Pick",
    description: "Choose the movie for family movie night",
    cost: 100,
    image: "/placeholder.svg?height=100&width=100&text=Movie",
    status: "redeemed",
    redeemedAt: "2024-01-10T20:00:00Z",
  },
]

// Mock database functions
export const mockDb = {
  // User functions
  getUserByEmail: (email: string): User | null => {
    return mockUsers.find((user) => user.email === email) || null
  },

  getUserByName: (name: string): User | null => {
    return mockUsers.find((user) => user.name === name && user.role === "child") || null
  },

  getUserById: (id: string): User | null => {
    return mockUsers.find((user) => user.id === id) || null
  },

  getChildrenByParentId: (parentId: string): User[] => {
    return mockUsers.filter((user) => user.parentId === parentId && user.role === "child")
  },

  // Chore functions
  getChoresByUserId: (userId: string, status?: string): Chore[] => {
    let chores = mockChores.filter((chore) => chore.assignedTo.id === userId)
    if (status) {
      chores = chores.filter((chore) => chore.status === status)
    }
    return chores
  },

  getChoresByParentId: (parentId: string, status?: string): Chore[] => {
    // Get all children of this parent
    const children = mockDb.getChildrenByParentId(parentId)
    const childIds = children.map((child) => child.id)

    let chores = mockChores.filter((chore) => childIds.includes(chore.assignedTo.id))
    if (status) {
      chores = chores.filter((chore) => chore.status === status)
    }
    return chores
  },

  // Reward functions
  getRewardsByUserId: (userId: string): Reward[] => {
    return mockRewards
  },

  getRewardsByParentId: (parentId: string): Reward[] => {
    return mockRewards
  },
}
