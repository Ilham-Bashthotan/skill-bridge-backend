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
- `status` (optional): Filter by completion status (completed, in_progress, not_started)

**Success Response:**
```json
{
  "progress": [
    {
      "id": 1,
      "student_id": 1,
      "course_material_id": 1,
      "course_material": {
        "id": 1,
        "title": "Introduction to Variables",
        "material_type": "text",
        "course": {
          "id": 1,
          "title": "Introduction to Programming"
        }
      },
      "progress": 100,
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
  "overall_progress": 75,
  "materials_progress": [
    {
      "id": 1,
      "course_material_id": 1,
      "material": {
        "id": 1,
        "title": "Introduction to Variables",
        "material_type": "text"
      },
      "progress": 100,
      "completed": true,
      "updated_at": "2025-09-12T15:30:00Z"
    },
    {
      "id": 2,
      "course_material_id": 2,
      "material": {
        "id": 2,
        "title": "Programming Basics Video",
        "material_type": "video"
      },
      "progress": 50,
      "completed": false,
      "updated_at": "2025-09-13T10:00:00Z"
    }
  ],
  "statistics": {
    "total_materials": 12,
    "completed_materials": 9,
    "in_progress_materials": 2,
    "not_started_materials": 1
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
  "progress": 85,
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
    "progress": 85,
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
  "progress": 25,
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
    "progress": 25,
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
  "progress": 100,
  "completed": true,
  "started_at": "2025-09-10T09:00:00Z",
  "completed_at": "2025-09-12T15:30:00Z",
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
    "user": {
      "name": "John Doe",
      "email": "john@example.com"
    },
    "education_level": "SMA"
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
      "progress_percentage": 100,
      "completed": true,
      "materials_completed": 12,
      "total_materials": 12
    },
    {
      "course_id": 2,
      "course_title": "Web Development Basics",
      "progress_percentage": 67,
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
    "user": {
      "name": "John Doe",
      "email": "john@example.com"
    },
    "education_level": "SMA"
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
          "progress": 100,
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
    "average_progress": 78,
    "completed_students": 15,
    "in_progress_students": 8,
    "not_started_students": 2
  },
  "students_progress": [
    {
      "student": {
        "id": 1,
        "user": {
          "name": "John Doe",
          "email": "john@example.com"
        }
      },
      "progress_percentage": 100,
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

*Last updated: 2025-09-13*
