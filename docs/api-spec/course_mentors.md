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
- `sort` (optional): Sort by (assigned_at, course_title)
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
        "description": "Learn basic programming concepts",
        "duration": "4 weeks"
      },
      "mentor": {
        "id": 1,
        "user": {
          "id": 1,
          "name": "Jane Smith",
          "email": "jane@example.com"
        },
        "expertise": "Programming and Mathematics",
        "is_active": true
      },
      "assigned_at": "2025-09-01T00:00:00Z"
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
    "description": "Learn basic programming concepts and fundamentals",
    "duration": "4 weeks",
    "students_enrolled": 25,
    "materials_count": 12,
    "created_at": "2025-08-15T00:00:00Z"
  },
  "mentor": {
    "id": 1,
    "user": {
      "id": 1,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "phone": "08123456789"
    },
    "expertise": "Programming and Mathematics",
    "bio": "Experienced educator with 5 years in programming instruction",
    "is_active": true
  },
  "assigned_at": "2025-09-01T00:00:00Z",
  "performance_stats": {
    "students_mentored": 25,
    "average_student_progress": 78,
    "materials_created": 3
  }
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
    "assigned_at": "2025-09-13T02:00:00Z"
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
    "description": "Learn basic programming concepts",
    "duration": "4 weeks"
  },
  "mentors": [
    {
      "id": 1,
      "assignment_id": 1,
      "mentor": {
        "id": 1,
        "user": {
          "name": "Jane Smith",
          "email": "jane@example.com"
        },
        "expertise": "Programming and Mathematics",
        "bio": "Experienced educator with 5 years in programming instruction",
        "is_active": true
      },
      "assigned_at": "2025-09-01T00:00:00Z",
      "students_mentored": 25
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
    "user": {
      "name": "Jane Smith",
      "email": "jane@example.com"
    },
    "expertise": "Programming and Mathematics",
    "is_active": true
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
      "assigned_at": "2025-09-01T00:00:00Z",
      "performance_stats": {
        "students_mentored": 25,
        "average_progress": 78,
        "materials_created": 3
      }
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
      "user": {
        "name": "John Mentor",
        "email": "john.mentor@example.com"
      },
      "expertise": "Web Development and React",
      "bio": "Senior web developer with 7 years experience",
      "is_active": true,
      "current_course_load": 1,
      "max_course_capacity": 3
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
  "active_assignments": 42,
  "assignments_this_month": 8,
  "average_mentors_per_course": 1.8,
  "average_courses_per_mentor": 2.1,
  "mentor_workload": [
    {
      "mentor_id": 1,
      "mentor_name": "Jane Smith",
      "courses_assigned": 3,
      "total_students": 75,
      "workload_percentage": 85
    }
  ],
  "course_coverage": [
    {
      "course_id": 1,
      "course_title": "Introduction to Programming",
      "mentors_assigned": 2,
      "students_per_mentor": 12.5
    }
  ],
  "monthly_breakdown": [
    {
      "month": "2025-09",
      "new_assignments": 8,
      "removed_assignments": 2
    }
  ]
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
    "mentor_id": 1,
    "removed_at": "2025-09-13T02:30:00Z"
  },
  "new_assignment": {
    "id": 15,
    "course_id": 1,
    "mentor_id": 3,
    "assigned_at": "2025-09-13T02:30:00Z"
  }
}
```

**Error Response:**
```json
{
  "error": "New mentor not found or assignment not found"
}
```

### GET /course-mentors/workload-analysis
Analyze mentor workload distribution.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Success Response:**
```json
{
  "workload_analysis": {
    "total_mentors": 15,
    "active_mentors": 12,
    "overloaded_mentors": 2,
    "underutilized_mentors": 3,
    "average_students_per_mentor": 18.5,
    "recommended_max_students": 25
  },
  "mentor_details": [
    {
      "mentor_id": 1,
      "mentor_name": "Jane Smith",
      "courses_assigned": 3,
      "total_students": 75,
      "workload_status": "overloaded",
      "recommendation": "Consider reducing course load or adding support"
    }
  ],
  "rebalancing_suggestions": [
    {
      "action": "transfer",
      "course_id": 3,
      "from_mentor": 1,
      "to_mentor": 5,
      "reason": "Balance workload"
    }
  ]
}
```

**Error Response:**
```json
{
  "error": "Unauthorized access"
}
```

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

*Last updated: 2025-09-13*
