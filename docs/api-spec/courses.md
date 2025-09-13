# Courses API Specification

This document describes the RESTful API endpoints for course management in the platform.

---

## Authentication
Some endpoints require authentication. Include the following HTTP header when required:

```
Authorization: Bearer <token>
```

---

## Endpoints

### GET /courses
Get list of all available courses.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by course title or description

**Success Response:**
```json
{
  "courses": [
    {
      "id": 1,
      "title": "Introduction to Programming",
      "description": "Learn basic programming concepts and fundamentals",
      "duration": "4 weeks",
      "created_at": "2025-09-13T00:00:00Z",
      "updated_at": "2025-09-13T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "total_pages": 2
  }
}
```

**Error Response:**
```json
{
  "error": "Invalid pagination parameters"
}
```

### GET /courses/:courseId
Get detailed information about a specific course.

**Success Response:**
```json
{
  "id": 1,
  "title": "Introduction to Programming",
  "description": "Learn basic programming concepts and fundamentals",
  "duration": "4 weeks",
  "materials_count": 12,
  "enrolled_students": 25,
  "mentors": [
    {
      "id": 1,
      "name": "Jane Smith",
      "expertise": "Programming and Mathematics"
    }
  ],
  "created_at": "2025-09-13T00:00:00Z",
  "updated_at": "2025-09-13T00:00:00Z"
}
```

**Error Response:**
```json
{
  "error": "Course not found"
}
```

### POST /courses
Create a new course.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request:**
```json
{
  "title": "Advanced Web Development",
  "description": "Learn modern web development frameworks and best practices",
  "duration": "8 weeks"
}
```

**Success Response:**
```json
{
  "message": "Course created successfully",
  "course": {
    "id": 2,
    "title": "Advanced Web Development",
    "description": "Learn modern web development frameworks and best practices",
    "duration": "8 weeks",
    "created_at": "2025-09-13T00:00:00Z"
  }
}
```

**Error Response:**
```json
{
  "error": "Missing required fields"
}
```

### PUT /courses/:courseId
Update an existing course.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request:**
```json
{
  "title": "Updated Course Title",
  "description": "Updated course description",
  "duration": "6 weeks"
}
```

**Success Response:**
```json
{
  "message": "Course updated successfully",
  "course": {
    "id": 1,
    "title": "Updated Course Title",
    "description": "Updated course description",
    "duration": "6 weeks",
    "updated_at": "2025-09-13T01:00:00Z"
  }
}
```

**Error Response:**
```json
{
  "error": "Course not found"
}
```

### DELETE /courses/:courseId
Delete a course.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Success Response:**
```json
{
  "message": "Course deleted successfully"
}
```

**Error Response:**
```json
{
  "error": "Cannot delete course with enrolled students"
}
```

### GET /courses/:courseId/mentors
Get mentors assigned to a specific course.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response:**
```json
{
  "mentors": [
    {
      "id": 1,
      "user": {
        "id": 1,
        "name": "Jane Smith",
        "email": "jane@example.com"
      },
      "expertise": "Programming and Mathematics",
      "bio": "Experienced educator with 5 years in programming instruction",
      "assigned_at": "2025-09-01T00:00:00Z"
    }
  ]
}
```

**Error Response:**
```json
{
  "error": "Course not found"
}
```

### POST /courses/:courseId/mentors
Assign a mentor to a course.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request:**
```json
{
  "mentor_id": 1
}
```

**Success Response:**
```json
{
  "message": "Mentor assigned to course successfully",
  "assignment": {
    "id": 1,
    "course_id": 1,
    "mentor_id": 1,
    "assigned_at": "2025-09-13T00:00:00Z"
  }
}
```

**Error Response:**
```json
{
  "error": "Mentor already assigned to this course"
}
```

### DELETE /courses/:courseId/mentors/:mentorId
Remove a mentor from a course.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Success Response:**
```json
{
  "message": "Mentor removed from course successfully"
}
```

**Error Response:**
```json
{
  "error": "Mentor assignment not found"
}
```

### GET /courses/:courseId/students
Get students enrolled in a specific course.

**Headers:**
```
Authorization: Bearer <admin_or_mentor_token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Success Response:**
```json
{
  "students": [
    {
      "id": 1,
      "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
      },
      "education_level": "SMA",
      "enrolled_at": "2025-09-01T00:00:00Z",
      "progress_percentage": 85
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "total_pages": 3
  }
}
```

**Error Response:**
```json
{
  "error": "Course not found"
}
```

### GET /courses/:courseId/materials
Get course materials for a specific course.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response:**
```json
{
  "materials": [
    {
      "id": 1,
      "title": "Introduction to Variables",
      "material_type": "text",
      "created_at": "2025-09-13T00:00:00Z"
    },
    {
      "id": 2,
      "title": "Programming Basics Video",
      "material_type": "video",
      "created_at": "2025-09-13T00:00:00Z"
    }
  ]
}
```

**Error Response:**
```json
{
  "error": "Course not found"
}
```

### GET /courses/statistics
Get overall course statistics.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Success Response:**
```json
{
  "total_courses": 15,
  "active_courses": 12,
  "total_enrollments": 450,
  "average_completion_rate": 78,
  "most_popular_course": {
    "id": 1,
    "title": "Introduction to Programming",
    "enrollments": 45
  }
}
```

**Error Response:**
```json
{
  "error": "Unauthorized access"
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
