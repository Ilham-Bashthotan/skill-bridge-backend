# Course Mentors API Specification

This document describes the RESTful API endpoints for managing mentor-course assignments in the platform.

---

## Authentication
Most endpoints require authentication. Include the following HTTP header when required:

```
Authorization: Bearer <token>
```

---

## Endpoints

### GET /course-mentors
Get list of course-mentor assignments.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `course_id` (optional): Filter by specific course
- `mentor_id` (optional): Filter by specific mentor
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `sort` (optional): Sort by (created_at, course_title)
- `order` (optional): Sort order (asc, desc)

**Success Response:**
```json
{
  "assignments": [
    {
      "id": 1,
      "course_id": 1,
      "mentor_id": 1,
      "course": {
        "id": 1,
        "title": "Introduction to Programming",
        "description": "Learn basic programming concepts"
      },
      "mentor": {
        "id": 1,
        "name": "Jane Smith",
        "email": "jane@example.com",
        "bio": "Experienced educator with 5 years in programming instruction",
        "experience": "5 years"
      },
      "created_at": "2025-09-01T00:00:00Z",
      "updated_at": "2025-09-01T00:00:00Z"
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
  "error": "Unauthorized access"
}
```

### GET /course-mentors/:assignmentId
Get detailed information about a specific course-mentor assignment.

**Headers:**
```
Authorization: Bearer <admin_or_mentor_token>
```

**Success Response:**
```json
{
  "id": 1,
  "course_id": 1,
  "mentor_id": 1,
  "course": {
    "id": 1,
    "title": "Introduction to Programming",
    "description": "Learn basic programming concepts",
    "materials_count": 12,
    "created_at": "2025-08-15T00:00:00Z",
    "updated_at": "2025-08-20T00:00:00Z"
  },
  "mentor": {
    "id": 1,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "08123456789",
    "bio": "Experienced educator with 5 years in programming instruction",
    "experience": "5 years"
  },
  "created_at": "2025-09-01T00:00:00Z",
  "updated_at": "2025-09-01T00:00:00Z"
}
```

**Error Response:**
```json
{
  "error": "Assignment not found or unauthorized"
}
```

### POST /course-mentors
Assign a mentor to a course.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request:**
```json
{
  "course_id": 1,
  "mentor_id": 2
}
```

**Success Response:**
```json
{
  "message": "Mentor assigned to course successfully",
  "assignment": {
    "id": 5,
    "course_id": 1,
    "mentor_id": 2,
    "created_at": "2025-09-13T02:00:00Z",
    "updated_at": "2025-09-13T02:00:00Z"
  }
}
```

**Error Response:**
```json
{
  "error": "Course not found, mentor not found, or mentor already assigned to this course"
}
```

### DELETE /course-mentors/:assignmentId
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
  "error": "Assignment not found or unauthorized"
}
```

### GET /course-mentors/course/:courseId
Get all mentors assigned to a specific course.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response:**
```json
{
  "course": {
    "id": 1,
    "title": "Introduction to Programming",
    "description": "Learn basic programming concepts"
  },
  "mentors": [
    {
      "id": 1,
      "assignment_id": 1,
      "mentor": {
        "id": 1,
        "name": "Jane Smith",
        "email": "jane@example.com",
        "bio": "Experienced educator with 5 years in programming instruction",
        "experience": "5 years"
      },
      "created_at": "2025-09-01T00:00:00Z",
      "updated_at": "2025-09-01T00:00:00Z"
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

### GET /course-mentors/mentor/:mentorId
Get all courses assigned to a specific mentor.

**Headers:**
```
Authorization: Bearer <mentor_or_admin_token>
```

**Success Response:**
```json
{
  "mentor": {
    "id": 1,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "bio": "Experienced educator with 5 years in programming instruction",
    "experience": "5 years"
  },
  "courses": [
    {
      "id": 1,
      "assignment_id": 1,
      "course": {
        "id": 1,
        "title": "Introduction to Programming",
        "description": "Learn basic programming concepts",
        "duration": "4 weeks",
        "students_enrolled": 25
      },
      "created_at": "2025-09-01T00:00:00Z",
      "updated_at": "2025-09-01T00:00:00Z"
    }
  ]
}
```

**Error Response:**
```json
{
  "error": "Mentor not found or unauthorized"
}
```

### GET /course-mentors/available-mentors/:courseId
Get mentors available for assignment to a specific course.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Success Response:**
```json
{
  "course": {
    "id": 2,
    "title": "Advanced Web Development",
    "description": "Learn modern web development frameworks"
  },
  "available_mentors": [
    {
      "id": 2,
      "name": "John Mentor",
      "email": "john.mentor@example.com",
      "bio": "Senior web developer with 7 years experience",
      "experience": "7 years"
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

### GET /course-mentors/statistics
Get course-mentor assignment statistics.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Success Response:**
```json
{
  "total_assignments": 45,
  "assignments_this_month": 8,
  "average_mentors_per_course": 1.8,
  "average_courses_per_mentor": 2.1
}
```

**Error Response:**
```json
{
  "error": "Unauthorized access"
}
```

### PUT /course-mentors/:assignmentId/transfer
Transfer a course assignment from one mentor to another.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request:**
```json
{
  "new_mentor_id": 3,
  "reason": "Mentor workload balancing"
}
```

**Success Response:**
```json
{
  "message": "Course assignment transferred successfully",
  "old_assignment": {
    "id": 1,
    "mentor_id": 1
  },
  "new_assignment": {
    "id": 15,
    "course_id": 1,
    "mentor_id": 3,
    "created_at": "2025-09-13T02:30:00Z",
    "updated_at": "2025-09-13T02:30:00Z"
  }
}
```

**Error Response:**
```json
{
  "error": "New mentor not found or assignment not found"
}
```

// Removed workload analysis (derived analytics out of core scope)

### POST /course-mentors/bulk-assign
Assign multiple mentors to multiple courses in bulk.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request:**
```json
{
  "assignments": [
    {
      "course_id": 2,
      "mentor_id": 3
    },
    {
      "course_id": 3,
      "mentor_id": 4
    }
  ]
}
```

**Success Response:**
```json
{
  "message": "Bulk assignment completed",
  "successful_assignments": [
    {
      "id": 16,
      "course_id": 2,
      "mentor_id": 3,
      "assigned_at": "2025-09-13T03:00:00Z"
    }
  ],
  "failed_assignments": [
    {
      "course_id": 3,
      "mentor_id": 4,
      "error": "Mentor already assigned to this course"
    }
  ],
  "summary": {
    "total_requested": 2,
    "successful": 1,
    "failed": 1
  }
}
```

**Error Response:**
```json
{
  "error": "Invalid assignment data or unauthorized"
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
