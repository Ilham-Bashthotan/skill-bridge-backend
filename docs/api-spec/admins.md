# Admins API Specification

This document describes the RESTful API endpoints for admin management in the platform.

---

## Authentication
All endpoints require admin authentication. Include the following HTTP header:

```
Authorization: Bearer <admin_token>
```

---

## Endpoints

### GET /admins/dashboard
Get admin dashboard statistics.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Success Response:**
```json
{
  "users_count": 150,
  "students_count": 120,
  "mentors_count": 25,
  "admins_count": 5,
  "courses_count": 15,
  "jobs_count": 8,
  "active_consultations": 12,
  "forum_questions": 45
}
```

**Error Response:**
```json
{
  "error": "Unauthorized access"
}
```

### GET /admins/profile
Get current admin profile information.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Success Response:**
```json
{
  "id": 1,
  "user_id": 1,
  "position": "super admin",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com",
    "phone": "08123456789"
  }
}
```

**Error Response:**
```json
{
  "error": "Admin not found"
}
```

### PUT /admins/profile
Update admin profile information.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request:**
```json
{
  "position": "content manager"
}
```

**Success Response:**
```json
{
  "message": "Admin profile updated successfully",
  "admin": {
    "id": 1,
    "user_id": 1,
    "position": "content manager"
  }
}
```

**Error Response:**
```json
{
  "error": "Invalid position"
}
```

### GET /admins/users
Get list of all users with pagination.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `role` (optional): Filter by role (student, mentor, admin)

**Success Response:**
```json
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "08123456789",
      "role": "student",
      "created_at": "2025-09-13T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "total_pages": 15
  }
}
```

**Error Response:**
```json
{
  "error": "Invalid pagination parameters"
}
```

### GET /admins/users/:userId
Get specific user details.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Success Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "08123456789",
  "created_at": "2025-09-13T00:00:00Z",
  "updated_at": "2025-09-13T00:00:00Z",
  "role_details": {
    "role": "student",
    "education_level": "SMA"
  }
}
```

**Error Response:**
```json
{
  "error": "User not found"
}
```

### PUT /admins/users/:userId/status
Update user status (activate/deactivate).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request:**
```json
{
  "is_active": false
}
```

**Success Response:**
```json
{
  "message": "User status updated successfully"
}
```

**Error Response:**
```json
{
  "error": "User not found"
}
```

### DELETE /admins/users/:userId
Delete a user account.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Success Response:**
```json
{
  "message": "User deleted successfully"
}
```

**Error Response:**
```json
{
  "error": "Cannot delete user with active courses"
}
```

### POST /admins/create-admin
Create a new admin user.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request:**
```json
{
  "name": "New Admin",
  "email": "newadmin@example.com",
  "phone": "08987654321",
  "password": "securePassword123",
  "position": "content manager"
}
```

**Success Response:**
```json
{
  "message": "Admin created successfully",
  "admin": {
    "id": 2,
    "user_id": 151,
    "position": "content manager",
    "user": {
      "id": 151,
      "name": "New Admin",
      "email": "newadmin@example.com"
    }
  }
}
```

**Error Response:**
```json
{
  "error": "Email already exists"
}
```

### GET /admins/system-logs
Get system activity logs.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `date_from` (optional): Start date filter
- `date_to` (optional): End date filter

**Success Response:**
```json
{
  "logs": [
    {
      "id": 1,
      "action": "user_created",
      "user_id": 1,
      "admin_id": 1,
      "details": "Created new student account",
      "timestamp": "2025-09-13T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 500,
    "total_pages": 25
  }
}
```

**Error Response:**
```json
{
  "error": "Invalid date format"
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

*Last updated: 2025-09-13*
