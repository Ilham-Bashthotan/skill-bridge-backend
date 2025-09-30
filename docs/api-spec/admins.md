# Admins API Specification

This document describes the RESTful API endpoints for admin operations. Admins are regular users with `role = "admin"` in the unified users model.

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
Get current admin profile information (from users table).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Success Response:**
```json
{
  "id": 1,
  "name": "Admin User",
  "email": "admin@example.com",
  "phone": "08123456789",
  "role": "admin",
  "bio": null,
  "experience": null,
  "email_verified": false,
  "created_at": "2025-09-13T00:00:00Z",
  "updated_at": "2025-09-13T00:00:00Z"
}
```

**Error Response:**
```json
{
  "error": "Admin not found"
}
```

### PUT /admins/profile
Update current admin profile information (stored on user record).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request:**
```json
{
  "name": "Admin User",
  "phone": "08123456789",
  "bio": "Platform administrator",
  "experience": "3 years"
}
```

**Success Response:**
```json
{
  "message": "Admin profile updated successfully",
  "user": {
    "id": 1,
    "name": "Admin User",
    "phone": "08123456789",
    "bio": "Platform administrator",
    "experience": "3 years",
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
      "email_verified": false,
      "created_at": "2025-09-13T00:00:00Z",
      "updated_at": "2025-09-13T00:00:00Z"
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
  "role": "student",
  "bio": null,
  "experience": null,
  "email_verified": false,
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
Create a new admin user (creates a user with role=admin).

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
  "password": "securePassword123"
}
```

**Success Response:**
```json
{
  "message": "Admin created successfully",
  "user": {
    "id": 151,
    "name": "New Admin",
    "email": "newadmin@example.com",
    "phone": "08987654321",
    "role": "admin",
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

### POST /admins/create-mentor
Create a new mentor user (creates a user with role=mentor).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request:**
```json
{
  "name": "Jane Smith",
  "email": "jane.mentor@example.com",
  "phone": "08123456789",
  "password": "mentorPassword123",
  "bio": "Experienced React developer",
  "experience": "5 years in frontend development"
}
```

**Success Response:**
```json
{
  "message": "Mentor created successfully",
  "user": {
    "id": 153,
    "name": "Jane Smith",
    "email": "jane.mentor@example.com",
    "phone": "08123456789",
    "role": "mentor",
    "bio": "Experienced React developer",
    "experience": "5 years in frontend development",
    "email_verified": false,
    "created_at": "2025-09-18T10:30:00Z",
    "updated_at": "2025-09-18T10:30:00Z"
  }
}
```

**Error Response:**
```json
{
  "error": "Email already exists"
}
```

## Error Response (General)
All error responses follow this format:
```json
{
  "error": "Error message"
}
```

---

*Last updated: 2025-09-30*
