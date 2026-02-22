# ChoreQuest API Endpoints

This document lists all the API endpoints required for the ChoreQuest application.

## Authentication Endpoints

### Parent Authentication

- **POST /api/auth/callback/parent-login/**
  - Description: Authenticate a parent user with email and password
  - Request Body: `{ email: string, password: string }`
  - Response: `{ success: boolean, user: User, message?: string }`
  - Status Codes: 200 (Success), 401 (Invalid credentials)

### Child Authentication

- **POST /api/auth/callback/child-login/**
  - Description: Authenticate a child user with username and 4-digit PIN
  - Request Body: `{ username: string, pin: string }`
  - Response: `{ success: boolean, user: User, message?: string }`
  - Status Codes: 200 (Success), 401 (Invalid credentials)

### User Registration

- **POST /api/auth/signup/**
  - Description: Register a new parent user
  - Request Body: `{ name: string, email: string, password: string }`
  - Response: `{ message: string, user: User }`
  - Status Codes: 201 (Created), 400 (Validation error)

### Child Registration

- **POST /api/mock/family/children/**
  - Description: Create a new child account (parent only)
  - Request Body: `{ name: string, pin: string, image?: string }`
  - Response: `{ child: User, username: string }`
  - Status Codes: 201 (Created), 400 (Validation error)

## Family Management Endpoints

### Children Management

- **GET /api/mock/family/children/**
  - Description: Get all children for the current parent
  - Request Body: None
  - Response: `{ children: User[] }`
  - Status Codes: 200 (Success), 401 (Unauthorized)

- **GET /api/family/children/{id}/**
  - Description: Get a specific child by ID
  - Request Body: None
  - Response: `{ child: User }`
  - Status Codes: 200 (Success), 404 (Not found)

- **PUT /api/family/children/{id}/**
  - Description: Update a child account
  - Request Body: `{ name?: string, pin?: string, image?: string }`
  - Response: `{ child: User }`
  - Status Codes: 200 (Success), 400 (Validation error), 404 (Not found)

- **DELETE /api/family/children/{id}/**
  - Description: Delete a child account
  - Request Body: None
  - Response: `{ message: string }`
  - Status Codes: 200 (Success), 404 (Not found)

## Chores Management Endpoints

### Chores

- **GET /api/mock/chores/**
  - Description: Get all chores for the current user
  - Query Parameters: `?status=pending|completed|approved&childId=string&limit=number&offset=number`
  - Request Body: None
  - Response: `{ chores: Chore[], total: number, hasMore: boolean }`
  - Status Codes: 200 (Success), 401 (Unauthorized)

- **POST /api/mock/chores/**
  - Description: Create a new chore
  - Request Body: `{ title: string, description: string, points: number, assignedTo: string, dueDate?: string, recurring?: boolean, recurringType?: 'daily'|'weekly'|'monthly' }`
  - Response: `{ chore: Chore }`
  - Status Codes: 201 (Created), 400 (Validation error)

- **PUT /api/chores/{id}/complete/**
  - Description: Mark a chore as completed
  - Request Body: `{ notes?: string, completedAt?: string }`
  - Response: `{ chore: Chore, coinsEarned: number }`
  - Status Codes: 200 (Success), 404 (Not found), 400 (Already completed)

- **PUT /api/chores/{id}/approve/**
  - Description: Approve a completed chore
  - Request Body: `{ bonus?: number, feedback?: string }`
  - Response: `{ chore: Chore, totalCoinsAwarded: number }`
  - Status Codes: 200 (Success), 404 (Not found), 400 (Not completed)

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

### Wallet Operations

- **POST /api/wallet/fund/**
  - Description: Add money to parent wallet
  - Request Body: `{ amount: number, paymentMethod: string }`
  - Response: `{ message: string, newBalance: number, transaction: Transaction }`
  - Status Codes: 200 (Success), 400 (Invalid amount), 401 (Unauthorized)

- **POST /api/wallet/transfer/**
  - Description: Transfer money from parent to child
  - Request Body: `{ childId: string, amount: number, pin: string, note?: string }`
  - Response: `{ message: string, transaction: Transaction, parentBalance: number, childBalance: number }`
  - Status Codes: 200 (Success), 400 (Invalid PIN/amount), 401 (Unauthorized), 403 (Insufficient funds)

### PIN Management

- **POST /api/wallet/pin/set/**
  - Description: Set wallet PIN for parent
  - Request Body: `{ pin: string, confirmPin: string }`
  - Response: `{ message: string, pinSet: boolean }`
  - Status Codes: 200 (Success), 400 (PIN mismatch/invalid), 401 (Unauthorized)

- **GET /api/wallet/pin/status/**
  - Description: Check if PIN is set
  - Request Body: None
  - Response: `{ pinSet: boolean }`
  - Status Codes: 200 (Success), 401 (Unauthorized)

### Coin Conversion

- **POST /api/wallet/convert/request/**
  - Description: Request coin to money conversion (child)
  - Request Body: `{ coinAmount: number, note?: string }`
  - Response: `{ message: string, conversionRequest: ConversionRequest }`
  - Status Codes: 200 (Success), 400 (Insufficient coins), 401 (Unauthorized)

- **GET /api/wallet/convert/requests/**
  - Description: Get pending conversion requests (parent)
  - Request Body: None
  - Response: `{ requests: ConversionRequest[] }`
  - Status Codes: 200 (Success), 401 (Unauthorized)

- **POST /api/wallet/convert/approve/{id}/**
  - Description: Approve coin conversion request
  - Request Body: `{ pin: string, note?: string }`
  - Response: `{ message: string, transaction: Transaction, childBalance: number }`
  - Status Codes: 200 (Success), 400 (Invalid PIN), 401 (Unauthorized), 404 (Request not found)

## Notifications

### Notification Management

- **GET /api/notifications/**
  - Description: Get user notifications
  - Query Parameters: `?read=true|false&limit=number&offset=number`
  - Request Body: None
  - Response: `{ notifications: Notification[], unreadCount: number, hasMore: boolean }`
  - Status Codes: 200 (Success), 401 (Unauthorized)

- **PUT /api/notifications/{id}/read/**
  - Description: Mark notification as read
  - Request Body: None
  - Response: `{ notification: Notification }`
  - Status Codes: 200 (Success), 404 (Not found)

- **DELETE /api/notifications/{id}/**
  - Description: Delete a notification
  - Request Body: None
  - Response: `{ message: string }`
  - Status Codes: 200 (Success), 404 (Not found)

## Testing

- **GET /api/test/**
  - Description: API health check endpoint
  - Request Body: None
  - Response: `{ message: string }`
  - Status Codes: 200 (Success)
