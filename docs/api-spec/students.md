# Students API Specification

This document describes the RESTful API endpoints for student operations. Students are users with `role = "student"` in the unified users model.

---

## Authentication
All endpoints require student authentication. Include the following HTTP header:

```
Authorization: Bearer <student_token>
```

---

## Endpoints

### GET /students/dashboard
Get student dashboard information.

**Headers:**
```
Authorization: Bearer <student_token>
```

**Success Response:**
```json
{
  "enrolled_courses": 3,
  "completed_courses": 1,
  "certificates_earned": 1,
  "active_consultations": 2,
  "forum_questions_asked": 5
}
```

**Error Response:**
```json
{
  "error": "Student not found"
}
```

### GET /students/profile
Get current student profile information (from users table).

**Headers:**
```
Authorization: Bearer <student_token>
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
  "error": "Student profile not found"
}
```

### PUT /students/profile
Update student profile information (stored on user record).

**Headers:**
```
Authorization: Bearer <student_token>
```

**Request:**
```json
{
  "name": "John Doe",
  "phone": "08123456789",
  "bio": "Aspiring developer",
  "experience": "Internship at XYZ"
}
```

**Success Response:**
```json
{
  "message": "Student profile updated successfully",
  "user": {
    "id": 1,
    "bio": "Aspiring developer",
    "experience": "Internship at XYZ",
    "updated_at": "2025-09-13T01:00:00Z"
  }
}
```

**Error Response:**
```json
{
  "error": "Invalid education level"
}
```

### GET /students/courses
Get all available courses for enrollment.

**Headers:**
```
Authorization: Bearer <student_token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by course title

**Success Response:**
```json
{
  "courses": [
    {
      "id": 1,
      "title": "Introduction to Programming",
      "description": "Learn basic programming concepts",
      "is_enrolled": false,
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

### GET /students/courses/enrolled
Get courses enrolled by the student.

**Headers:**
```
Authorization: Bearer <student_token>
```

**Success Response:**
```json
{
  "courses": [
    {
      "id": 1,
      "title": "Introduction to Programming",
      "description": "Learn basic programming concepts",
      "is_completed": false,
      "enrolled_at": "2025-09-01T00:00:00Z"
    }
  ]
}
```

### POST /students/courses/:courseId/enroll
Enroll in a specific course.

**Headers:**
```
Authorization: Bearer <student_token>
```

**Success Response:**
```json
{
  "message": "Successfully enrolled in course",
  "enrollment": {
    "course_id": 1,
    "user_id": 1,
    "enrolled_at": "2025-09-13T00:00:00Z"
  }
}
```

**Error Response:**
```json
{
  "error": "Already enrolled in this course"
}
```

### GET /students/courses/:courseId
Get detailed information about a specific course.

**Headers:**
```
Authorization: Bearer <student_token>
```

**Success Response:**
```json
{
  "id": 1,
  "title": "Introduction to Programming",
  "description": "Learn basic programming concepts",
  "is_enrolled": true,
  "is_completed": false,
  "materials_count": 12,
  "completed_materials": 9
}
```

**Error Response:**
```json
{
  "error": "Course not found"
}
```

### GET /students/courses/:courseId/materials
Get course materials for a specific course.

**Headers:**
```
Authorization: Bearer <student_token>
```

**Success Response:**
```json
{
  "materials": [
    {
      "id": 1,
      "title": "Introduction to Variables",
      "is_completed": true,
      "created_at": "2025-09-13T00:00:00Z",
      "updated_at": "2025-09-13T00:00:00Z"
    },
    {
      "id": 2,
      "title": "Programming Basics Video",
      "is_completed": false,
      "created_at": "2025-09-13T00:00:00Z",
      "updated_at": "2025-09-13T00:00:00Z"
    }
  ]
}
```

**Error Response:**
```json
{
  "error": "Course not found or not enrolled"
}
```

### PUT /students/courses/:courseId/materials/:materialId/progress
Update progress for a specific course material.

**Headers:**
```
Authorization: Bearer <student_token>
```

**Request:**
```json
{
  "completed": true
}
```

**Success Response:**
```json
{
  "message": "Progress updated successfully",
  "progress": {
    "material_id": 1,
    "completed": true,
    "updated_at": "2025-09-13T00:00:00Z"
  }
}
```

**Error Response:**
```json
{
  "error": "Invalid progress value"
}
```

### GET /students/certificates
Get all certificates earned by the student.

**Headers:**
```
Authorization: Bearer <student_token>
```

**Success Response:**
```json
{
  "certificates": [
    {
      "id": 1,
      "course": {
        "id": 1,
        "title": "Introduction to Programming"
      },
      "certificate_url": "https://certificates.skillbridge.com/cert_123.pdf",
      "created_at": "2025-09-10T00:00:00Z",
      "updated_at": "2025-09-10T00:00:00Z"
    }
  ]
}
```

### GET /students/certificates/:certificateId
Get specific certificate details.

**Headers:**
```
Authorization: Bearer <student_token>
```

**Success Response:**
```json
{
  "id": 1,
  "course": {
    "id": 1,
    "title": "Introduction to Programming"
  },
  "certificate_url": "https://certificates.skillbridge.com/cert_123.pdf",
  "created_at": "2025-09-10T00:00:00Z",
  "updated_at": "2025-09-10T00:00:00Z"
}
```

**Error Response:**
```json
{
  "error": "Certificate not found"
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
