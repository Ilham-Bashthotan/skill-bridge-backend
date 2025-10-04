# Mentors API Specification

This document describes the RESTful API endpoints for mentor operations. Mentors are users with `role = "mentor"` in the unified users model.

---

## Authentication
All endpoints require mentor authentication. Include the following HTTP header:

```
Authorization: Bearer <mentor_token>
```

---

## Endpoints

### GET /mentors/dashboard
Get mentor dashboard information.

**Headers:**
```
Authorization: Bearer <mentor_token>
```

**Success Response:**
```json
{
  "assigned_courses": 2,
  "total_students": 45,
  "active_consultations": 8,
  "forum_answers_given": 23
}
```

**Error Response:**
```json
{
  "error": "Mentor not found"
}
```

### GET /mentors/courses/assigned
Get courses assigned to the mentor.

**Headers:**
```
Authorization: Bearer <mentor_token>
```

**Success Response:**
```json
{
  "courses": [
    {
      "id": 1,
      "title": "Introduction to Programming",
      "description": "Learn basic programming concepts",
      "students_enrolled": 25,
      "assigned_at": "2025-09-01T00:00:00Z"
    }
  ]
}
```

### GET /mentors/courses/:courseId
Get detailed information about an assigned course.

**Headers:**
```
Authorization: Bearer <mentor_token>
```

**Success Response:**
```json
{
  "id": 1,
  "title": "Introduction to Programming",
  "description": "Learn basic programming concepts",
  "students_enrolled": 25,
  "materials_count": 12,
  "assigned_at": "2025-09-01T00:00:00Z"
}
```

**Error Response:**
```json
{
  "error": "Course not found or not assigned"
}
```

### GET /mentors/courses/:courseId/students
Get students enrolled in a specific course.

**Headers:**
```
Authorization: Bearer <mentor_token>
```

**Success Response:**
```json
{
  "students": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "enrolled_at": "2025-09-01T00:00:00Z"
    }
  ]
}
```

**Error Response:**
```json
{
  "error": "Course not found or not assigned"
}
```

### GET /mentors/courses/:courseId/materials
Get course materials for an assigned course.

**Headers:**
```
Authorization: Bearer <mentor_token>
```

**Success Response:**
```json
{
  "materials": [
    {
      "id": 1,
      "title": "Introduction to Variables",
      "created_at": "2025-09-13T00:00:00Z",
      "updated_at": "2025-09-13T00:00:00Z"
    },
    {
      "id": 2,
      "title": "Programming Basics Video",
      "created_at": "2025-09-13T00:00:00Z",
      "updated_at": "2025-09-13T00:00:00Z"
    }
  ]
}
```

**Error Response:**
```json
{
  "error": "Course not found or not assigned"
}
```

### POST /mentors/courses/:courseId/materials
Create new course material for an assigned course.

**Headers:**
```
Authorization: Bearer <mentor_token>
```

**Request:**
```json
{
  "title": "Advanced Programming Concepts",
  "content": "Detailed explanation of advanced programming concepts..."
}
```

**Success Response:**
```json
{
  "message": "Course material created successfully",
  "material": {
    "id": 3,
    "course_id": 1,
    "title": "Advanced Programming Concepts",
    "created_at": "2025-09-13T00:00:00Z",
    "updated_at": "2025-09-13T00:00:00Z"
  }
}
```

**Error Response:**
```json
{
  "error": "Invalid material type"
}
```

### PUT /mentors/courses/:courseId/materials/:materialId
Update course material.

**Headers:**
```
Authorization: Bearer <mentor_token>
```

**Request:**
```json
{
  "title": "Updated Programming Concepts",
  "content": "Updated content for programming concepts..."
}
```

**Success Response:**
```json
{
  "message": "Course material updated successfully",
  "material": {
    "id": 3,
    "course_id": 1,
    "title": "Updated Programming Concepts",
    "updated_at": "2025-09-13T01:30:00Z"
  }
}
```

**Error Response:**
```json
{
  "error": "Material not found"
}
```

### DELETE /mentors/courses/:courseId/materials/:materialId
Delete course material.

**Headers:**
```
Authorization: Bearer <mentor_token>
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

### GET /mentors/students/:studentId/progress
Get detailed progress information for a specific student.

**Headers:**
```
Authorization: Bearer <mentor_token>
```

**Success Response:**
```json
{
  "student": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "courses_progress": [
    {
      "course_id": 1,
      "course_title": "Introduction to Programming",
      "materials_completed": 10,
      "total_materials": 12,
      "last_activity": "2025-09-12T15:30:00Z"
    }
  ]
}
```

**Error Response:**
```json
{
  "error": "Student not found or not in mentor's courses"
}
```

### PUT /mentors/status
Update mentor profile fields (subset).

**Headers:**
```
Authorization: Bearer <mentor_token>
```

**Request:**
```json
{
  "bio": "Available next month",
  "experience": "7 years"
}
```

**Success Response:**
```json
{
  "message": "Mentor profile updated successfully",
  "user": {
    "id": 1,
    "bio": "Available next month",
    "experience": "7 years",
    "updated_at": "2025-09-13T02:00:00Z"
  }
}
```

**Error Response:**
```json
{
  "error": "Invalid status value"
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

*Last updated: 2025-09-16*
