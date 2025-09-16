# Forum Questions API Specification

This document describes the RESTful API endpoints for forum question management in the platform.

---

## Authentication
Most endpoints require authentication. Include the following HTTP header when required:

```
Authorization: Bearer <token>
```

---

## Endpoints

### GET /forum/questions
Get list of all forum questions.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by question title or content
- `student_id` (optional): Filter by student who asked
- `sort` (optional): Sort by (created_at, title, answers_count)
- `order` (optional): Sort order (asc, desc)

**Success Response:**
```json
{
  "questions": [
    {
      "id": 1,
      "student_id": 1,
      "title": "How to implement React hooks?",
      "message": "I'm having trouble understanding how to properly use React hooks in my components...",
      "student": {
        "id": 1,
        "name": "John Doe"
      },
      "answers_count": 3,
      "latest_answer": {
        "id": 5,
        "created_at": "2025-09-12T14:30:00Z",
        "user": {
          "name": "Jane Smith"
        }
      },
      "created_at": "2025-09-10T09:00:00Z",
      "updated_at": "2025-09-12T14:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "total_pages": 5
  }
}
```

**Error Response:**
```json
{
  "error": "Invalid pagination parameters"
}
```

### GET /forum/questions/:questionId
Get detailed information about a specific question with all answers.

**Success Response:**
```json
{
  "id": 1,
  "student_id": 1,
  "title": "How to implement React hooks?",
  "message": "I'm having trouble understanding how to properly use React hooks in my components. Specifically, I'm confused about useState and useEffect. Can someone provide some examples?",
  "student": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "answers": [
    {
      "id": 1,
      "user_id": 2,
  "message": "React hooks are functions that let you use state and other React features...",
      "user": {
        "id": 2,
        "name": "Jane Smith",
        "role": "mentor"
      },
      "created_at": "2025-09-10T10:30:00Z"
    }
  ],
  "answers_count": 3,
  "created_at": "2025-09-10T09:00:00Z"
}
```

**Error Response:**
```json
{
  "error": "Question not found"
}
```

### POST /forum/questions
Create a new forum question.

**Headers:**
```
Authorization: Bearer <student_token>
```

**Request:**
```json
{
  "title": "Best practices for API design?",
  "message": "I'm working on my first API project and wondering what are the best practices for designing RESTful APIs. Any recommendations?"
}
```

**Success Response:**
```json
{
  "message": "Question created successfully",
  "question": {
    "id": 2,
    "student_id": 1,
    "title": "Best practices for API design?",
    "message": "I'm working on my first API project and wondering what are the best practices for designing RESTful APIs. Any recommendations?",
    "created_at": "2025-09-13T01:00:00Z",
    "updated_at": "2025-09-13T01:00:00Z"
  }
}
```

**Error Response:**
```json
{
  "error": "Title and content are required"
}
```

### PUT /forum/questions/:questionId
Update an existing forum question.

**Headers:**
```
Authorization: Bearer <student_token>
```

**Request:**
```json
{
  "title": "Updated: Best practices for API design?",
  "message": "Updated content with more specific details about my API project..."
}
```

**Success Response:**
```json
{
  "message": "Question updated successfully",
  "question": {
    "id": 1,
    "student_id": 1,
    "title": "Updated: Best practices for API design?",
    "message": "Updated content with more specific details about my API project...",
    "created_at": "2025-09-10T09:00:00Z",
    "updated_at": "2025-09-13T02:00:00Z"
  }
}
```

**Error Response:**
```json
{
  "error": "Question not found or unauthorized"
}
```

### DELETE /forum/questions/:questionId
Delete a forum question.

**Headers:**
```
Authorization: Bearer <student_or_admin_token>
```

**Success Response:**
```json
{
  "message": "Question deleted successfully"
}
```

**Error Response:**
```json
{
  "error": "Question not found or unauthorized"
}
```

### GET /forum/questions/my-questions
Get questions asked by the current student.

**Headers:**
```
Authorization: Bearer <student_token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status (answered, unanswered)

**Success Response:**
```json
{
  "questions": [
    {
      "id": 1,
      "title": "How to implement React hooks?",
      "message": "I'm having trouble understanding...",
      "answers_count": 3,
      "latest_answer": {
        "created_at": "2025-09-12T14:30:00Z",
        "user": {
          "name": "Jane Smith"
        }
      },
      "created_at": "2025-09-10T09:00:00Z",
      "updated_at": "2025-09-12T14:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "total_pages": 1
  }
}
```

### GET /forum/questions/search
Advanced search for forum questions.

**Query Parameters:**
- `q`: Search query (title, message)
- `student_id` (optional): Filter by student
- `has_answers` (optional): Filter by whether question has answers (true/false)
- `date_from` (optional): Filter by creation date from
- `date_to` (optional): Filter by creation date to
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Success Response:**
```json
{
  "questions": [
    {
      "id": 1,
      "title": "How to implement React hooks?",
      "message": "I'm having trouble understanding...",
      "student": {
        "name": "John Doe"
      },
      "answers_count": 3,
      "relevance_score": 0.92,
      "created_at": "2025-09-10T09:00:00Z",
      "updated_at": "2025-09-12T14:30:00Z"
    }
  ],
  "search_metadata": {
    "query": "react hooks",
    "total_results": 8,
    "search_time_ms": 35
  },
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
  "error": "Search query is required"
}
```

### GET /forum/questions/popular
Get most popular questions (by answer count and recent activity).

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `timeframe` (optional): Time period (week, month, year, all)

**Success Response:**
```json
{
  "questions": [
    {
      "id": 1,
      "title": "How to implement React hooks?",
      "message": "I'm having trouble understanding...",
      "student": {
        "name": "John Doe"
      },
      "answers_count": 15,
      "created_at": "2025-09-10T09:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 20,
    "total_pages": 2
  }
}
```

### GET /forum/questions/unanswered
Get questions that haven't been answered yet.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `sort` (optional): Sort by (created_at, title)
- `order` (optional): Sort order (asc, desc)

**Success Response:**
```json
{
  "questions": [
    {
      "id": 5,
      "title": "Database optimization techniques?",
      "content": "What are some effective ways to optimize database queries...",
      "student": {
        "user": {
          "name": "Alice Johnson"
        }
      },
      "answers_count": 0,
      "created_at": "2025-09-12T16:00:00Z"
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

### GET /forum/questions/statistics
Get forum questions statistics.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Success Response:**
```json
{
  "total_questions": 150,
  "answered_questions": 135,
  "unanswered_questions": 15,
  "questions_this_month": 25,
  "questions_this_year": 150,
  "average_answers_per_question": 2.8,
  "most_active_students": [
    {
      "student_id": 1,
      "student_name": "John Doe",
      "questions_count": 12
    }
  ],
  "popular_topics": [
    {
      "topic": "react",
      "question_count": 28
    },
    {
      "topic": "javascript",
      "question_count": 35
    }
  ],
  "monthly_breakdown": [
    {
      "month": "2025-09",
      "questions": 25,
      "answers": 68
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

### POST /forum/questions/:questionId/report
Report a question for inappropriate content.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "reason": "inappropriate content",
  "description": "This question contains inappropriate language"
}
```

**Success Response:**
```json
{
  "message": "Question reported successfully",
  "report_id": 1
}
```

**Error Response:**
```json
{
  "error": "Reason is required"
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
