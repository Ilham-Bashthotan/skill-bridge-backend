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
- `material_type` (optional): Filter by material type (text, video, quiz)
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
      "material_type": "text",
      "course": {
        "id": 1,
        "title": "Introduction to Programming"
      },
      "created_at": "2025-09-13T00:00:00Z"
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
  "material_type": "text",
  "course": {
    "id": 1,
    "title": "Introduction to Programming",
    "duration": "4 weeks"
  },
  "created_at": "2025-09-13T00:00:00Z"
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
  "content": "Functions are reusable blocks of code that perform specific tasks...",
  "material_type": "text"
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
    "material_type": "text",
    "created_at": "2025-09-13T00:00:00Z"
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
  "content": "Updated content about advanced functions and methods...",
  "material_type": "video"
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
    "material_type": "video",
    "created_at": "2025-09-13T00:00:00Z"
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

### GET /course-materials/:materialId/progress
Get progress statistics for a specific course material.

**Headers:**
```
Authorization: Bearer <mentor_or_admin_token>
```

**Success Response:**
```json
{
  "material": {
    "id": 1,
    "title": "Introduction to Variables",
    "material_type": "text"
  },
  "total_students": 25,
  "completed_students": 20,
  "completion_rate": 80,
  "average_progress": 85,
  "progress_breakdown": {
    "0-25": 2,
    "26-50": 1,
    "51-75": 2,
    "76-100": 20
  }
}
```

**Error Response:**
```json
{
  "error": "Course material not found or unauthorized"
}
```

### GET /course-materials/types
Get available material types.

**Success Response:**
```json
{
  "material_types": [
    {
      "value": "text",
      "label": "Text Content",
      "description": "Written educational content"
    },
    {
      "value": "video",
      "label": "Video Content",
      "description": "Video-based educational content"
    },
    {
      "value": "quiz",
      "label": "Quiz/Assessment",
      "description": "Interactive quiz or assessment"
    }
  ]
}
```

### POST /course-materials/:materialId/duplicate
Duplicate a course material to another course.

**Headers:**
```
Authorization: Bearer <mentor_or_admin_token>
```

**Request:**
```json
{
  "target_course_id": 2,
  "new_title": "Variables in Python"
}
```

**Success Response:**
```json
{
  "message": "Course material duplicated successfully",
  "new_material": {
    "id": 15,
    "course_id": 2,
    "title": "Variables in Python",
    "material_type": "text",
    "created_at": "2025-09-13T01:00:00Z"
  }
}
```

**Error Response:**
```json
{
  "error": "Target course not found or unauthorized"
}
```

### GET /course-materials/search
Search course materials by content or title.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `q`: Search query
- `course_id` (optional): Limit search to specific course
- `material_type` (optional): Filter by material type
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
      "material_type": "text",
      "course": {
        "id": 1,
        "title": "Introduction to Programming"
      },
      "relevance_score": 0.95,
      "created_at": "2025-09-13T00:00:00Z"
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

### PUT /course-materials/:materialId/order
Update the order/position of a course material within its course.

**Headers:**
```
Authorization: Bearer <mentor_or_admin_token>
```

**Request:**
```json
{
  "position": 3
}
```

**Success Response:**
```json
{
  "message": "Course material order updated successfully",
  "updated_materials": [
    {
      "id": 1,
      "title": "Introduction",
      "position": 1
    },
    {
      "id": 2,
      "title": "Basic Concepts",
      "position": 2
    },
    {
      "id": 3,
      "title": "Variables",
      "position": 3
    }
  ]
}
```

**Error Response:**
```json
{
  "error": "Invalid position value"
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
