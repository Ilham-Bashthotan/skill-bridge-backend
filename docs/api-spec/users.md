# Users API Specification

This document describes the RESTful API endpoints for user management in the platform.

---

## Authentication
Some endpoints require authentication. For these endpoints, include the following HTTP header:

```
Authorization: Bearer <token>
```

---

## Endpoints

### POST /auth/register
Register a new user account. By default, new accounts are created with role "student" and email_verified = false.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "08123456789",
  "password": "securePassword123"
}
```

**Success Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "08123456789",
    "role": "student",
    "bio": null,
    "experience": null,
    "email_verified": false,
    "token": null,
    "created_at": "2025-09-13T00:00:00Z",
    "updated_at": "2025-09-13T00:00:00Z"
  }
}
```

**Error Response:**
```json
{
  "error": "Email already exists"
}
```

### POST /auth/login
Authenticate user and get access token.

**Request:**
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Success Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "student",
    "bio": null,
    "experience": null,
    "email_verified": false,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response:**
```json
{
  "error": "Invalid credentials"
}
```

### GET /users/profile
Get current user profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "08123456789",
  "role": "student",
  "bio": null,
  "experience": null,
  "email_verified": false,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "created_at": "2025-09-13T00:00:00Z",
  "updated_at": "2025-09-13T00:00:00Z"
}
```

**Error Response:**
```json
{
  "error": "User not found"
}
```

### PUT /users/profile
Update current user profile information. Only name, phone, bio, and experience can be updated by the user.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "name": "John Smith",
  "phone": "08987654321",
  "bio": "Aspiring frontend developer.",
  "experience": "1 year building React projects"
}
```

**Success Response:**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "name": "John Smith",
    "email": "john.doe@example.com",
    "phone": "08987654321",
    "role": "student",
    "bio": "Aspiring frontend developer.",
    "experience": "1 year building React projects",
    "email_verified": false,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "created_at": "2025-09-13T00:00:00Z",
    "updated_at": "2025-09-13T01:00:00Z"
  }
}
```

**Error Response:**
```json
{
  "error": "Invalid input data"
}
```

### PUT /users/change-password
Change user password.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "current_password": "oldPassword123",
  "new_password": "newSecurePassword456"
}
```

**Success Response:**
```json
{
  "message": "Password changed successfully"
}
```

**Error Response:**
```json
{
  "error": "Current password is incorrect"
}
```

### DELETE /users/account
Delete user account.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "password": "securePassword123"
}
```

**Success Response:**
```json
{
  "message": "Account deleted successfully"
}
```

**Error Response:**
```json
{
  "error": "Password confirmation required"
}
```

---

## Error Response (General)
All error responses follow this format:
```json
{
  "error": "Error message"
}
```

---

*Last updated: 2025-09-19*
