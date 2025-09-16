# Course Materials API Specification

This document describes the RESTful API endpoints for course materials management in the platform.

---

## Authentication
Most endpoints require authentication. Include the following HTTP header when required:

```
Authorization: Bearer <token>
```

---

## Endpoints

### GET /course-materials
Get list of course materials with filters.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `course_id` (optional): Filter by course ID
- `q` (optional): Search by title or content
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Success Response:**
```json
{
  "materials": [
    {
      "id": 1,
      "course_id": 1,
      "title": "Introduction to Variables",
      "course": {
        "id": 1,
        "title": "Introduction to Programming"
      },
      "created_at": "2025-09-13T00:00:00Z",
      "updated_at": "2025-09-13T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "total_pages": 5
  }
}
```

**Error Response:**
```json
{
  "error": "Invalid filter parameters"
}
```

### GET /course-materials/:materialId
Get detailed information about a specific course material.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response:**
```json
{
  "id": 1,
  "course_id": 1,
  "title": "Introduction to Variables",
  "content": "Variables are containers for storing data values...",
  "course": {
    "id": 1,
    "title": "Introduction to Programming"
  },
  "created_at": "2025-09-13T00:00:00Z",
  "updated_at": "2025-09-13T00:00:00Z"
}
```

**Error Response:**
```json
{
  "error": "Course material not found"
}
```

### POST /course-materials
Create a new course material.

**Headers:**
```
Authorization: Bearer <mentor_or_admin_token>
```

**Request:**
```json
{
  "course_id": 1,
  "title": "Functions and Methods",
  "content": "Functions are reusable blocks of code that perform specific tasks..."
}
```

**Success Response:**
```json
{
  "message": "Course material created successfully",
  "material": {
    "id": 3,
    "course_id": 1,
    "title": "Functions and Methods",
    "content": "Functions are reusable blocks of code that perform specific tasks...",
    "created_at": "2025-09-13T00:00:00Z",
    "updated_at": "2025-09-13T00:00:00Z"
  }
}
```

**Error Response:**
```json
{
  "error": "Course not found or unauthorized"
}
```

### PUT /course-materials/:materialId
Update an existing course material.

**Headers:**
```
Authorization: Bearer <mentor_or_admin_token>
```

**Request:**
```json
{
  "title": "Advanced Functions and Methods",
  "content": "Updated content about advanced functions and methods..."
}
```

**Success Response:**
```json
{
  "message": "Course material updated successfully",
  "material": {
    "id": 1,
    "course_id": 1,
    "title": "Advanced Functions and Methods",
    "content": "Updated content about advanced functions and methods...",
    "updated_at": "2025-09-13T00:00:00Z"
  }
}
```

**Error Response:**
```json
{
  "error": "Course material not found or unauthorized"
}
```

### DELETE /course-materials/:materialId
Delete a course material.

**Headers:**
```
Authorization: Bearer <mentor_or_admin_token>
```

**Success Response:**
```json
{
  "message": "Course material deleted successfully"
}
```

**Error Response:**
```json
{
  "error": "Cannot delete material with student progress"
}
```

// Removed material progress aggregation endpoint (not represented in schema)

// Removed material types (no enum in schema)

// Removed duplicate endpoint (out of scope)

### GET /course-materials/search
Search course materials by content or title.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `q`: Search query
- `course_id` (optional): Limit search to specific course
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Success Response:**
```json
{
  "materials": [
    {
      "id": 1,
      "course_id": 1,
      "title": "Introduction to Variables",
      "course": {
        "id": 1,
        "title": "Introduction to Programming"
      },
      "relevance_score": 0.95,
      "created_at": "2025-09-13T00:00:00Z",
      "updated_at": "2025-09-13T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 8,
    "total_pages": 1
  }
}
```

**Error Response:**
```json
{
  "error": "Search query is required"
}
```

// Removed ordering endpoint (not represented in schema)

---

## Error Response (General)
All error responses follow this format:
```json
{
  "error": "Error message"
}
```

---

*Last updated: 2025-09-16*
