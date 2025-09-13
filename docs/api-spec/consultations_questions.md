# Consultations Questions API Specification

This document describes the RESTful API endpoints for consultation question management in the platform.

---

## Authentication
All endpoints require authentication. Include the following HTTP header:

```
Authorization: Bearer <token>
```

---

## Endpoints

### GET /consultations/questions
Get list of consultation questions.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `student_id` (optional): Filter by student (admin/mentor only)
- `job_topic` (optional): Filter by job topic ID
- `status` (optional): Filter by status (open, answered, closed)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `sort` (optional): Sort by (created_at, job_topic)
- `order` (optional): Sort order (asc, desc)

**Success Response:**
```json
{
  "questions": [
    {
      "id": 1,
      "student_id": 1,
      "job_topic": 1,
      "message": "I'm interested in applying for the Frontend Developer position. Could you provide guidance on what specific skills I should focus on?",
      "student": {
        "id": 1,
        "user": {
          "name": "John Doe",
          "email": "john@example.com"
        },
        "education_level": "SMA"
      },
      "job": {
        "id": 1,
        "title": "Frontend Developer",
        "company": "Tech Solutions Inc",
        "location": "Jakarta"
      },
      "answers_count": 2,
      "status": "answered",
      "latest_answer": {
        "id": 3,
        "created_at": "2025-09-12T14:30:00Z",
        "user": {
          "name": "Jane Smith",
          "role": "mentor"
        }
      },
      "created_at": "2025-09-10T09:00:00Z"
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
  "error": "Invalid filter parameters"
}
```

### GET /consultations/questions/:questionId
Get detailed information about a specific consultation question with all answers.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response:**
```json
{
  "id": 1,
  "student_id": 1,
  "job_topic": 1,
  "message": "I'm interested in applying for the Frontend Developer position. Could you provide guidance on what specific skills I should focus on? I have basic knowledge of HTML, CSS, and JavaScript but want to make sure I'm competitive.",
  "student": {
    "id": 1,
    "user": {
      "name": "John Doe",
      "email": "john@example.com"
    },
    "education_level": "SMA"
  },
  "job": {
    "id": 1,
    "title": "Frontend Developer",
    "description": "Join our team as a Frontend Developer...",
    "company": "Tech Solutions Inc",
    "requirements": "React, JavaScript, HTML, CSS",
    "location": "Jakarta"
  },
  "answers": [
    {
      "id": 1,
      "user_id": 2,
      "message": "Based on the job requirements, I recommend focusing on React framework...",
      "user": {
        "id": 2,
        "name": "Jane Smith",
        "role": "mentor"
      },
      "created_at": "2025-09-10T11:00:00Z"
    }
  ],
  "answers_count": 2,
  "status": "answered",
  "created_at": "2025-09-10T09:00:00Z"
}
```

**Error Response:**
```json
{
  "error": "Consultation question not found or unauthorized"
}
```

### POST /consultations/questions
Create a new consultation question.

**Headers:**
```
Authorization: Bearer <student_token>
```

**Request:**
```json
{
  "job_topic": 1,
  "message": "I'm very interested in the Backend Developer position at Innovation Labs. What programming languages and frameworks should I prioritize learning to be competitive for this role?"
}
```

**Success Response:**
```json
{
  "message": "Consultation question created successfully",
  "question": {
    "id": 5,
    "student_id": 1,
    "job_topic": 1,
    "message": "I'm very interested in the Backend Developer position...",
    "created_at": "2025-09-13T01:30:00Z"
  }
}
```

**Error Response:**
```json
{
  "error": "Job topic not found or message is required"
}
```

### PUT /consultations/questions/:questionId
Update an existing consultation question.

**Headers:**
```
Authorization: Bearer <student_token>
```

**Request:**
```json
{
  "message": "Updated question with more specific details about my background and career goals..."
}
```

**Success Response:**
```json
{
  "message": "Consultation question updated successfully",
  "question": {
    "id": 1,
    "student_id": 1,
    "job_topic": 1,
    "message": "Updated question with more specific details...",
    "created_at": "2025-09-10T09:00:00Z",
    "updated_at": "2025-09-13T02:00:00Z"
  }
}
```

**Error Response:**
```json
{
  "error": "Consultation question not found or unauthorized"
}
```

### DELETE /consultations/questions/:questionId
Delete a consultation question.

**Headers:**
```
Authorization: Bearer <student_or_admin_token>
```

**Success Response:**
```json
{
  "message": "Consultation question deleted successfully"
}
```

**Error Response:**
```json
{
  "error": "Consultation question not found or unauthorized"
}
```

### GET /consultations/questions/my-questions
Get consultation questions asked by the current student.

**Headers:**
```
Authorization: Bearer <student_token>
```

**Query Parameters:**
- `status` (optional): Filter by status (open, answered, closed)
- `job_topic` (optional): Filter by job topic ID
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Success Response:**
```json
{
  "questions": [
    {
      "id": 1,
      "job_topic": 1,
      "message": "I'm interested in applying for the Frontend Developer position...",
      "job": {
        "id": 1,
        "title": "Frontend Developer",
        "company": "Tech Solutions Inc"
      },
      "answers_count": 2,
      "status": "answered",
      "latest_answer": {
        "created_at": "2025-09-12T14:30:00Z",
        "user": {
          "name": "Jane Smith"
        }
      },
      "created_at": "2025-09-10T09:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 3,
    "total_pages": 1
  }
}
```

### GET /consultations/questions/by-job/:jobId
Get all consultation questions related to a specific job.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status

**Success Response:**
```json
{
  "job": {
    "id": 1,
    "title": "Frontend Developer",
    "company": "Tech Solutions Inc",
    "location": "Jakarta"
  },
  "questions": [
    {
      "id": 1,
      "student": {
        "user": {
          "name": "John Doe"
        }
      },
      "message": "I'm interested in applying for this position...",
      "answers_count": 2,
      "status": "answered",
      "created_at": "2025-09-10T09:00:00Z"
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
  "error": "Job not found"
}
```

### GET /consultations/questions/unanswered
Get consultation questions that haven't been answered yet.

**Headers:**
```
Authorization: Bearer <mentor_or_admin_token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `job_topic` (optional): Filter by job topic ID

**Success Response:**
```json
{
  "questions": [
    {
      "id": 5,
      "student": {
        "user": {
          "name": "Alice Johnson"
        },
        "education_level": "Vokasi"
      },
      "job": {
        "id": 2,
        "title": "Data Analyst",
        "company": "Analytics Corp"
      },
      "message": "What skills are most important for a data analyst role?",
      "answers_count": 0,
      "status": "open",
      "created_at": "2025-09-12T16:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 12,
    "total_pages": 2
  }
}
```

### PUT /consultations/questions/:questionId/status
Update the status of a consultation question.

**Headers:**
```
Authorization: Bearer <mentor_or_admin_token>
```

**Request:**
```json
{
  "status": "closed"
}
```

**Success Response:**
```json
{
  "message": "Question status updated successfully",
  "question": {
    "id": 1,
    "status": "closed",
    "updated_at": "2025-09-13T02:30:00Z"
  }
}
```

**Error Response:**
```json
{
  "error": "Invalid status or unauthorized"
}
```

### GET /consultations/questions/statistics
Get consultation questions statistics.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Success Response:**
```json
{
  "total_questions": 75,
  "open_questions": 12,
  "answered_questions": 58,
  "closed_questions": 5,
  "questions_this_month": 15,
  "questions_this_year": 75,
  "average_response_time_hours": 4.5,
  "most_popular_jobs": [
    {
      "job_id": 1,
      "job_title": "Frontend Developer",
      "questions_count": 18
    }
  ],
  "most_active_students": [
    {
      "student_id": 1,
      "student_name": "John Doe",
      "questions_count": 8
    }
  ],
  "monthly_breakdown": [
    {
      "month": "2025-09",
      "questions": 15,
      "answers": 32
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
