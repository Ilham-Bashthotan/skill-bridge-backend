# Consultations Answers API Specification

This document describes the RESTful API endpoints for consultation answer management in the platform.

---

## Authentication
All endpoints require authentication. Include the following HTTP header:

```
Authorization: Bearer <token>
```

---

## Endpoints

### GET /consultations/answers
Get list of consultation answers with filters.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `consultations_question_id` (optional): Filter by specific consultation question
- `user_id` (optional): Filter by user who answered
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `sort` (optional): Sort by (created_at, helpful_count)
- `order` (optional): Sort order (asc, desc)

**Success Response:**
```json
{
  "answers": [
    {
      "id": 1,
      "consultations_question_id": 1,
      "user_id": 2,
      "message": "Based on the job requirements for the Frontend Developer position, I recommend focusing on these key areas...",
      "user": {
        "id": 2,
        "name": "Jane Smith",
        "role": "mentor",
        "expertise": "Frontend Development and React"
      },
      "consultation_question": {
        "id": 1,
        "message": "I'm interested in applying for the Frontend Developer position...",
        "job": {
          "id": 1,
          "title": "Frontend Developer",
          "company": "Tech Solutions Inc"
        },
        "student": {
          "user": {
            "name": "John Doe"
          }
        }
      },
      "helpful_count": 3,
      "is_helpful": false,
      "created_at": "2025-09-10T11:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 125,
    "total_pages": 13
  }
}
```

**Error Response:**
```json
{
  "error": "Invalid filter parameters"
}
```

### GET /consultations/answers/:answerId
Get detailed information about a specific consultation answer.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response:**
```json
{
  "id": 1,
  "consultations_question_id": 1,
  "user_id": 2,
  "message": "Based on the job requirements for the Frontend Developer position, I recommend focusing on these key areas:\n\n1. **React Framework**: This is mentioned in the requirements, so build several projects using React\n2. **JavaScript ES6+**: Master modern JavaScript features\n3. **CSS Frameworks**: Learn Bootstrap or Tailwind CSS\n4. **Version Control**: Make sure you're comfortable with Git\n\nI'd suggest creating a portfolio with 3-4 React projects that showcase these skills. Would you like specific project recommendations?",
  "user": {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role": "mentor",
    "expertise": "Frontend Development and React",
    "bio": "Experienced frontend developer with 5+ years in React development"
  },
  "consultation_question": {
    "id": 1,
    "message": "I'm interested in applying for the Frontend Developer position. Could you provide guidance on what specific skills I should focus on?",
    "job": {
      "id": 1,
      "title": "Frontend Developer",
      "company": "Tech Solutions Inc",
      "requirements": "React, JavaScript, HTML, CSS",
      "location": "Jakarta"
    },
    "student": {
      "id": 1,
      "user": {
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  },
  "helpful_count": 3,
  "is_helpful": false,
  "created_at": "2025-09-10T11:00:00Z"
}
```

**Error Response:**
```json
{
  "error": "Consultation answer not found or unauthorized"
}
```

### POST /consultations/answers
Create a new consultation answer.

**Headers:**
```
Authorization: Bearer <mentor_or_admin_token>
```

**Request:**
```json
{
  "consultations_question_id": 1,
  "message": "For the Backend Developer position, I recommend focusing on:\n\n1. Node.js and Express.js framework\n2. Database design (both SQL and NoSQL)\n3. RESTful API development\n4. Authentication and security best practices\n\nStart with building a few API projects to demonstrate these skills."
}
```

**Success Response:**
```json
{
  "message": "Consultation answer created successfully",
  "answer": {
    "id": 25,
    "consultations_question_id": 1,
    "user_id": 2,
    "message": "For the Backend Developer position, I recommend focusing on...",
    "created_at": "2025-09-13T01:45:00Z"
  }
}
```

**Error Response:**
```json
{
  "error": "Consultation question not found or message is required"
}
```

### PUT /consultations/answers/:answerId
Update an existing consultation answer.

**Headers:**
```
Authorization: Bearer <mentor_or_admin_token>
```

**Request:**
```json
{
  "message": "Updated answer with more detailed explanations and additional resources..."
}
```

**Success Response:**
```json
{
  "message": "Consultation answer updated successfully",
  "answer": {
    "id": 1,
    "consultations_question_id": 1,
    "user_id": 2,
    "message": "Updated answer with more detailed explanations...",
    "created_at": "2025-09-10T11:00:00Z",
    "updated_at": "2025-09-13T02:15:00Z"
  }
}
```

**Error Response:**
```json
{
  "error": "Consultation answer not found or unauthorized"
}
```

### DELETE /consultations/answers/:answerId
Delete a consultation answer.

**Headers:**
```
Authorization: Bearer <mentor_or_admin_token>
```

**Success Response:**
```json
{
  "message": "Consultation answer deleted successfully"
}
```

**Error Response:**
```json
{
  "error": "Consultation answer not found or unauthorized"
}
```

### GET /consultations/answers/question/:questionId
Get all answers for a specific consultation question.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `sort` (optional): Sort by (created_at, helpful_count)
- `order` (optional): Sort order (asc, desc)

**Success Response:**
```json
{
  "consultation_question": {
    "id": 1,
    "message": "I'm interested in applying for the Frontend Developer position...",
    "job": {
      "id": 1,
      "title": "Frontend Developer",
      "company": "Tech Solutions Inc"
    },
    "student": {
      "user": {
        "name": "John Doe"
      }
    },
    "created_at": "2025-09-10T09:00:00Z"
  },
  "answers": [
    {
      "id": 1,
      "user_id": 2,
      "message": "Based on the job requirements for the Frontend Developer position...",
      "user": {
        "id": 2,
        "name": "Jane Smith",
        "role": "mentor",
        "expertise": "Frontend Development"
      },
      "helpful_count": 3,
      "is_helpful": false,
      "created_at": "2025-09-10T11:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "total_pages": 1
  }
}
```

**Error Response:**
```json
{
  "error": "Consultation question not found"
}
```

### GET /consultations/answers/my-answers
Get consultation answers provided by the current user.

**Headers:**
```
Authorization: Bearer <mentor_or_admin_token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `sort` (optional): Sort by (created_at, helpful_count)
- `order` (optional): Sort order (asc, desc)

**Success Response:**
```json
{
  "answers": [
    {
      "id": 1,
      "consultations_question_id": 1,
      "message": "Based on the job requirements for the Frontend Developer position...",
      "consultation_question": {
        "id": 1,
        "message": "I'm interested in applying for the Frontend Developer position...",
        "job": {
          "title": "Frontend Developer",
          "company": "Tech Solutions Inc"
        },
        "student": {
          "user": {
            "name": "John Doe"
          }
        }
      },
      "helpful_count": 3,
      "created_at": "2025-09-10T11:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 18,
    "total_pages": 2
  }
}
```

### POST /consultations/answers/:answerId/helpful
Mark a consultation answer as helpful.

**Headers:**
```
Authorization: Bearer <student_token>
```

**Success Response:**
```json
{
  "message": "Answer marked as helpful successfully",
  "answer": {
    "id": 1,
    "helpful_count": 4,
    "is_helpful": true
  }
}
```

**Error Response:**
```json
{
  "error": "Answer not found or already marked as helpful"
}
```

### DELETE /consultations/answers/:answerId/helpful
Remove helpful mark from a consultation answer.

**Headers:**
```
Authorization: Bearer <student_token>
```

**Success Response:**
```json
{
  "message": "Helpful mark removed successfully",
  "answer": {
    "id": 1,
    "helpful_count": 3,
    "is_helpful": false
  }
}
```

**Error Response:**
```json
{
  "error": "Helpful mark not found"
}
```

### GET /consultations/answers/:answerId/helpful
Get users who marked an answer as helpful.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Success Response:**
```json
{
  "answer": {
    "id": 1,
    "message": "Based on the job requirements...",
    "helpful_count": 3
  },
  "helpful_marks": [
    {
      "id": 1,
      "user": {
        "id": 1,
        "name": "John Doe",
        "role": "student"
      },
      "marked_at": "2025-09-10T12:00:00Z"
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

**Error Response:**
```json
{
  "error": "Answer not found"
}
```

### GET /consultations/answers/statistics
Get consultation answers statistics.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Success Response:**
```json
{
  "total_answers": 285,
  "answers_this_month": 45,
  "answers_this_year": 285,
  "average_answers_per_question": 3.8,
  "average_response_time_hours": 4.5,
  "most_helpful_mentors": [
    {
      "user_id": 2,
      "user_name": "Jane Smith",
      "answers_count": 42,
      "total_helpful_marks": 156,
      "average_helpful_per_answer": 3.7
    }
  ],
  "most_helpful_answers": [
    {
      "answer_id": 1,
      "message_preview": "Based on the job requirements...",
      "helpful_count": 15,
      "question_topic": "Frontend Developer at Tech Solutions Inc"
    }
  ],
  "monthly_breakdown": [
    {
      "month": "2025-09",
      "answers": 45,
      "helpful_marks": 128,
      "average_response_time_hours": 4.2
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

### GET /consultations/answers/search
Search consultation answers by content.

**Query Parameters:**
- `q`: Search query (message content)
- `consultations_question_id` (optional): Filter by specific question
- `user_id` (optional): Filter by user who answered
- `job_id` (optional): Filter by job topic
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Success Response:**
```json
{
  "answers": [
    {
      "id": 1,
      "consultations_question_id": 1,
      "message": "Based on the job requirements for the Frontend Developer position...",
      "user": {
        "name": "Jane Smith",
        "role": "mentor"
      },
      "consultation_question": {
        "job": {
          "title": "Frontend Developer",
          "company": "Tech Solutions Inc"
        }
      },
      "relevance_score": 0.94,
      "helpful_count": 3,
      "created_at": "2025-09-10T11:00:00Z"
    }
  ],
  "search_metadata": {
    "query": "frontend developer",
    "total_results": 12,
    "search_time_ms": 28
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 12,
    "total_pages": 2
  }
}
```

**Error Response:**
```json
{
  "error": "Search query is required"
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
