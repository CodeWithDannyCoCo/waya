# ChoreQuest API Endpoints

This document lists all the API endpoints available in the ChoreQuest application.

## Headers
Most endpoints require the following headers for authentication:
- `x-user-id`: The user's unique identifier
- `x-user-role`: The user's role (parent or child)

## Authentication Endpoints

### Parent Authentication

- **POST /api/auth/callback/parent-login/**
  - Description: Authenticate a parent user with email and password
  - Request Body: `{ email: string, password: string }`
  - Response: `{ success: boolean, user: User, message?: string }`
  - Status Codes: 200 (Success), 401 (Invalid credentials), 500 (Server error)
  - Headers: None required

### Child Authentication

- **POST /api/auth/callback/child-login/**
  - Description: Authenticate a child user with name and PIN
  - Request Body: `{ childName: string, pin: string }`
  - Response: `{ success: boolean, user: User, message?: string }`
  - Status Codes: 200 (Success), 401 (Invalid credentials), 500 (Server error)
  - Headers: None required

### User Registration

- **POST /api/auth/signup/**
  - Description: Register a new parent user
  - Request Body: `{ name: string, email: string, password: string }`
  - Response: `{ message: string, user: User }`
  - Status Codes: 201 (Created), 400 (Validation error)
  - Headers: None required

### Child Registration

- **POST /api/family/children/**
  - Description: Create a new child account (parent only)
  - Request Body: `{ name: string, password: string, image?: string }`
  - Response: `{ success: boolean, child: User }`
  - Status Codes: 201 (Created), 400 (Validation error), 401 (Unauthorized)
  - Headers: `x-user-id`, `x-user-role` (parent)

## Family Management Endpoints

### Children Management

- **GET /api/family/children/**
  - Description: Get all children for the current parent
  - Request Body: None
  - Response: `{ success: boolean, children: User[] }`
  - Status Codes: 200 (Success), 401 (Unauthorized)
  - Headers: `x-user-id`, `x-user-role` (parent)

- **GET /api/family/children/{id}/**
  - Description: Get a specific child by ID
  - Request Body: None
  - Response: `{ success: boolean, child: User }`
  - Status Codes: 200 (Success), 404 (Not found), 401 (Unauthorized)
  - Headers: `x-user-id`, `x-user-role` (parent)

- **DELETE /api/family/children/{id}/**
  - Description: Delete a child account
  - Request Body: None
  - Response: `{ success: boolean, message: string }`
  - Status Codes: 200 (Success), 404 (Not found), 401 (Unauthorized)
  - Headers: `x-user-id`, `x-user-role` (parent)

## Chores Management Endpoints

### Chores

- **GET /api/chores/**
  - Description: Get all chores for the current user
  - Query Parameters: `?userId=string&status=pending|completed|approved&limit=20&offset=0`
  - Request Body: None
  - Response: `{ success: boolean, chores: Chore[], total: number, hasMore: boolean }`
  - Status Codes: 200 (Success), 400 (Missing userId), 401 (Unauthorized)
  - Headers: None required for query, but context should provide userId

- **POST /api/chores/route.ts**
  - Description: Create a new chore (parent only)
  - Request Body: `{ title: string, description: string, points: number, assignedTo: string, dueDate?: string, recurring?: boolean, recurringType?: 'daily'|'weekly'|'monthly' }`
  - Response: `{ success: boolean, chore: Chore }`
  - Status Codes: 201 (Created), 400 (Validation error), 401 (Unauthorized)
  - Headers: `x-user-id`, `x-user-role` (parent)

- **POST /api/chores/{id}/complete/**
  - Description: Mark a chore as completed (child)
  - Request Body: `{ notes?: string, completedAt?: string }`
  - Response: `{ success: boolean, chore: Chore, coinsEarned: number }`
  - Status Codes: 200 (Success), 404 (Not found), 400 (Already completed), 401 (Unauthorized)
  - Headers: `x-user-id`, `x-user-role` (child)

- **POST /api/chores/{id}/approve/**
  - Description: Approve a completed chore (parent)
  - Request Body: `{ bonus?: number, feedback?: string }`
  - Response: `{ success: boolean, chore: Chore, totalCoinsAwarded: number }`
  - Status Codes: 200 (Success), 404 (Not found), 400 (Not completed), 401 (Unauthorized)
  - Headers: `x-user-id`, `x-user-role` (parent)

## Rewards Management Endpoints

### Rewards

- **GET /api/mock/rewards/**
  - Description: Get all rewards for the current user
  - Query Parameters: `?status=available|redeemed&childId=string&limit=number&offset=number`
  - Request Body: None
  - Response: `{ rewards: Reward[], total: number, hasMore: boolean }`
  - Status Codes: 200 (Success), 401 (Unauthorized)

- **POST /api/mock/rewards/**
  - Description: Create a new reward
  - Request Body: `{ title: string, description: string, cost: number, assignedTo: string, image?: string, category?: string }`
  - Response: `{ reward: Reward }`
  - Status Codes: 201 (Created), 400 (Validation error)

- **PUT /api/rewards/{id}/redeem/**
  - Description: Redeem a reward
  - Request Body: None
  - Response: `{ message: string, reward: Reward, remainingCoins: number }`
  - Status Codes: 200 (Success), 404 (Not found), 400 (Insufficient coins)

## Wallet Management Endpoints

### Wallet Balance

- **GET /api/wallet/balance/**
  - Description: Get current wallet balance (coins and money)
  - Request Body: None
  - Response: `{ success: boolean, balance: { coins: number, realMoney: number, conversionRate: number } }`
  - Status Codes: 200 (Success), 401 (Unauthorized), 500 (Server error)
  - Headers: `x-user-id`, `x-user-role`

### Wallet Operations

- **POST /api/wallet/fund/**
  - Description: Add money to parent wallet
  - Request Body: `{ amount: number, paymentMethod: string }`
  - Response: `{ success: boolean, newBalance: number, transaction: Transaction }`
  - Status Codes: 200 (Success), 400 (Invalid amount), 401 (Unauthorized), 500 (Server error)
  - Headers: `x-user-id`, `x-user-role` (parent)

- **POST /api/wallet/transfer/**
  - Description: Transfer money from parent to child
  - Request Body: `{ childId: string, amount: number, pin: string, note?: string }`
  - Response: `{ success: boolean, transaction: Transaction, parentBalance: number, childBalance: number }`
  - Status Codes: 200 (Success), 400 (Invalid PIN/amount), 401 (Unauthorized), 403 (Insufficient funds)
  - Headers: `x-user-id`, `x-user-role` (parent)

- **GET /api/wallet/transactions/**
  - Description: Get wallet transaction history
  - Query Parameters: `?type=all|funding|transfer|conversion&limit=20&offset=0`
  - Response: `{ success: boolean, transactions: Transaction[] }`
  - Status Codes: 200 (Success), 401 (Unauthorized)
  - Headers: `x-user-id`

### PIN Management

- **POST /api/wallet/pin/set/**
  - Description: Set wallet PIN for parent
  - Request Body: `{ pin: string, confirmPin: string }`
  - Response: `{ success: boolean, message: string }`
  - Status Codes: 200 (Success), 400 (PIN mismatch/invalid), 401 (Unauthorized)
  - Headers: `x-user-id`, `x-user-role` (parent)

- **GET /api/wallet/pin/status/**
  - Description: Check if PIN is set
  - Request Body: None
  - Response: `{ hasPin: boolean }`
  - Status Codes: 200 (Success), 401 (Unauthorized)
  - Headers: `x-user-id`, `x-user-role` (parent)

### Coin Conversion

- **POST /api/wallet/convert/request/**
  - Description: Request coin to money conversion (child)
  - Request Body: `{ coinAmount: number, note?: string }`
  - Response: `{ success: boolean, request: ConversionRequest }`
  - Status Codes: 200 (Success), 400 (Insufficient coins), 401 (Unauthorized)
  - Headers: `x-user-id`, `x-user-role` (child)

- **GET /api/wallet/convert/requests/**
  - Description: Get pending conversion requests (parent)
  - Request Body: None
  - Response: `{ success: boolean, requests: ConversionRequest[] }`
  - Status Codes: 200 (Success), 401 (Unauthorized)
  - Headers: `x-user-id`, `x-user-role` (parent)

- **POST /api/wallet/convert/approve/**
  - Description: Approve coin conversion request
  - Request Body: `{ requestId: string, action: string, pin: string, reason?: string }`
  - Response: `{ success: boolean, message: string }`
  - Status Codes: 200 (Success), 400 (Invalid PIN), 401 (Unauthorized), 404 (Request not found)
  - Headers: `x-user-id`, `x-user-role` (parent)

## User Management Endpoints

### User Profile

- **GET /api/users/{id}/**
  - Description: Get user profile by ID
  - Request Body: None
  - Response: `{ success: boolean, user: User }`
  - Status Codes: 200 (Success), 404 (Not found), 400 (Missing ID)
  - Headers: `x-user-id`

## Notifications Endpoints

### Notification Management

- **GET /api/notifications/**
  - Description: Get user notifications
  - Query Parameters: `?limit=20&offset=0`
  - Request Body: None
  - Response: `{ success: boolean, notifications: Notification[] }`
  - Status Codes: 200 (Success), 401 (Unauthorized)
  - Headers: `x-user-id`

- **POST /api/notifications/{id}/read/**
  - Description: Mark notification as read
  - Request Body: None
  - Response: `{ success: boolean, message: string }`
  - Status Codes: 200 (Success), 404 (Not found), 401 (Unauthorized)
  - Headers: `x-user-id`

- **DELETE /api/notifications/{id}/**
  - Description: Delete a notification
  - Request Body: None
  - Response: `{ success: boolean, message: string }`
  - Status Codes: 200 (Success), 404 (Not found), 401 (Unauthorized)
  - Headers: `x-user-id`

## Testing Endpoints

- **GET /api/test/**
  - Description: API health check endpoint
  - Request Body: None
  - Response: `{ message: string }`
  - Status Codes: 200 (Success)
  - Headers: None required

- **GET /api/test-db/**
  - Description: Database connection test endpoint
  - Request Body: None
  - Response: `{ success: boolean, message: string }`
  - Status Codes: 200 (Success), 500 (Database error)
  - Headers: None required

## Error Handling

All endpoints follow a consistent error response format:

\`\`\`json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
\`\`\`

Common HTTP Status Codes:
- **200**: Success
- **201**: Created
- **400**: Bad Request (validation error, missing required fields)
- **401**: Unauthorized (authentication required or invalid)
- **403**: Forbidden (user lacks permissions)
- **404**: Not Found (resource doesn't exist)
- **500**: Internal Server Error

## Authentication Flow

1. Users authenticate via `/api/auth/callback/parent-login/` or `/api/auth/callback/child-login/`
2. Response includes a `user` object with `id` and `role`
3. Subsequent requests include headers: `x-user-id` and `x-user-role`
4. These headers are used by the server to authenticate and authorize requests

## Mock Endpoints

The following endpoints use mock data and are available for testing/demo purposes:
- GET `/api/mock/chores/`
- POST `/api/mock/chores/`
- GET `/api/mock/rewards/`
- POST `/api/mock/rewards/`
- GET `/api/mock/family/children/`
- POST `/api/mock/family/children/`
