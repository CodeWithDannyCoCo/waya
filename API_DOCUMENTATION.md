# ChoreQuest API Documentation

This document provides detailed information about all API endpoints, including request/response bodies, status codes, and error handling.

## Base URL
\`\`\`
https://api.chorequest.com/v1
\`\`\`

## Authentication
Most endpoints require user identification via headers:
\`\`\`
x-user-id: <user_id>
x-user-role: parent|child
\`\`\`

Login endpoints return a user object that can be stored and used for subsequent requests.

## Common Response Format
All API responses follow this structure:
\`\`\`json
{
  "success": boolean,
  "data": object | array,
  "message": string,
  "errors": array,
  "timestamp": string
}
\`\`\`

---

## Authentication Endpoints

### POST /api/auth/callback/parent-login/
Authenticate a parent user

**Request Body:**
\`\`\`json
{
  "email": "parent@example.com",
  "password": "password123"
}
\`\`\`

**Success Response (200):**
\`\`\`json
{
  "success": true,
  "user": {
    "id": "uuid",
    "name": "Parent Name",
    "email": "parent@example.com",
    "role": "parent"
  }
}
\`\`\`

### POST /api/auth/callback/child-login/
Authenticate a child user

**Request Body:**
\`\`\`json
{
  "username": "alex_smith",
  "pin": "1234"
}
\`\`\`

**Success Response (200):**
\`\`\`json
{
  "success": true,
  "user": {
    "id": "uuid",
    "name": "Alex Smith",
    "username": "alex_smith",
    "role": "child",
    "parent_id": "parent_uuid"
  }
}
\`\`\`

### POST /api/auth/register/
Register a new parent user

**Request Body:**
\`\`\`json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "securePassword123"
}
\`\`\`

**Success Response (201):**
\`\`\`json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-789",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "parent",
      "image": null,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  },
  "message": "User created successfully"
}
\`\`\`

**Error Response (409):**
\`\`\`json
{
  "success": false,
  "data": null,
  "message": "User already exists",
  "errors": ["A user with this email already exists"],
  "timestamp": "2024-01-15T10:30:00Z"
}
\`\`\`

### POST /api/auth/logout/
Logout the current user

**Request Body:** None

**Success Response (200):**
\`\`\`json
{
  "success": true,
  "data": null,
  "message": "Logout successful"
}
\`\`\`

### GET /api/auth/me/
Get the current user's profile

**Request Body:** None

**Success Response (200):**
\`\`\`json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-123",
      "name": "John Doe",
      "email": "parent@example.com",
      "role": "parent",
      "image": "https://example.com/avatar.jpg",
      "createdAt": "2024-01-01T00:00:00Z",
      "lastLoginAt": "2024-01-15T10:30:00Z"
    }
  },
  "message": "User profile retrieved"
}
\`\`\`

**Error Response (401):**
\`\`\`json
{
  "success": false,
  "data": null,
  "message": "Unauthorized",
  "errors": ["Invalid or expired token"],
  "timestamp": "2024-01-15T10:30:00Z"
}
\`\`\`

---

## Wallet Management Endpoints

### GET /api/wallet/balance/
Get wallet balance for current user

**Headers Required:**
- `x-user-id`: User ID
- `x-user-role`: User role (parent|child)

**Request Body:** None

**Success Response (200):**
\`\`\`json
{
  "success": true,
  "balance": {
    "coins": 150,
    "realMoney": 5000.00,
    "conversionRate": 100
  }
}
\`\`\`

**Error Response (401):**
\`\`\`json
{
  "success": false,
  "error": "Unauthorized"
}
\`\`\`

### POST /api/wallet/fund/
Add funds to parent wallet

**Headers Required:**
- `x-user-id`: User ID
- `x-user-role`: parent

**Request Body:**
\`\`\`json
{
  "amount": 1000.00,
  "paymentMethod": "card"
}
\`\`\`

**Success Response (200):**
\`\`\`json
{
  "success": true,
  "newBalance": 2500.00,
  "transaction": {
    "id": "uuid",
    "amount": 1000.00,
    "type": "funding",
    "status": "completed"
  }
}
\`\`\`

### POST /api/wallet/transfer/
Transfer money from parent to child

**Headers Required:**
- `x-user-id`: Parent user ID
- `x-user-role`: parent

**Request Body:**
\`\`\`json
{
  "childId": "child_uuid",
  "amount": 250.00,
  "pin": "1234",
  "note": "Weekly allowance"
}
\`\`\`

**Success Response (200):**
\`\`\`json
{
  "success": true,
  "transaction": {
    "id": "uuid",
    "amount": 250.00,
    "type": "transfer"
  },
  "parentBalance": 1750.00,
  "childBalance": 500.00
}
\`\`\`

### POST /api/wallet/pin/set/
Set wallet PIN for parent

**Headers Required:**
- `x-user-id`: User ID
- `x-user-role`: parent

**Request Body:**
\`\`\`json
{
  "pin": "1234",
  "confirmPin": "1234"
}
\`\`\`

**Success Response (200):**
\`\`\`json
{
  "success": true,
  "message": "PIN set successfully"
}
\`\`\`

### GET /api/wallet/pin/status/
Check if user has set a wallet PIN

**Headers Required:**
- `x-user-id`: User ID
- `x-user-role`: parent

**Request Body:** None

**Success Response (200):**
\`\`\`json
{
  "hasPin": true
}
\`\`\`

### GET /api/wallet/transactions/
Get wallet transaction history

**Headers Required:**
- `x-user-id`: User ID

**Query Parameters:**
- `type`: all|funding|transfer|conversion
- `limit`: number (default: 20)
- `offset`: number (default: 0)

**Request Body:** None

**Success Response (200):**
\`\`\`json
{
  "success": true,
  "transactions": [
    {
      "id": "txn-124",
      "type": "transfer",
      "amount": 1000.00,
      "description": "Transfer to Alex",
      "status": "completed",
      "createdAt": "2024-01-15T20:35:00Z"
    }
  ]
}
\`\`\`

---

## PIN Management Endpoints

### POST /api/wallet/pin/change/
Change existing wallet PIN

**Request Body:**
\`\`\`json
{
  "currentPin": "1234",
  "newPin": "5678"
}
\`\`\`

**Success Response (200):**
\`\`\`json
{
  "success": true,
  "message": "PIN changed successfully"
}
\`\`\`

### POST /api/wallet/pin/verify/
Verify wallet PIN

**Request Body:**
\`\`\`json
{
  "pin": "1234"
}
\`\`\`

**Success Response (200):**
\`\`\`json
{
  "success": true,
  "data": {
    "valid": true
  },
  "message": "PIN verified"
}
\`\`\`

---

## Coin Conversion Endpoints

### POST /api/wallet/convert/request/
Request coin to money conversion (child)

**Headers Required:**
- `x-user-id`: Child user ID
- `x-user-role`: child

**Request Body:**
\`\`\`json
{
  "coinAmount": 50,
  "note": "Saving for new toy"
}
\`\`\`

**Success Response (200):**
\`\`\`json
{
  "success": true,
  "request": {
    "id": "uuid",
    "coinAmount": 50,
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
\`\`\`

### GET /api/wallet/convert/requests/
Get pending conversion requests (parent)

**Headers Required:**
- `x-user-id`: Parent user ID
- `x-user-role`: parent

**Request Body:** None

**Success Response (200):**
\`\`\`json
{
  "success": true,
  "requests": []
}
\`\`\`

### POST /api/wallet/convert/approve/
Approve coin conversion request

**Headers Required:**
- `x-user-id`: Parent user ID
- `x-user-role`: parent

**Request Body:**
\`\`\`json
{
  "requestId": "uuid",
  "action": "approve",
  "pin": "1234",
  "reason": "Good job saving!"
}
\`\`\`

**Success Response (200):**
\`\`\`json
{
  "success": true,
  "message": "Conversion request approved"
}
\`\`\`

---

## Family Management Endpoints

### GET /api/family/children/
Get all children for the current parent

**Request Body:** None

**Success Response (200):**
\`\`\`json
{
  "success": true,
  "data": {
    "children": [
      {
        "id": "uuid-456",
        "name": "Alex",
        "username": "alex",
        "role": "child",
        "parentId": "uuid-123",
        "image": "https://example.com/child1.jpg",
        "totalCoins": 150,
        "totalXp": 1250,
        "level": 3,
        "streakDays": 7,
        "walletBalance": 1000.00,
        "createdAt": "2024-01-01T00:00:00Z"
      },
      {
        "id": "uuid-789",
        "name": "Jamie",
        "username": "jamie",
        "role": "child",
        "parentId": "uuid-123",
        "image": "https://example.com/child2.jpg",
        "totalCoins": 200,
        "totalXp": 1800,
        "level": 4,
        "streakDays": 12,
        "walletBalance": 750.00,
        "createdAt": "2024-01-02T00:00:00Z"
      }
    ]
  },
  "message": "Children retrieved successfully"
}
\`\`\`

### POST /api/family/children/
Create a new child account

**Request Body:**
\`\`\`json
{
  "name": "Emma",
  "password": "emma123",
  "image": "https://example.com/emma-avatar.jpg"
}
\`\`\`

**Success Response (201):**
\`\`\`json
{
  "success": true,
  "data": {
    "child": {
      "id": "uuid-101",
      "name": "Emma",
      "username": "emma",
      "role": "child",
      "parentId": "uuid-123",
      "image": "https://example.com/emma-avatar.jpg",
      "totalCoins": 0,
      "totalXp": 0,
      "level": 1,
      "streakDays": 0,
      "walletBalance": 0.00,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  },
  "message": "Child account created successfully"
}
\`\`\`

### DELETE /api/family/children/{id}/
Delete a child account

**Request Body:** None

**Success Response (200):**
\`\`\`json
{
  "success": true,
  "data": null,
  "message": "Child account deleted successfully"
}
\`\`\`

## User Management Endpoints

### GET /api/users/{id}/
Get user profile by ID

**Headers Required:**
- `x-user-id`: Current user ID

**URL Parameters:**
- `id`: User ID to retrieve

**Request Body:** None

**Success Response (200):**
\`\`\`json
{
  "success": true,
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "parent",
    "coins": 150,
    "walletBalance": 5000.00,
    "streak": 7,
    "level": 3,
    "xp": 1250,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
\`\`\`

**Error Response (404):**
\`\`\`json
{
  "success": false,
  "error": "User not found"
}
\`\`\`

---

## Activity Monitoring Endpoints

### GET /api/activity/
Get family activity feed

**Query Parameters:**
- `childId`: string (optional)
- `type`: all|chores|rewards|games
- `limit`: number (default: 20)
- `offset`: number (default: 0)

**Request Body:** None

**Success Response (200):**
\`\`\`json
{
  "success": true,
  "data": {
    "activities": [
      {
        "id": "activity-123",
        "type": "chore_completed",
        "title": "Chore Completed",
        "description": "Alex completed 'Clean bedroom'",
        "childId": "uuid-456",
        "childName": "Alex",
        "status": "pending",
        "points": 50,
        "timestamp": "2024-01-15T20:00:00Z",
        "relatedId": "chore-123"
      },
      {
        "id": "activity-124",
        "type": "game_played",
        "title": "Game Completed",
        "description": "Jamie finished Money Maze Level 3",
        "childId": "uuid-789",
        "childName": "Jamie",
        "status": "completed",
        "points": 75,
        "timestamp": "2024-01-15T19:45:00Z",
        "relatedId": "game-session-456"
      }
    ],
    "total": 15,
    "hasMore": true
  },
  "message": "Activities retrieved successfully"
}
\`\`\`

### POST /api/activity/approve/{id}/
Approve a pending activity

**Request Body:**
\`\`\`json
{
  "bonus": 10,
  "feedback": "Great job! Extra points for doing it without being asked."
}
\`\`\`

**Success Response (200):**
\`\`\`json
{
  "success": true,
  "data": {
    "activity": {
      "id": "activity-123",
      "type": "chore_completed",
      "title": "Chore Completed",
      "description": "Alex completed 'Clean bedroom'",
      "childId": "uuid-456",
      "childName": "Alex",
      "status": "approved",
      "points": 50,
      "bonus": 10,
      "feedback": "Great job! Extra points for doing it without being asked.",
      "timestamp": "2024-01-15T20:00:00Z",
      "approvedAt": "2024-01-15T21:10:00Z"
    },
    "coinsAwarded": 60
  },
  "message": "Activity approved successfully"
}
\`\`\`

### GET /api/activity/stats/
Get activity statistics

**Query Parameters:**
- `period`: daily|weekly|monthly
- `childId`: string (optional)

**Request Body:** None

**Success Response (200):**
\`\`\`json
{
  "success": true,
  "data": {
    "totalActivities": 45,
    "completedActivities": 38,
    "pendingActivities": 7,
    "averageScore": 82.5,
    "topPerformer": {
      "childId": "uuid-456",
      "childName": "Alex",
      "score": 95.2
    }
  },
  "message": "Activity statistics retrieved"
}
\`\`\`

---

## Notifications Endpoints

### GET /api/notifications/
Get user notifications

**Headers Required:**
- `x-user-id`: User ID

**Query Parameters:**
- `limit` (optional): Number of notifications to return (default: 20)

**Request Body:** None

**Success Response (200):**
\`\`\`json
{
  "success": true,
  "notifications": [
    {
      "id": "uuid",
      "title": "Chore Completed",
      "message": "Alex completed 'Clean your room'",
      "type": "chore_completed",
      "read": false,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
\`\`\`

### PUT /api/notifications/{id}/read/
Mark a notification as read

**Headers Required:**
- `x-user-id`: User ID

**URL Parameters:**
- `id`: Notification ID

**Request Body:** None

**Success Response (200):**
\`\`\`json
{
  "success": true,
  "message": "Notification marked as read"
}
\`\`\`

### DELETE /api/notifications/{id}/
Delete a notification

**Headers Required:**
- `x-user-id`: User ID

**URL Parameters:**
- `id`: Notification ID

**Request Body:** None

**Success Response (200):**
\`\`\`json
{
  "success": true,
  "message": "Notification deleted"
}
\`\`\`

---

## Chores Management Endpoints

### GET /api/mock/chores/
Get chores based on user role

**Request Body:** None

**Success Response (200):**
\`\`\`json
{
  "success": true,
  "chores": [
    {
      "id": "uuid",
      "title": "Clean your room",
      "description": "Make bed and organize toys",
      "difficulty": "easy",
      "coins": 10,
      "xp": 15,
      "status": "pending",
      "due_date": "2024-01-16",
      "assigned_to": "child_uuid",
      "created_by": "parent_uuid"
    }
  ]
}
\`\`\`

### POST /api/mock/chores/
Create a new chore (parent only)

**Request Body:**
\`\`\`json
{
  "title": "Do the dishes",
  "description": "Wash and dry all dishes",
  "difficulty": "medium",
  "coins": 20,
  "xp": 25,
  "assignedTo": "child_uuid",
  "dueDate": "2024-01-17"
}
\`\`\`

**Success Response (201):**
\`\`\`json
{
  "success": true,
  "data": {
    "chore": {
      "id": "uuid",
      "title": "Do the dishes",
      "description": "Wash and dry all dishes",
      "difficulty": "medium",
      "coins": 20,
      "xp": 25,
      "status": "pending",
      "due_date": "2024-01-17",
      "assigned_to": "child_uuid",
      "created_by": "parent_uuid",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  },
  "message": "Chore created successfully"
}
\`\`\`

### POST /api/chores/{id}/complete/
Mark a chore as completed

**Request Body:**
\`\`\`json
{
  "notes": "Completed all tasks as requested",
  "completedAt": "2024-01-15T19:45:00Z"
}
\`\`\`

**Success Response (200):**
\`\`\`json
{
  "success": true,
  "data": {
    "chore": {
      "id": "chore-123",
      "title": "Clean bedroom",
      "status": "completed",
      "completedAt": "2024-01-15T19:45:00Z",
      "notes": "Completed all tasks as requested"
    },
    "coinsEarned": 0
  },
  "message": "Chore marked as completed"
}
\`\`\`

### POST /api/chores/{id}/approve/
Approve a completed chore

**Request Body:**
\`\`\`json
{
  "bonus": 10,
  "feedback": "Great job! Extra points for doing it without being asked."
}
\`\`\`

**Success Response (200):**
\`\`\`json
{
  "success": true,
  "data": {
    "chore": {
      "id": "chore-123",
      "status": "approved",
      "approvedAt": "2024-01-15T20:00:00Z",
      "bonus": 10,
      "feedback": "Great job! Extra points for doing it without being asked."
    },
    "totalCoinsAwarded": 60
  },
  "message": "Chore approved successfully"
}
\`\`\`

---

## Rewards Management Endpoints

### GET /api/mock/rewards/
Get available rewards

**Request Body:** None

**Success Response (200):**
\`\`\`json
{
  "success": true,
  "rewards": [
    {
      "id": "uuid",
      "title": "Extra Screen Time",
      "description": "30 minutes extra screen time",
      "cost": 25,
      "status": "available",
      "image": "/rewards/screen-time.png"
    }
  ]
}
\`\`\`

### PUT /api/rewards/[id]/redeem/
Redeem a reward using coins

**Request Body:** None

**Success Response (200):**
\`\`\`json
{
  "success": true,
  "message": "Reward redeemed successfully",
  "remainingCoins": 45
}
\`\`\`

---

## Error Responses

All endpoints return consistent error responses:

\`\`\`json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
\`\`\`

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error
\`\`\`

---

## Data Models

### User Model
\`\`\`typescript
interface User {
  id: string
  name: string
  email?: string // Only for parents
  username?: string // Only for children
  role: 'parent' | 'child'
  parentId?: string // Only for children
  image?: string
  totalCoins?: number // Only for children
  totalXp?: number // Only for children
  level?: number // Only for children
  streakDays?: number // Only for children
  walletBalance?: number // Money balance
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
}
\`\`\`

### Transaction Model
\`\`\`typescript
interface Transaction {
  id: string
  type: 'funding' | 'transfer' | 'conversion' | 'earned' | 'spent'
  amount: number
  coinAmount?: number // For coin conversions
  description: string
  status: 'pending' | 'completed' | 'failed'
  fromUserId?: string
  toUserId?: string
  relatedId?: string
  createdAt: string
}
\`\`\`

### ConversionRequest Model
\`\`\`typescript
interface ConversionRequest {
  id: string
  childId: string
  childName: string
  coinAmount: number
  moneyAmount: number
  conversionRate: number
  status: 'pending' | 'approved' | 'rejected'
  note?: string
  reason?: string // For rejection
  createdAt: string
  processedAt?: string
}
\`\`\`

### Activity Model
\`\`\`typescript
interface Activity {
  id: string
  type: 'chore_completed' | 'game_played' | 'reward_redeemed' | 'achievement_earned'
  title: string
  description: string
  childId: string
  childName: string
  status: 'pending' | 'approved' | 'completed'
  points: number
  bonus?: number
  feedback?: string
  timestamp: string
  approvedAt?: string
  relatedId?: string
}
\`\`\`

### Notification Model
\`\`\`typescript
interface Notification {
  id: string
  title: string
  message: string
  type: 'chore_completed' | 'coin_conversion' | 'achievement' | 'system' | 'reminder'
  urgent: boolean
  read: boolean
  userId: string
  relatedId?: string
  createdAt: string
  readAt?: string
}
\`\`\`

### Chore Model
\`\`\`typescript
interface Chore {
  id: string
  title: string
  description: string
  difficulty: string
  coins: number
  xp: number
  status: 'pending' | 'completed' | 'approved'
  dueDate: string
  assignedTo: string
  createdBy: string
  createdAt: string
  completedAt?: string
  approvedAt?: string
}
\`\`\`

### Reward Model
\`\`\`typescript
interface Reward {
  id: string
  title: string
  description: string
  cost: number
  status: 'available' | 'redeemed'
  image: string
}
