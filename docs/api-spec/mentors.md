# Mentors API Specification

This document describes the RESTful API endpoints for mentor operations in the platform.

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
  "forum_answers_given": 23,
  "average_student_progress": 78
}
```

**Error Response:**
```json
{
  "error": "Mentor not found"
}
```

### GET /mentors/profile
Get current mentor profile information.

**Headers:**
```
Authorization: Bearer <mentor_token>
```

**Success Response:**
```json
{
  "id": 1,
  "user_id": 1,
  "expertise": "Mathematics and Programming",
  "bio": "Experienced educator with 5 years in programming instruction",
  "is_active": true,
  "user": {
    "id": 1,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "08123456789",
    "created_at": "2025-09-13T00:00:00Z"
  }
}
```

**Error Response:**
```json
{
  "error": "Mentor profile not found"
}
```

### PUT /mentors/profile
Update mentor profile information.

**Headers:**
```
Authorization: Bearer <mentor_token>
```

**Request:**
```json
{
  "expertise": "Advanced Mathematics and Data Science",
  "bio": "Experienced educator with 6 years in programming and data science instruction"
}
```

**Success Response:**
```json
{
  "message": "Mentor profile updated successfully",
  "mentor": {
    "id": 1,
    "user_id": 1,
    "expertise": "Advanced Mathematics and Data Science",
    "bio": "Experienced educator with 6 years in programming and data science instruction",
    "is_active": true
  }
}
```

**Error Response:**
```json
{
  "error": "Invalid input data"
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
      "duration": "4 weeks",
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
  "duration": "4 weeks",
  "students_enrolled": 25,
  "average_progress": 78,
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
      "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
      },
      "education_level": "SMA",
      "progress_percentage": 85,
      "enrolled_at": "2025-09-01T00:00:00Z",
      "last_activity": "2025-09-12T15:30:00Z"
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
      "material_type": "text",
      "completion_rate": 92,
      "created_at": "2025-09-13T00:00:00Z"
    },
    {
      "id": 2,
      "title": "Programming Basics Video",
      "material_type": "video",
      "completion_rate": 78,
      "created_at": "2025-09-13T00:00:00Z"
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
  "content": "Detailed explanation of advanced programming concepts...",
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
    "title": "Advanced Programming Concepts",
    "material_type": "text",
    "created_at": "2025-09-13T00:00:00Z"
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
  "message": "Course material updated successfully"
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
    "user": {
      "name": "John Doe",
      "email": "john@example.com"
    },
    "education_level": "SMA"
  },
  "courses_progress": [
    {
      "course_id": 1,
      "course_title": "Introduction to Programming",
      "progress_percentage": 85,
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
Update mentor availability status.

**Headers:**
```
Authorization: Bearer <mentor_token>
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
  "message": "Mentor status updated successfully",
  "is_active": false
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

*Last updated: 2025-09-13*
