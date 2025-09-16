# Course Progress API Specification

This document describes the RESTful API endpoints for tracking and managing student course progress in the platform.

---

## Authentication
All endpoints require authentication. Include the following HTTP header:

```
Authorization: Bearer <token>
```

---

## Endpoints

### GET /course-progress
Get course progress for the current user (student).

**Headers:**
```
Authorization: Bearer <student_token>
```

**Query Parameters:**
- `course_id` (optional): Filter by specific course
- `completed` (optional): Filter by completion status (true/false)

**Success Response:**
```json
{
  "progress": [
    {
      "id": 1,
      "student_id": 1,
      "course_material_id": 1,
      "material": {
        "id": 1,
        "title": "Introduction to Variables",
        "course": {
          "id": 1,
          "title": "Introduction to Programming"
        }
      },
      "completed": true,
      "updated_at": "2025-09-12T15:30:00Z"
    }
  ]
}
```

**Error Response:**
```json
{
  "error": "Student not found"
}
```

### GET /course-progress/course/:courseId
Get progress for all materials in a specific course.

**Headers:**
```
Authorization: Bearer <student_token>
```

**Success Response:**
```json
{
  "course": {
    "id": 1,
    "title": "Introduction to Programming",
    "duration": "4 weeks"
  },
  "materials_progress": [
    {
      "id": 1,
      "course_material_id": 1,
      "material": {
        "id": 1,
        "title": "Introduction to Variables"
      },
      "completed": true,
      "updated_at": "2025-09-12T15:30:00Z"
    },
    {
      "id": 2,
      "course_material_id": 2,
      "material": {
        "id": 2,
        "title": "Programming Basics Video"
      },
      "completed": false,
      "updated_at": "2025-09-13T10:00:00Z"
    }
  ],
  "statistics": {
    "total_materials": 12,
    "completed_materials": 9,
    "incomplete_materials": 3
  }
}
```

**Error Response:**
```json
{
  "error": "Course not found or not enrolled"
}
```

### PUT /course-progress/:progressId
Update progress for a specific course material.

**Headers:**
```
Authorization: Bearer <student_token>
```

**Request:**
```json
{
  "completed": false
}
```

**Success Response:**
```json
{
  "message": "Progress updated successfully",
  "progress": {
    "id": 1,
    "student_id": 1,
    "course_material_id": 1,
    "completed": false,
    "updated_at": "2025-09-13T11:00:00Z"
  }
}
```

**Error Response:**
```json
{
  "error": "Progress record not found or unauthorized"
}
```

### POST /course-progress
Create or update progress for a course material.

**Headers:**
```
Authorization: Bearer <student_token>
```

**Request:**
```json
{
  "course_material_id": 3,
  "completed": false
}
```

**Success Response:**
```json
{
  "message": "Progress recorded successfully",
  "progress": {
    "id": 15,
    "student_id": 1,
    "course_material_id": 3,
    "completed": false,
    "updated_at": "2025-09-13T11:30:00Z"
  }
}
```

**Error Response:**
```json
{
  "error": "Course material not found or not enrolled in course"
}
```

### GET /course-progress/material/:materialId
Get progress for a specific course material.

**Headers:**
```
Authorization: Bearer <student_token>
```

**Success Response:**
```json
{
  "id": 1,
  "student_id": 1,
  "course_material_id": 1,
  "material": {
    "id": 1,
    "title": "Introduction to Variables",
    "material_type": "text",
    "course": {
      "id": 1,
      "title": "Introduction to Programming"
    }
  },
  "completed": true,
  "updated_at": "2025-09-12T15:30:00Z"
}
```

**Error Response:**
```json
{
  "error": "Progress not found for this material"
}
```

### GET /course-progress/statistics
Get overall progress statistics for the current student.

**Headers:**
```
Authorization: Bearer <student_token>
```

**Success Response:**
```json
{
  "student": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "overall_statistics": {
    "total_courses_enrolled": 3,
    "completed_courses": 1,
    "in_progress_courses": 2,
    "total_materials": 36,
    "completed_materials": 28,
    "overall_progress_percentage": 78
  },
  "course_breakdown": [
    {
      "course_id": 1,
      "course_title": "Introduction to Programming",
      "completed": true,
      "materials_completed": 12,
      "total_materials": 12
    },
    {
      "course_id": 2,
      "course_title": "Web Development Basics",
      "completed": false,
      "materials_completed": 10,
      "total_materials": 15
    }
  ]
}
```

### GET /course-progress/admin/student/:studentId
Get progress for a specific student (admin/mentor only).

**Headers:**
```
Authorization: Bearer <admin_or_mentor_token>
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
      "course": {
        "id": 1,
        "title": "Introduction to Programming"
      },
      "overall_progress": 100,
      "completed": true,
      "materials_progress": [
        {
          "material_id": 1,
          "material_title": "Introduction to Variables",
          "completed": true,
          "updated_at": "2025-09-12T15:30:00Z"
        }
      ]
    }
  ]
}
```

**Error Response:**
```json
{
  "error": "Student not found or unauthorized"
}
```

### GET /course-progress/admin/course/:courseId
Get progress statistics for all students in a course (admin/mentor only).

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
  "course": {
    "id": 1,
    "title": "Introduction to Programming",
    "total_materials": 12
  },
  "statistics": {
    "total_students": 25,
    "completed_students": 15,
    "incomplete_students": 10
  },
  "students_progress": [
    {
      "student": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
      },
      "completed": true,
      "last_activity": "2025-09-12T15:30:00Z"
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
  "error": "Course not found or unauthorized"
}
```

### DELETE /course-progress/:progressId
Reset progress for a specific course material.

**Headers:**
```
Authorization: Bearer <student_token>
```

**Success Response:**
```json
{
  "message": "Progress reset successfully"
}
```

**Error Response:**
```json
{
  "error": "Progress record not found or unauthorized"
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
